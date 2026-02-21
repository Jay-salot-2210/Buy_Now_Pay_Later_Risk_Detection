filename = 'bnpl_risk_platform/data/raw/LendingClub_data.csv'
with open(filename, 'r') as f:
    for i in range(5):
        print(f"Line {i}: {f.readline().strip()}")
