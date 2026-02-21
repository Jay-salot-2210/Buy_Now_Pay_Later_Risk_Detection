import pandas as pd

# Read only loan_status to be fast
try:
    df = pd.read_csv('bnpl_risk_platform/data/raw/LendingClub_data.csv', usecols=['loan_status'])
    print("Loan Status Counts:")
    print(df['loan_status'].value_counts())
except Exception as e:
    print(f"Error: {e}")
