import sys
import os
import pandas as pd

# Add the bnpl_risk_platform directory to sys.path so we can import from src
sys.path.append(os.path.abspath('bnpl_risk_platform'))

from src.data_utils import load_data, split_data
from src.features import create_features
from src.model import RiskModel

print("Loading data...")
df = load_data('bnpl_risk_platform/data/raw/synthetic_bnpl_data.csv')
print("Creating features...")
df_features = create_features(df)

target = 'is_default'
X = df_features
y = df['is_default']

# Add target to X for split_data util
X[target] = y
X_train_full, X_test_full = split_data(X, target)

y_train = X_train_full[target]
X_train = X_train_full.drop(columns=[target])
y_test = X_test_full[target]
X_test = X_test_full.drop(columns=[target])

print(f"Training model on {X_train.shape} samples...")
model = RiskModel()
model.train(X_train, y_train, X_val=X_test, y_val=y_test)
metrics = model.evaluate(X_test, y_test)
print(f"Model AUC: {metrics['auc']:.4f}")

output_path = 'bnpl_risk_platform/models/lightgbm_model.pkl'
model.save(output_path)
