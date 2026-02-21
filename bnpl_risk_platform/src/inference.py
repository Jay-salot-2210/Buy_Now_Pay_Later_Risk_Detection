import numpy as np

def calculate_expected_profit(prob_default, amount, merchant_fee_rate=0.03, lgd=0.8, interest_rate=0.15):
    expected_interest = amount * interest_rate * 0.5 * (1 - prob_default)
    expected_revenue = (amount * merchant_fee_rate) + expected_interest
    
    expected_loss = amount * prob_default * lgd
    
    return expected_revenue - expected_loss

def get_recommended_limit(prob_default, base_limit=1000, max_limit=5000):
    if prob_default < 0.02:
        return max_limit
    elif prob_default < 0.05:
        return 3000
    elif prob_default < 0.10:
        return 1000
    elif prob_default < 0.20:
        return 500
    else:
        return 0

def make_decision(prob_default, amount, threshold=0.15, fico_score=None, dti=None, min_fico=600, max_dti=40):
    if fico_score is not None and fico_score < min_fico:
        return "REJECT"
    
    if dti is not None and dti > max_dti:
        return "REJECT"
    
    if prob_default > threshold:
        return "REJECT"
    
    return "APPROVE"
