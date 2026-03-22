from fastapi import APIRouter, HTTPException, Depends
from models import AdminLogin, AdminUser, BetSettlement, TransactionAction, UserUpdate, AdminStats
from database import (
    admins_collection, users_collection, bets_collection, 
    transactions_collection, get_payment_settings, update_payment_settings
)
from auth import verify_password, create_access_token, get_current_admin
from datetime import datetime, timedelta
from typing import List, Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login")
async def admin_login(credentials: AdminLogin):
    admin = await admins_collection.find_one({"username": credentials.username})
    
    if not admin or not verify_password(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": admin["username"], "role": "admin"}
    )
    
    return {
        "admin": {
            "id": str(admin["_id"]),
            "username": admin["username"],
            "role": admin["role"],
            "email": admin["email"]
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

# Stats Endpoints
@router.get("/stats", response_model=dict)
async def get_admin_stats(admin: AdminUser = Depends(get_current_admin)):
    # User stats
    total_users = await users_collection.count_documents({})
    active_users = await users_collection.count_documents({"status": "active"})
    verified_users = await users_collection.count_documents({"verified": True})
    
    # Bet stats
    total_bets = await bets_collection.count_documents({})
    pending_bets = await bets_collection.count_documents({"status": "pending"})
    won_bets = await bets_collection.count_documents({"status": "won"})
    lost_bets = await bets_collection.count_documents({"status": "lost"})
    
    # Transaction stats
    deposits = await transactions_collection.find({"type": "deposit", "status": "completed"}).to_list(10000)
    withdrawals = await transactions_collection.find({"type": "withdrawal", "status": "completed"}).to_list(10000)
    pending_withdrawals = await transactions_collection.find({"type": "withdrawal", "status": "pending"}).to_list(1000)
    
    total_deposits = sum(t.get("amount", 0) for t in deposits)
    total_withdrawals = sum(t.get("amount", 0) for t in withdrawals)
    pending_withdrawal_amount = sum(t.get("amount", 0) for t in pending_withdrawals)
    
    # Revenue calculation
    revenue = total_deposits - total_withdrawals
    
    # Today's stats
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_bets = await bets_collection.count_documents({"created_at": {"$gte": today_start}})
    today_deposits_list = await transactions_collection.find({
        "type": "deposit",
        "status": "completed",
        "created_at": {"$gte": today_start}
    }).to_list(1000)
    today_withdrawals_list = await transactions_collection.find({
        "type": "withdrawal",
        "status": "completed",
        "created_at": {"$gte": today_start}
    }).to_list(1000)
    
    today_deposits = sum(t.get("amount", 0) for t in today_deposits_list)
    today_withdrawals = sum(t.get("amount", 0) for t in today_withdrawals_list)
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "verified_users": verified_users,
        "total_bets": total_bets,
        "pending_bets": pending_bets,
        "won_bets": won_bets,
        "lost_bets": lost_bets,
        "total_deposits": total_deposits,
        "total_withdrawals": total_withdrawals,
        "pending_withdrawals": pending_withdrawal_amount,
        "revenue": revenue,
        "today_stats": {
            "bets": today_bets,
            "deposits": today_deposits,
            "withdrawals": today_withdrawals
        }
    }

# User Management
@router.get("/users", response_model=List[dict])
async def get_all_users(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    admin: AdminUser = Depends(get_current_admin)
):
    query = {}
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"username": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    
    users = await users_collection.find(query).skip(skip).limit(limit).to_list(limit)
    
    # Remove passwords and convert ObjectId to string
    for user in users:
        if "password" in user:
            del user["password"]
        if "_id" in user:
            user["_id"] = str(user["_id"])
    
    return users

@router.get("/users/{user_id}")
async def get_user_details(
    user_id: str,
    admin: AdminUser = Depends(get_current_admin)
):
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if "password" in user:
        del user["password"]
    if "_id" in user:
        user["_id"] = str(user["_id"])
    
    # Get user's bets and transactions
    user_bets = await bets_collection.find({"user_id": user_id}).limit(10).to_list(10)
    user_transactions = await transactions_collection.find({"user_id": user_id}).limit(10).to_list(10)
    
    for bet in user_bets:
        if "_id" in bet:
            bet["_id"] = str(bet["_id"])
    for txn in user_transactions:
        if "_id" in txn:
            txn["_id"] = str(txn["_id"])
    
    return {
        "user": user,
        "recent_bets": user_bets,
        "recent_transactions": user_transactions
    }

@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    admin: AdminUser = Depends(get_current_admin)
):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await users_collection.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True, "message": "User updated successfully"}

