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

X[target] = y
X_train_full, X_test_full = split_data(X, target)

y_train = X_train_full[target]
X_train = X_train_full.drop(columns=[target])
y_test = X_test_full[target]
X_test = X_test_full.drop(columns=[target])

models_to_test = ['logreg', 'rf', 'xgboost', 'catboost', 'lightgbm']
results = []

print(f"Starting benchmark on {X_train.shape} samples...")

for m_type in models_to_test:
    print(f"\nTraining {m_type}...")
    model = RiskModel(model_type=m_type)
    try:
        model.train(X_train, y_train, X_val=X_test, y_val=y_test)
        metrics = model.evaluate(X_test, y_test)
        metrics['model'] = m_type
        results.append(metrics)
        print(f"  AUC: {metrics['auc']:.4f}")
    except Exception as e:
        print(f"  Failed: {e}")

results_df = pd.DataFrame(results).sort_values('auc', ascending=False)
print("\n--- LEADERBOARD ---\n")
print(results_df)

champion = results_df.iloc[0]['model']
print(f"\nChampion: {champion}")

# Save champion to be used by App (renaming to match what App expects if needed, or update App)
# App currently looks for 'models/lightgbm_model.pkl'. 
# We should probably update App to look for 'bnpl_risk_platform/models/risk_model_prod.pkl' or similar.
# For now, let's overwrite the default one if the champion is strictly better, or save as prod.

final_model = RiskModel(model_type=champion)
final_model.train(X_train, y_train, X_val=X_test, y_val=y_test)
final_model.save('bnpl_risk_platform/models/lightgbm_model.pkl') # Keep filename for compatibility
final_model.save('bnpl_risk_platform/models/champion_model.pkl')
print("Champion model saved.")
