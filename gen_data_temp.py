import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

np.random.seed(42)
random.seed(42)

NUM_USERS = 5000
NUM_TRANSACTIONS = 50000

def generate_users(n):
    users = []
    for i in range(n):
        uid = f'U{i:05d}'
        age = np.random.randint(18, 70)
        income = np.random.normal(50000, 15000)
        employment_status = np.random.choice(['Employed', 'Self-Employed', 'Unemployed', 'Student'], p=[0.6, 0.2, 0.05, 0.15])
        credit_score_proxy = int(np.random.normal(650, 100))
        credit_score_proxy = max(300, min(850, credit_score_proxy))
        
        users.append({
            'user_id': uid,
            'age': age,
            'annual_income': round(income, 2),
            'employment_status': employment_status,
            'credit_score_external': credit_score_proxy
        })
    return pd.DataFrame(users)

def generate_transactions(users_df, n_txn):
    user_ids = users_df['user_id'].values
    merchant_categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Groceries']
    
    transactions = []
    start_date = datetime.now() - timedelta(days=365)
    
    for i in range(n_txn):
        tid = f'TXN{i:06d}'
        uid = np.random.choice(user_ids)
        category = np.random.choice(merchant_categories)
        amount = np.random.exponential(150)
        amount = max(10, min(2000, amount))
        
        txn_date = start_date + timedelta(days=np.random.randint(0, 365))
        
        is_default = 0
        user_risk = users_df.loc[users_df['user_id'] == uid, 'credit_score_external'].values[0]
        
        base_prob = 0.05
        if user_risk < 500: base_prob += 0.2
        if category == 'Electronics': base_prob += 0.05
        if amount > 500: base_prob += 0.1
        
        if np.random.random() < base_prob:
            is_default = 1
            
        transactions.append({
            'transaction_id': tid,
            'user_id': uid,
            'transaction_date': txn_date,
            'amount': round(amount, 2),
            'merchant_category': category,
            'is_default': is_default
        })
        
    return pd.DataFrame(transactions)

print("Generating users...")
users_df = generate_users(NUM_USERS)
print("Generating transactions...")
txn_df = generate_transactions(users_df, NUM_TRANSACTIONS)
transactions_df = txn_df.merge(users_df, on='user_id', how='left')

output_path = 'bnpl_risk_platform/data/raw/synthetic_bnpl_data.csv'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
transactions_df.to_csv(output_path, index=False)
print(f"Data saved to {output_path}")
