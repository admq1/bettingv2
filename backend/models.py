from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Literal
from datetime import datetime
import uuid

# User Models
class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    balance: float = 0.0
    currency: str = "₹"
    verified: bool = False
    status: str = "active"
    role: str = "user"
    join_date: datetime = Field(default_factory=datetime.utcnow)
    total_bets: int = 0
    total_wins: int = 0
    total_deposits: float = 0.0
    total_withdrawals: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Bet Models
class BetCreate(BaseModel):
    match_id: str
    selection: str
    odds: float
    stake: float
    bet_type: Literal["single", "accumulator", "system"]
    home_team: str
    away_team: str
    league: str
    sport: str

class Bet(BetCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    username: str
    potential_win: float
    status: Literal["pending", "won", "lost", "cancelled"] = "pending"
    settled: bool = False
    result: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    settled_at: Optional[datetime] = None

# Transaction Models
class TransactionCreate(BaseModel):
    amount: float
    type: Literal["deposit", "withdrawal"]
    method: str

class Transaction(TransactionCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    username: str
    status: Literal["pending", "completed", "processing", "failed", "rejected"] = "pending"
    reference_id: Optional[str] = None
    qr_code_url: Optional[str] = None
    upi_id: Optional[str] = None
    payment_screenshot: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    id: str
    username: str
    role: str
    email: str

class BetSettlement(BaseModel):
    bet_id: str
    result: Literal["won", "lost"]
    admin_notes: Optional[str] = None

class TransactionAction(BaseModel):
    transaction_id: str
    action: Literal["approve", "reject"]
    admin_notes: Optional[str] = None

class UserUpdate(BaseModel):
    status: Optional[str] = None
    verified: Optional[bool] = None
    balance: Optional[float] = None

# Payment Settings Model
class PaymentSettings(BaseModel):
    qr_code_url: str
    upi_id: str
    bank_name: str = "Central Bank of India"
    account_holder: str = "VIRENDRA KUMAR"
    min_deposit: float = 100.0
    max_deposit: float = 100000.0
    min_withdrawal: float = 500.0
    max_withdrawal: float = 100000.0
    withdrawal_processing_time: str = "24-48 hours"
    deposit_fee_percent: float = 0.0
    withdrawal_fee_percent: float = 2.0

# Stats Models
class AdminStats(BaseModel):
    total_users: int
    active_users: int
    verified_users: int
    total_bets: int
    pending_bets: int
    won_bets: int
    lost_bets: int
    total_deposits: float
    total_withdrawals: float
    pending_withdrawals: float
    revenue: float
    today_stats: dict

class UserStats(BaseModel):
    total_bets: int
    won_bets: int
    lost_bets: int
    pending_bets: int
    total_staked: float
    total_winnings: float
    win_rate: float
    balance: float
    total_deposits: float
    total_withdrawals: float
