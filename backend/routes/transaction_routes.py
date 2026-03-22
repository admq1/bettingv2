from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Body
from models import TransactionCreate, Transaction, User
from database import transactions_collection, users_collection, get_payment_settings
from auth import get_current_user
from datetime import datetime
import uuid
from typing import List, Optional
from pydantic import BaseModel
import os
import shutil


class DepositRequest(BaseModel):
    amount: float
    method: str = "QR Code"


class WithdrawalRequest(BaseModel):
    amount: float
    method: str = "UPI"
    upi_id: Optional[str] = None
    bank_account: Optional[str] = None

router = APIRouter(prefix="/transactions", tags=["Transactions"])

UPLOAD_DIR = "/app/backend/uploads/payment_screenshots"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/payment-settings")
async def get_payment_config():
    """Get payment settings including QR code"""
    settings = await get_payment_settings()
    if not settings:
        raise HTTPException(status_code=404, detail="Payment settings not configured")
    
    return {
        "qr_code_url": settings["qr_code_url"],
        "upi_id": settings["upi_id"],
        "bank_name": settings["bank_name"],
        "account_holder": settings["account_holder"],
        "min_deposit": settings["min_deposit"],
        "max_deposit": settings["max_deposit"],
        "min_withdrawal": settings["min_withdrawal"],
        "max_withdrawal": settings["max_withdrawal"],
        "deposit_fee_percent": settings["deposit_fee_percent"],
        "withdrawal_fee_percent": settings["withdrawal_fee_percent"]
    }

@router.post("/deposit", response_model=dict)
async def create_deposit(
    deposit_data: DepositRequest,
    current_user: User = Depends(get_current_user)
):
    amount = deposit_data.amount
    method = deposit_data.method
    settings = await get_payment_settings()
    
    # Validate amount
    if amount < settings["min_deposit"]:
        raise HTTPException(status_code=400, detail=f"Minimum deposit is {settings['min_deposit']}")
    if amount > settings["max_deposit"]:
        raise HTTPException(status_code=400, detail=f"Maximum deposit is {settings['max_deposit']}")
    
    # Create transaction
    transaction_dict = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "username": current_user.username,
        "amount": amount,
        "type": "deposit",
        "method": method,
        "status": "pending",
        "reference_id": f"DEP{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "qr_code_url": settings["qr_code_url"],
        "upi_id": settings["upi_id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await transactions_collection.insert_one(transaction_dict)
    
    # Remove MongoDB's _id field
    if "_id" in transaction_dict:
        del transaction_dict["_id"]
    
    return {
        "success": True,
        "transaction_id": transaction_dict["id"],
        "reference_id": transaction_dict["reference_id"],
        "qr_code_url": transaction_dict["qr_code_url"],
        "upi_id": transaction_dict["upi_id"],
        "amount": amount,
        "message": "Scan QR code or use UPI ID to complete payment. Upload payment screenshot after payment."
    }

@router.post("/upload-screenshot/{transaction_id}")
async def upload_payment_screenshot(
    transaction_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Find transaction
    transaction = await transactions_collection.find_one({
        "id": transaction_id,
        "user_id": current_user.id
    })
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{transaction_id}{file_extension}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update transaction
    await transactions_collection.update_one(
        {"id": transaction_id},
        {
            "$set": {
                "payment_screenshot": file_path,
                "status": "processing",
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "success": True,
        "message": "Screenshot uploaded. Your deposit will be processed within 10-30 minutes."
    }

@router.post("/withdraw", response_model=dict)
async def create_withdrawal(
    withdrawal_data: WithdrawalRequest,
    current_user: User = Depends(get_current_user)
):
    amount = withdrawal_data.amount
    method = withdrawal_data.method
    upi_id = withdrawal_data.upi_id
    bank_account = withdrawal_data.bank_account
    settings = await get_payment_settings()
    
    # Validate amount
    if amount < settings["min_withdrawal"]:
        raise HTTPException(status_code=400, detail=f"Minimum withdrawal is {settings['min_withdrawal']}")
    if amount > settings["max_withdrawal"]:
        raise HTTPException(status_code=400, detail=f"Maximum withdrawal is {settings['max_withdrawal']}")
    
    # Calculate fee
    fee = amount * (settings["withdrawal_fee_percent"] / 100)
    total_deduction = amount + fee
    
    # Check balance
    if current_user.balance < total_deduction:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create transaction
    transaction_dict = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "username": current_user.username,
        "amount": amount,
        "type": "withdrawal",
        "method": method,
        "status": "pending",
        "reference_id": f"WDR{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "upi_id": upi_id,
        "bank_account": bank_account,
        "fee": fee,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await transactions_collection.insert_one(transaction_dict)
    
    # Remove MongoDB's _id field
    if "_id" in transaction_dict:
        del transaction_dict["_id"]
    
    # Deduct balance
    await users_collection.update_one(
        {"id": current_user.id},
        {
            "$inc": {"balance": -total_deduction},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    return {
        "success": True,
        "transaction_id": transaction_dict["id"],
        "reference_id": transaction_dict["reference_id"],
        "amount": amount,
        "fee": fee,
        "total_deducted": total_deduction,
        "message": f"Withdrawal request submitted. Will be processed within {settings['withdrawal_processing_time']}"
    }

@router.get("/my-transactions", response_model=List[dict])
async def get_my_transactions(
    type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    query = {"user_id": current_user.id}
    if type:
        query["type"] = type
    if status:
        query["status"] = status
    
    transactions = await transactions_collection.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    
    # Convert ObjectId to string
    for transaction in transactions:
        if "_id" in transaction:
            transaction["_id"] = str(transaction["_id"])
    
    return transactions

@router.get("/{transaction_id}")
async def get_transaction(transaction_id: str, current_user: User = Depends(get_current_user)):
    transaction = await transactions_collection.find_one({
        "id": transaction_id,
        "user_id": current_user.id
    })
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if "_id" in transaction:
        transaction["_id"] = str(transaction["_id"])
    
    return transaction
