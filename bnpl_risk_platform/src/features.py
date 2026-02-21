import pandas as pd
import numpy as np

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms raw Lending Club data into features for the risk model.
    """
    # 1. Target Definition
    # Filter for finalized loan statuses
    valid_status = ['Fully Paid', 'Charged Off', 'Default', 'Does not meet the credit policy. Status:Fully Paid', 'Does not meet the credit policy. Status:Charged Off']
    df = df[df['loan_status'].isin(valid_status)].copy()
    
    # Target: 1 if Default/Charged Off, 0 if Fully Paid
    bad_indicators = ['Charged Off', 'Default', 'Does not meet the credit policy. Status:Charged Off']
    df['is_default'] = df['loan_status'].apply(lambda x: 1 if x in bad_indicators else 0)
    
    # 2. Financial Conversions
    # Handle int_rate which might be string '10.5%'
    if df['int_rate'].dtype == 'object':
        df['int_rate'] = df['int_rate'].str.strip(' %').astype(float)
        
    # Handle revol_util which matches '50%'
    if df['revol_util'].dtype == 'object':
        df['revol_util'] = df['revol_util'].str.strip(' %').astype(float)

    # 3. Feature Selection & Mapping
    # Map real columns to our standardized feature set names where possible, or use them directly
    
    # Numeric features
    num_cols = [
        'loan_amnt', 'int_rate', 'installment', 'annual_inc', 'dti', 
        'fico_range_low', 'revol_util', 'total_acc', 'open_acc', 'pub_rec'
    ]
    
    # Fill NAs
    for col in num_cols:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].median())
        else:
             df[col] = 0 # Fallback
            
    # Categorical features
    # term (clean first), grade, home_ownership, verification_status
    if 'term' in df.columns:
        df['term_months'] = df['term'].str.extract('(\d+)').astype(float)
    
    cat_cols = ['grade', 'home_ownership', 'verification_status', 'purpose']
    
    # One-Hot Encoding
    df_encoded = pd.get_dummies(df, columns=cat_cols, dummy_na=False)
    
    # Select final feature set (excluding target which is returned separately or attached)
    # We return the whole DF with features, caller separates X and y
    
    # Rename for consistency with API/Model expectations if needed, 
    # but simpler to just use these new names and update API schema.
    # Let's align some critical ones to the previous schema to minimize API breakage?
    # Actually, better to update API to real names.
    
    # Identify One-Hot columns: they start with the prefix and a separator (usually _)
    encoded_cols = [c for c in df_encoded.columns if any(c.startswith(p + '_') for p in cat_cols)]
    
    final_cols = num_cols + ['term_months'] + encoded_cols + ['is_default']
    
    # Ensure all exist and are subset of df_encoded
    final_cols = [c for c in final_cols if c in df_encoded.columns]
    
    return df_encoded[final_cols]

def get_feature_names(df: pd.DataFrame) -> list:
    return list(df.columns)
