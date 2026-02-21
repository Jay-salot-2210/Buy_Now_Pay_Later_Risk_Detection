import sys
import os
import pandas as pd

# Fix path to include src
sys.path.append(os.path.abspath('bnpl_risk_platform/src'))
# Also need to make sure we can import from src when running from root
sys.path.append(os.path.abspath('bnpl_risk_platform'))

from src.data_utils import load_data
from src.features import create_features

raw_path = 'bnpl_risk_platform/data/raw/LendingClub_data.csv'
print(f"Loading {raw_path}...")
df_raw = load_data(raw_path)
print(f"Raw shape: {df_raw.shape}")

print("Creating features...")
df_clean = create_features(df_raw)
print(f"Processed shape: {df_clean.shape}")

output_path = 'bnpl_risk_platform/data/processed/real_bnpl_features.csv'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
df_clean.to_csv(output_path, index=False)
print(f"Saved to {output_path}")
