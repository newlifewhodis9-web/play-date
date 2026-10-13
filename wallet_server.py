from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
import uvicorn

app = FastAPI(
    title="Play-Date Wallet & Payout Engine",
    description="Handles user coin balances, ad-revenue splits, and instant payouts.",
    version="1.0.0"
)

# -------------------------------------------------------------------
# CONSTANTS & CONFIGURATION
# -------------------------------------------------------------------
COINS_PER_DOLLAR = 10000        # 10,000 Coins = $1.00 USD
MINIMUM_CASHOUT_USD = 5.00      # Minimum withdrawal amount
USER_AD_SPLIT = 0.30            # User gets 30% of gross ad value
APP_AD_SPLIT = 0.70             # Play-Date retains 70% for operations & profit

# -------------------------------------------------------------------
# DATA MODELS
# -------------------------------------------------------------------
class PayoutMethod(str, Enum):
    CASH_APP = "cash_app"
    PAYPAL = "paypal"
    DEBIT_CARD = "debit_card"

class AdRewardRequest(BaseModel):
    user_id: str
    gross_ad_revenue_usd: float = Field(..., gt=0, description="Gross value of ad impression")

class PayoutRequest(BaseModel):
    user_id: str
    payout_method: PayoutMethod
    cash_app_tag: Optional[str] = Field(None, description="$cashtag if paying out via Cash App")
    paypal_email: Optional[str] = Field(None, description="Email if paying out via PayPal")
    card_token: Optional[str] = Field(None, description="Stripe card token for debit card cashout")
    amount_usd: float = Field(..., ge=MINIMUM_CASHOUT_USD, description="Amount to cash out in USD")

# -------------------------------------------------------------------
# MOCK DATABASE (In-Memory for Development)
# -------------------------------------------------------------------
db_users = {
    "user_123": {
        "coin_balance": 55000,          # 55,000 coins = $5.50
        "cashtag": "$JohnDoePlay",
        "paypal_email": "john@example.com",
        "total_earned_usd": 5.50
    }
}

db_app_ledger = {
    "retained_ad_revenue_usd": 0.0,
    "total_payouts_processed_usd": 0.0
}

# -------------------------------------------------------------------
# API ENDPOINTS
# -------------------------------------------------------------------

@app.get("/")
def read_root():
    return {"status": "Play-Date Wallet Server Running"}

@app.get("/wallet/{user_id}")
def get_wallet_balance(user_id: str):
    """Fetch live user coin balance, cash value, and payout settings."""
    user = db_users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    coins = user["coin_balance"]
    cash_value_usd = round(coins / COINS_PER_DOLLAR, 2)
    
    return {
        "user_id": user_id,
        "coin_balance": coins,
        "cash_value_usd": cash_value_usd,
        "can_cashout": cash_value_usd >= MINIMUM_CASHOUT_USD,
        "minimum_cashout_usd": MINIMUM_CASHOUT_USD,
        "cashtag": user.get("cashtag"),
        "paypal_email": user.get("paypal_email")
    }

@app.post("/wallet/reward-ad")
def process_ad_reward(reward: AdRewardRequest):
    """
    Called when a user views an ad in the Feed or Games Arcade.
    Splits revenue 70% to Play-Date / 30% converted to user coins.
    """
    user = db_users.get(reward.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate revenue splits
    user_share_usd = reward.gross_ad_revenue_usd * USER_AD_SPLIT
    app_share_usd = reward.gross_ad_revenue_usd * APP_AD_SPLIT
    
    # Convert user share to coins
    earned_coins = int(user_share_usd * COINS_PER_DOLLAR)
    
    # Update balances
    user["coin_balance"] += earned_coins
    user["total_earned_usd"] += user_share_usd
    db_app_ledger["retained_ad_revenue_usd"] += app_share_usd
    
    return {
        "status": "success",
        "earned_coins": earned_coins,
        "new_coin_balance": user["coin_balance"],
        "new_cash_value_usd": round(user["coin_balance"] / COINS_PER_DOLLAR, 2)
    }

@app.post("/wallet/cashout")
def request_payout(payout: PayoutRequest):
    """
    Processes a payout to Cash App ($cashtag), PayPal, or Debit Card.
    """
    user = db_users.get(payout.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_cash_value = user["coin_balance"] / COINS_PER_DOLLAR
    
    # Check minimum cashout rule
    if payout.amount_usd < MINIMUM_CASHOUT_USD:
        raise HTTPException(
            status_code=400, 
            detail=f"Minimum cashout amount is ${MINIMUM_CASHOUT_USD:.2f}"
        )
    
    # Check sufficient funds
    if payout.amount_usd > current_cash_value:
        raise HTTPException(status_code=400, detail="Insufficient coin balance")
    
    # Validate destination input
    destination = ""
    if payout.payout_method == PayoutMethod.CASH_APP:
        tag = payout.cash_app_tag or user.get("cashtag")
        if not tag or not tag.startswith("$"):
            raise HTTPException(status_code=400, detail="Valid Cash App $cashtag required")
        destination = tag
    elif payout.payout_method == PayoutMethod.PAYPAL:
        email = payout.paypal_email or user.get("paypal_email")
        if not email or "@" not in email:
            raise HTTPException(status_code=400, detail="Valid PayPal email required")
        destination = email
    elif payout.payout_method == PayoutMethod.DEBIT_CARD:
        if not payout.card_token:
            raise HTTPException(status_code=400, detail="Valid card token required")
        destination = "Debit Card ending in ****"

    # Deduct coins from user balance
    coins_to_deduct = int(payout.amount_usd * COINS_PER_DOLLAR)
    user["coin_balance"] -= coins_to_deduct
    db_app_ledger["total_payouts_processed_usd"] += payout.amount_usd
    
    return {
        "status": "payout_initiated",
        "amount_usd": payout.amount_usd,
        "payout_method": payout.payout_method.value,
        "destination": destination,
        "remaining_coin_balance": user["coin_balance"],
        "remaining_cash_value_usd": round(user["coin_balance"] / COINS_PER_DOLLAR, 2)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

