import requests
import time
import sys

def test_api():
    url = "http://127.0.0.1:8000/predict"
    payload = {
        "loan_amnt": 10000.0,
        "int_rate": 12.5,
        "installment": 300.0,
        "annual_inc": 75000.0,
        "dti": 15.0,
        "fico_range_low": 720.0,
        "revol_util": 45.0,
        "total_acc": 25.0,
        "open_acc": 12.0,
        "pub_rec": 0.0,
        "term_months": 36.0,
        "grade": "B",
        "home_ownership": "MORTGAGE",
        "verification_status": "Verified",
        "purpose": "debt_consolidation"
    }
    
    print("Waiting for server...")
    for i in range(10):
        try:
            r = requests.get("http://127.0.0.1:8000/")
            if r.status_code == 200:
                print("Server is up!")
                break
        except:
            time.sleep(2)
            print(".", end="")
    else:
        print("Server failed to start.")
        sys.exit(1)

    print(f"Testing {url} with payload...")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 200:
            print("TEST PASSED")
        else:
            print("TEST FAILED")
            sys.exit(1)
    except Exception as e:
        print(f"Request failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_api()
