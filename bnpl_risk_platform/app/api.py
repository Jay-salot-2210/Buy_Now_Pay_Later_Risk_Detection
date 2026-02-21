from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.model import RiskModel
from src.inference import make_decision, get_recommended_limit, calculate_expected_profit
from src.stats import get_portfolio_stats

app = FastAPI(title="BNPL Risk Engine API", version="1.0")

# Enable CORS for React Frontend (default Vite port 5173 and fallback 5174)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = os.path.join(os.path.dirname(__file__), '../models/champion_model.pkl')
model = RiskModel(model_path)

settings = {
    'threshold': 0.15,
    'min_fico': 600,
    'max_dti': 40
}

class TransactionRequest(BaseModel):
    loan_amnt: float
    int_rate: float
    installment: float
    annual_inc: float
    dti: float
    fico_range_low: float
    revol_util: float
    total_acc: float
    open_acc: float
    pub_rec: float
    term_months: float = 36.0
    
    # Categorical Inputs (One-Hot style for API simplicity, or raw and processed? 
    # Usually API takes raw, but model takes processed. Since we moved processing to features.py,
    # let's assume the API receives RAW values and uses features.py logic, OR 
    # for this "Application Development" step, let's keep it simple and expect pre-processed or 
    # just the specific encoded keys expected by the model. 
    # Given the model expects one-hot columns like 'grade_A', 'purpose_car', let's ask for raw and process it?
    # But `model.py` just calls predict. 
    # Best practice: API accepts raw, calls `create_features` on single row.
    # We need to expose `create_features` availability here.
    
    grade: str # A, B, C...
    home_ownership: str # RENT, MORTGAGE...
    verification_status: str
    purpose: str

@app.get("/")
def health_check():
    return {"status": "active", "model_loaded": model.model is not None}

@app.get("/stats")
def get_stats():
    stats = get_portfolio_stats()
    return stats

@app.get("/settings")
def get_settings():
    return settings

@app.post("/settings")
def update_settings(new_settings: dict):
    global settings
    if 'threshold' in new_settings:
        settings['threshold'] = float(new_settings['threshold'])
    if 'min_fico' in new_settings:
        settings['min_fico'] = int(new_settings['min_fico'])
    if 'max_dti' in new_settings:
        settings['max_dti'] = int(new_settings['max_dti'])
    return settings

@app.post("/predict")
def predict(request: TransactionRequest):
    # Manual Feature Mapping for Real Data Schema
    # This must match src.features.create_features logic
    
    # 1. Start with numeric inputs
    # loan_amnt, int_rate, installment, annual_inc, dti, fico_range_low, revol_util, total_acc, open_acc, pub_rec, term_months
    
    # Create a dict with all model features initialized to 0
    # We need the list of features the model expects. 
    # Ideally we load this from a saved artifact, but for now we hardcode based on training knowledge.
    
    # Base numeric features
    features = {
        'loan_amnt': request.loan_amnt,
        'int_rate': request.int_rate,
        'installment': request.installment,
        'annual_inc': request.annual_inc,
        'dti': request.dti,
        'fico_range_low': request.fico_range_low,
        'revol_util': request.revol_util,
        'total_acc': request.total_acc,
        'open_acc': request.open_acc,
        'pub_rec': request.pub_rec,
        'term_months': request.term_months
    }
    
    # One-Hot Encoding Logic
    # We need to know all possible categories from training to ensure columns exist
    # Mapping request fields to 'grade_A', 'grade_B', etc.
    
    # Valid categories observed in training (Lending Club typicals)
    grades = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    home_ownerships = ['RENT', 'MORTGAGE', 'OWN', 'OTHER', 'NONE', 'ANY']
    verification_statuses = ['Verified', 'Source Verified', 'Not Verified']
    purposes = ['debt_consolidation', 'credit_card', 'home_improvement', 'other', 'major_purchase', 'medical', 'small_business', 'car', 'vacation', 'moving', 'house', 'wedding', 'renewable_energy', 'educational']

    # Set all categorical columns to 0
    for g in grades: features[f'grade_{g}'] = 0
    for h in home_ownerships: features[f'home_ownership_{h}'] = 0
    for v in verification_statuses: features[f'verification_status_{v}'] = 0
    for p in purposes: features[f'purpose_{p}'] = 0

    # Set active category to 1
    if f'grade_{request.grade}' in features: features[f'grade_{request.grade}'] = 1
    if f'home_ownership_{request.home_ownership}' in features: features[f'home_ownership_{request.home_ownership}'] = 1
    if f'verification_status_{request.verification_status}' in features: features[f'verification_status_{request.verification_status}'] = 1
    if f'purpose_{request.purpose}' in features: features[f'purpose_{request.purpose}'] = 1

    # Create DataFrame with correct column order
    # (LightGBM is somewhat robust to column order if using dataframe, but strict on names)
    data = pd.DataFrame([features])
    
    try:
        prob = model.predict_proba(data)[0]
    except Exception as e:
        print(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Model error: {str(e)}")
        
    decision = make_decision(
        prob, 
        request.loan_amnt,
        threshold=settings['threshold'],
        fico_score=request.fico_range_low,
        dti=request.dti,
        min_fico=settings['min_fico'],
        max_dti=settings['max_dti']
    )
    
    # Force probability to show high risk if rejected by business rules
    final_prob = 1.0 if decision == 'REJECT' and prob <= settings['threshold'] else float(prob)
    
    limit = get_recommended_limit(final_prob) if decision == 'APPROVE' else 0
    profit = calculate_expected_profit(final_prob, request.loan_amnt)
    
    return {
        "probability_of_default": final_prob,
        "decision": decision,
        "recommended_limit": limit,
        "expected_profit": float(profit)
    }
