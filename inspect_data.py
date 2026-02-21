import pandas as pd

try:
    # Lending Club data often has a header description row, so we might need skiprows=1
    # But let's try reading normally first, or with error_bad_lines=False
    df = pd.read_csv('bnpl_risk_platform/data/raw/LendingClub_data.csv', low_memory=False)
    
    print("Shape:", df.shape)
    print("\nColumns:", list(df.columns))
    print("\nFirst 3 rows:")
    print(df.head(3))
    print("\nTarget variable candidate (loan_status) distribution:")
    if 'loan_status' in df.columns:
        print(df['loan_status'].value_counts())
except Exception as e:
    print(f"Error reading CSV directly: {e}")
    # Try skipping first row
    try:
        print("Retrying with skiprows=1...")
        df = pd.read_csv('bnpl_risk_platform/data/raw/LendingClub_data.csv', skiprows=1, low_memory=False)
        print("Shape:", df.shape)
        print("\nColumns:", df.columns.tolist()[:20]) # First 20 cols
    except Exception as e2:
        print(f"Error with skiprows=1: {e2}")
