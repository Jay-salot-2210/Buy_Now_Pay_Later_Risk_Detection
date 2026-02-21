import sys
import os
import pandas as pd

sys.path.append(os.path.abspath('bnpl_risk_platform/src'))
sys.path.append(os.path.abspath('bnpl_risk_platform'))

from src.data_utils import load_data, split_data
from src.model import RiskModel

data_path = 'bnpl_risk_platform/data/processed/real_bnpl_features.csv'
print(f"Loading {data_path}...")
df = load_data(data_path)

target = 'is_default'
X = df.drop(columns=[target])
y = df[target]

print(f"Target distribution:\n{y.value_counts(normalize=True)}")

X[target] = y
X_train_full, X_test_full = split_data(X, target)

y_train = X_train_full[target]
X_train = X_train_full.drop(columns=[target])
y_test = X_test_full[target]
X_test = X_test_full.drop(columns=[target])

print(f'Train shape: {X_train.shape}, Test shape: {X_test.shape}')

model = RiskModel()
model.train(X_train, y_train, X_val=X_test, y_val=y_test)
metrics = model.evaluate(X_test, y_test)
print(f"Model AUC: {metrics['auc']:.4f}")

model.save('bnpl_risk_platform/models/lightgbm_model.pkl')
