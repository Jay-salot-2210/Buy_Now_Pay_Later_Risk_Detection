import pandas as pd
import os
from src.data_utils import load_data

def get_portfolio_stats(data_path=None):
    if data_path is None:
        base_path = os.path.dirname(os.path.dirname(__file__))
        data_path = os.path.join(base_path, 'data/processed/real_bnpl_features.csv')
        
        if not os.path.exists(data_path):
            data_path = os.path.join(base_path, 'data/raw/LendingClub_data.csv')
    
    try:
        df = pd.read_csv(data_path)
        
        total_transactions = len(df)
        total_volume = df['loan_amnt'].sum() if 'loan_amnt' in df.columns else 0
        
        default_rate = df['is_default'].mean() if 'is_default' in df.columns else 0
        
        avg_fico = df['fico_range_low'].mean() if 'fico_range_low' in df.columns else 0
        
        approval_rate = 1 - default_rate
        
        risk_alerts = default_rate
        
        stats = {
            'total_transactions': int(total_transactions),
            'total_volume': float(total_volume),
            'default_rate': float(default_rate),
            'approval_rate': float(approval_rate),
            'avg_fico': int(avg_fico),
            'risk_alerts': float(risk_alerts)
        }
        
        return stats
        
    except Exception as e:
        return {
            'total_transactions': 0,
            'total_volume': 0.0,
            'default_rate': 0.0,
            'approval_rate': 0.0,
            'avg_fico': 0,
            'risk_alerts': 0.0,
            'error': str(e)
        }
