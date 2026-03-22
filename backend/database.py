from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import bcrypt
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb+srv://adityasinghd6_db_user:2yqcDD8hogFGUfMn@cluster0.jlhyh0k.mongodb.net/rudra_db?retryWrites=true&w=majority')
db_name = os.environ.get('DB_NAME', 'rudra_db')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Collections
users_collection = db.users
bets_collection = db.bets
transactions_collection = db.transactions
admins_collection = db.admins
settings_collection = db.settings

async def init_db():
    """Initialize database with indexes and default data"""
    
    # Create indexes
    await users_collection.create_index("username", unique=True)
    await users_collection.create_index("email", unique=True)
    await bets_collection.create_index("user_id")
    await bets_collection.create_index("status")
    await transactions_collection.create_index("user_id")
    await transactions_collection.create_index("status")
    await transactions_collection.create_index("type")
    
    # Create default admin if not exists
    admin_exists = await admins_collection.find_one({"username": "admin"})
    if not admin_exists:
        hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
        await admins_collection.insert_one({
            "username": "admin",
            "password": hashed_password.decode('utf-8'),
            "role": "super_admin",
            "email": "admin@rudrabet.com",
            "created_at": datetime.utcnow()
        })
    
    # Create default payment settings
    settings_exists = await settings_collection.find_one({"type": "payment"})
    if not settings_exists:
        await settings_collection.insert_one({
            "type": "payment",
            "qr_code_url": "https://customer-assets.emergentagent.com/job_jovial-greider-5/artifacts/blulm3bs_WhatsApp%20Image%202026-03-21%20at%209.41.08%20PM.jpeg",
            "upi_id": "20251208730654-iservuqrsbrp@cbin",
            "bank_name": "Central Bank of India",
            "account_holder": "VIRENDRA KUMAR",
            "min_deposit": 100.0,
            "max_deposit": 100000.0,
            "min_withdrawal": 500.0,
            "max_withdrawal": 100000.0,
            "withdrawal_processing_time": "24-48 hours",
            "deposit_fee_percent": 0.0,
            "withdrawal_fee_percent": 2.0,
            "updated_at": datetime.utcnow()
        })

async def get_payment_settings():
    """Get payment settings"""
    settings = await settings_collection.find_one({"type": "payment"})
    return settings

async def update_payment_settings(settings: dict):
    """Update payment settings"""
    settings["updated_at"] = datetime.utcnow()
    await settings_collection.update_one(
        {"type": "payment"},
        {"$set": settings},
        upsert=True
    )
    return settings