# Bet Management
@router.get("/bets", response_model=List[dict])
async def get_all_bets(
    status: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    admin: AdminUser = Depends(get_current_admin)
):
    query = {}
    if status:
        query["status"] = status
    
    bets = await bets_collection.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    for bet in bets:
        if "_id" in bet:
            bet["_id"] = str(bet["_id"])
    return bets

@router.post("/bets/settle")
async def settle_bet(
    settlement: BetSettlement,
    admin: AdminUser = Depends(get_current_admin)
):
    bet = await bets_collection.find_one({"id": settlement.bet_id})
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    
    if bet["settled"]:
        raise HTTPException(status_code=400, detail="Bet already settled")
    
    # Update bet
    await bets_collection.update_one(
        {"id": settlement.bet_id},
        {
            "$set": {
                "status": settlement.result,
                "settled": True,
                "result": settlement.result,
                "admin_notes": settlement.admin_notes,
                "settled_at": datetime.utcnow()
            }
        }
    )
    
    # If won, credit user account
    if settlement.result == "won":
        await users_collection.update_one(
            {"id": bet["user_id"]},
            {
                "$inc": {
                    "balance": bet["potential_win"],
                    "total_wins": 1
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
    
    return {"success": True, "message": f"Bet settled as {settlement.result}"}

# Transaction Management
@router.get("/transactions", response_model=List[dict])
async def get_all_transactions(
    type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    admin: AdminUser = Depends(get_current_admin)
):
    query = {}
    if type:
        query["type"] = type
    if status:
        query["status"] = status
    
    transactions = await transactions_collection.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    for transaction in transactions:
        if "_id" in transaction:
            transaction["_id"] = str(transaction["_id"])
    return transactions

@router.post("/transactions/action")
async def process_transaction(
    action_data: TransactionAction,
    admin: AdminUser = Depends(get_current_admin)
):
    transaction = await transactions_collection.find_one({"id": action_data.transaction_id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction["status"] not in ["pending", "processing"]:
        raise HTTPException(status_code=400, detail="Transaction already processed")
    
    if action_data.action == "approve":
        new_status = "completed"
        
        # If deposit, credit user account
        if transaction["type"] == "deposit":
            await users_collection.update_one(
                {"id": transaction["user_id"]},
                {
                    "$inc": {
                        "balance": transaction["amount"],
                        "total_deposits": transaction["amount"]
                    },
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        
        # If withdrawal, update total withdrawals
        if transaction["type"] == "withdrawal":
            await users_collection.update_one(
                {"id": transaction["user_id"]},
                {
                    "$inc": {"total_withdrawals": transaction["amount"]},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        
        message = "Transaction approved"
    else:
        new_status = "rejected"
        
        # If withdrawal was rejected, refund the amount
        if transaction["type"] == "withdrawal":
            refund_amount = transaction["amount"] + transaction.get("fee", 0)
            await users_collection.update_one(
                {"id": transaction["user_id"]},
                {
                    "$inc": {"balance": refund_amount},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        
        message = "Transaction rejected"
    
    # Update transaction
    await transactions_collection.update_one(
        {"id": action_data.transaction_id},
        {
            "$set": {
                "status": new_status,
                "admin_notes": action_data.admin_notes,
                "processed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"success": True, "message": message}

# Payment Settings
@router.get("/payment-settings")
async def get_admin_payment_settings(admin: AdminUser = Depends(get_current_admin)):
    settings = await get_payment_settings()
    return settings

@router.put("/payment-settings")
async def update_admin_payment_settings(
    settings: dict,
    admin: AdminUser = Depends(get_current_admin)
):
    updated_settings = await update_payment_settings(settings)
    return {"success": True, "settings": updated_settings}
