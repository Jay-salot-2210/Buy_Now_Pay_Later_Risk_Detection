import pandas as pd
import os
import numpy as np

def load_data(filepath: str) -> pd.DataFrame:
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    
    # Lending Club data cleaning
    # Header is on line 0 for this file version
    df = pd.read_csv(filepath, low_memory=False) if 'LendingClub' in filepath else pd.read_csv(filepath)
    
    return df

def clean_money_col(col):
    if col.dtype == 'object':
        return col.str.replace('$', '').str.replace(',', '').astype(float)
    return col

def clean_percent_col(col):
    if col.dtype == 'object':
        return col.str.replace('%', '').astype(float)
    return col

def split_data(df: pd.DataFrame, target_col: str, test_size: float = 0.2, random_state: int = 42):
    from sklearn.model_selection import train_test_split
    X = df.drop(columns=[target_col])
    y = df[target_col]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)
    
    # Recombine for consistency if caller expects full dfs
    train_df = X_train.copy()
    train_df[target_col] = y_train
    
    test_df = X_test.copy()
    test_df[target_col] = y_test
    
    return train_df, test_df
