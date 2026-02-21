import lightgbm as lgb
import xgboost as xgb
import catboost as cb
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import joblib
import os
from sklearn.metrics import roc_auc_score, recall_score, precision_score

class RiskModel:
    def __init__(self, model_path=None, model_type='lightgbm'):
        self.model = None
        self.model_path = model_path
        self.model_type = model_type
        
        if model_path and os.path.exists(model_path):
            self.load(model_path)

    def train(self, X_train, y_train, X_val=None, y_val=None, params=None):
        if self.model_type == 'lightgbm':
            if params is None:
                params = {'objective': 'binary', 'metric': 'auc', 'verbosity': -1, 'n_estimators': 100}
            self.model = lgb.LGBMClassifier(**params)
            eval_set = [(X_val, y_val)] if X_val is not None else None
            self.model.fit(X_train, y_train, eval_set=eval_set)
            
        elif self.model_type == 'xgboost':
            if params is None:
                params = {'objective': 'binary:logistic', 'eval_metric': 'auc', 'n_estimators': 100}
            self.model = xgb.XGBClassifier(**params)
            eval_set = [(X_val, y_val)] if X_val is not None else None
            self.model.fit(X_train, y_train, eval_set=eval_set, verbose=False)
            
        elif self.model_type == 'catboost':
            if params is None:
                params = {'loss_function': 'Logloss', 'eval_metric': 'AUC', 'n_estimators': 100, 'verbose': 0}
            self.model = cb.CatBoostClassifier(**params)
            eval_set = (X_val, y_val) if X_val is not None else None
            self.model.fit(X_train, y_train, eval_set=eval_set)
            
        elif self.model_type == 'rf':
            if params is None:
                params = {'n_estimators': 100, 'max_depth': 10, 'random_state': 42}
            self.model = RandomForestClassifier(**params)
            self.model.fit(X_train, y_train)
            
        elif self.model_type == 'logreg':
            if params is None:
                params = {'max_iter': 1000, 'solver': 'lbfgs'}
            self.model = LogisticRegression(**params)
            self.model.fit(X_train, y_train)
            
        else:
            raise ValueError(f"Unknown model_type: {self.model_type}")

        return self.model

    def predict_proba(self, X):
        if self.model is None:
            raise ValueError("Model not trained or loaded")
        return self.model.predict_proba(X)[:, 1]

    def evaluate(self, X_test, y_test):
        preds = self.predict_proba(X_test)
        auc = roc_auc_score(y_test, preds)
        
        # Calculate expected profit (using simple defaults)
        # This belongs in logic, but good for summary
        # Assuming threshold 0.2 approx
        hard_preds = (preds > 0.2).astype(int) 
        recall = recall_score(y_test, hard_preds) # Recall on default class (1)
        
        return {'auc': auc, 'recall_at_0.2': recall}

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
        print(f"Model saved to {path}")

    def load(self, path):
        self.model = joblib.load(path)
        self.model_path = path
