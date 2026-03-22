from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, User
from database import users_collection
from auth import hash_password, verify_password, create_access_token, get_current_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one(
        {"$or": [{"username": user_data.username}, {"email": user_data.email}]}
    )
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Create user
    user_dict = {
        "id": str(uuid.uuid4()),
        "username": user_data.username,
        "email": user_data.email,
        "phone": user_data.phone,
        "password": hash_password(user_data.password),
        "balance": 0.0,
        "currency": "₹",
        "verified": False,
        "status": "active",
        "role": "user",
        "join_date": datetime.utcnow(),
        "total_bets": 0,
        "total_wins": 0,
        "total_deposits": 0.0,
        "total_withdrawals": 0.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await users_collection.insert_one(user_dict)
    
    # Remove MongoDB's _id field if it was added
    if "_id" in user_dict:
        del user_dict["_id"]
    
    # Create token
    access_token = create_access_token(data={"sub": user_dict["id"], "role": "user"})
    
    # Remove password from response
    del user_dict["password"]
    
    return {
        "user": user_dict,
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login")
async def login(credentials: UserLogin):
    # Find user
    user = await users_collection.find_one({"username": credentials.username})
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user["status"] != "active":
        raise HTTPException(status_code=403, detail="Account suspended")
    
    # Create token
    access_token = create_access_token(data={"sub": user["id"], "role": "user"})
    
    # Remove password and MongoDB _id from response
    del user["password"]
    if "_id" in user:
        del user["_id"]
    
    return {
        "user": user,
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/refresh")
async def refresh_token(current_user: User = Depends(get_current_user)):
    access_token = create_access_token(data={"sub": current_user.id, "role": "user"})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
