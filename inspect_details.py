import pandas as pd

# Load first 100 rows to check column names and values
df = pd.read_csv('bnpl_risk_platform/data/raw/LendingClub_data.csv', nrows=100)

print("Columns:", list(df.columns))

# Relevant columns we might want
candidates = [
    'loan_amnt', 'term', 'int_rate', 'installment', 'grade', 'sub_grade',
    'emp_title', 'emp_length', 'home_ownership', 'annual_inc', 'verification_status',
    'issue_d', 'loan_status', 'purpose', 'title', 'zip_code', 'addr_state', 'dti',
    'delinq_2yrs', 'earliest_cr_line', 'fico_range_low', 'fico_range_high',
    'inq_last_6mths', 'open_acc', 'pub_rec', 'revol_bal', 'revol_util', 'total_acc'
]

present_candidates = [c for c in candidates if c in df.columns]
print("\nPresent candidates:", present_candidates)

print("\nSample Data:")
print(df[present_candidates].head())

# Check target variable values
print("\nTarget Variable (loan_status):")
# Need to read full column for this ideally, but let's assume standard LC values: 'Fully Paid', 'Charged Off', etc.
