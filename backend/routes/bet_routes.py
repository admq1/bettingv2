from fastapi import APIRouter, HTTPException, Depends
from models import BetCreate, Bet, User
from database import bets_collection, users_collection
from auth import get_current_user
from datetime import datetime
import uuid
from typing import List, Optional

router = APIRouter(prefix="/bets", tags=["Bets"])

@router.post("/", response_model=dict)
async def place_bet(bet_data: BetCreate, current_user: User = Depends(get_current_user)):
    # Check balance
    if current_user.balance < bet_data.stake:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Calculate potential win
    potential_win = bet_data.stake * bet_data.odds
    
    # Create bet
    bet_dict = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "username": current_user.username,
        "match_id": bet_data.match_id,
        "selection": bet_data.selection,
        "odds": bet_data.odds,
        "stake": bet_data.stake,
        "bet_type": bet_data.bet_type,
        "home_team": bet_data.home_team,
        "away_team": bet_data.away_team,
        "league": bet_data.league,
        "sport": bet_data.sport,
        "potential_win": potential_win,
        "status": "pending",
        "settled": False,
        "result": None,
        "created_at": datetime.utcnow(),
        "settled_at": None
    }
    
    # Insert bet
    await bets_collection.insert_one(bet_dict)
    
    # Remove MongoDB's _id field
    if "_id" in bet_dict:
        del bet_dict["_id"]
    
    # Deduct balance
    await users_collection.update_one(
        {"id": current_user.id},
        {
            "$inc": {"balance": -bet_data.stake, "total_bets": 1},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    return {
        "success": True,
        "bet_id": bet_dict["id"],
        "message": "Bet placed successfully",
        "bet": bet_dict
    }

@router.get("/my-bets", response_model=List[dict])
async def get_my_bets(
    status: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    query = {"user_id": current_user.id}
    if status:
        query["status"] = status
    
    bets = await bets_collection.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    for bet in bets:
        if "_id" in bet:
            bet["_id"] = str(bet["_id"])
    return bets

@router.get("/{bet_id}")
async def get_bet(bet_id: str, current_user: User = Depends(get_current_user)):
    bet = await bets_collection.find_one({"id": bet_id, "user_id": current_user.id})
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    if "_id" in bet:
        bet["_id"] = str(bet["_id"])
    return bet

@router.get("/stats/summary")
async def get_bet_stats(current_user: User = Depends(get_current_user)):
    total_bets = await bets_collection.count_documents({"user_id": current_user.id})
    won_bets = await bets_collection.count_documents({"user_id": current_user.id, "status": "won"})
    lost_bets = await bets_collection.count_documents({"user_id": current_user.id, "status": "lost"})
    pending_bets = await bets_collection.count_documents({"user_id": current_user.id, "status": "pending"})
    
    # Calculate total staked and winnings
    all_bets = await bets_collection.find({"user_id": current_user.id}).to_list(1000)
    total_staked = sum(bet.get("stake", 0) for bet in all_bets)
    total_winnings = sum(bet.get("potential_win", 0) for bet in all_bets if bet.get("status") == "won")
    
    win_rate = (won_bets / total_bets * 100) if total_bets > 0 else 0
    
    return {
        "total_bets": total_bets,
        "won_bets": won_bets,
        "lost_bets": lost_bets,
        "pending_bets": pending_bets,
        "total_staked": total_staked,
        "total_winnings": total_winnings,
        "win_rate": round(win_rate, 2),
        "balance": current_user.balance
    }
