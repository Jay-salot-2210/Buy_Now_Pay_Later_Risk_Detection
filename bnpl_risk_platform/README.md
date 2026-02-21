# BNPL Risk & Profit Optimization Platform

## Overview
This project implements an end-to-end Machine Learning decision engine for Buy Now, Pay Later (BNPL) services. It assesses transaction risk, assigns dynamic credit limits, and estimates expected profit in real-time.

## Key Features
- **Risk Prediction**: Advanced ensemble models (LightGBM, XGBoost) to predict default probabilities.
- **Profit Optimization**: Custom threshold tuning based on expected monetary value.
- **Dynamic Credit Limits**: Automated limit assignment based on risk profiles.
- **Explainability**: SHAP-powered insights for every decision.
- **Real-time API**: FastAPI backend for instant scoring.
- **Interactive Dashboard**: Streamlit interface for portfolio monitoring and simulation.

## Structure
- `data/`: Raw and processed datasets.
- `notebooks/`: Jupyter notebooks for EDA, training, and analysis.
- `src/`: Reusable Python modules for data, features, modeling, and inference.
- `app/`: Application code (API and Dashboard).
- `models/`: Serialized model artifacts.

## Usage
1. Install dependencies: `pip install -r requirements.txt`
2. Run data generation: Execute `notebooks/00_synthetic_data.ipynb`
3. Train models: Execute `notebooks/02_training.ipynb`
4. Start API: `uvicorn app.api:app --reload`
5. Start Dashboard: `streamlit run app/main_app.py`
