import requests
import os

urls = [
    "https://raw.githubusercontent.com/adashofdata/Lending-Club-Data-Analytics-using-Python/main/LoanStats3c_securev.csv",
    "https://raw.githubusercontent.com/rbhatia46/LendingClub-Loan-Analysis/master/loan.csv",
    "https://raw.githubusercontent.com/nikitaa30/Lending-Club-Loan-Analysis/master/loan.csv",
    "https://raw.githubusercontent.com/karthikbhandary2/Lending-Club-Loan-Data-Analysis/master/loan.csv"
]

os.makedirs('bnpl_risk_platform/data/raw', exist_ok=True)
output_file = 'bnpl_risk_platform/data/raw/LendingClub_data.csv'

for url in urls:
    print(f"Trying {url}...")
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            print(f"Success! Downloading from {url}...")
            with open(output_file, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Saved to {output_file}")
            break
        else:
            print(f"Failed. Status: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
