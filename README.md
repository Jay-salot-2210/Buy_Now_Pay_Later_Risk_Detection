<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10-blue?logo=python" />
  <img src="https://img.shields.io/badge/ML-LightGBM%20%7C%20XGBoost-orange" />
  <img src="https://img.shields.io/badge/Data-LendingClub-green" />
  <img src="https://img.shields.io/badge/Dashboard-Streamlit-red?logo=streamlit" />
  <img src="https://img.shields.io/badge/Status-Production--Ready-success" />
</p>

# BNPL Risk & Profit Optimization Platform

A full-stack quantitative risk project that **detects default probabilities, assigns dynamic credit limits, and optimizes expected profit** for Buy Now, Pay Later (BNPL) portfolios.

**Live Dashboard:**  
*(Add your deployed Streamlit link here after deployment!)*

---

## Project Overview

Approving every customer leads to defaults; rejecting too many leaves profit on the table.

This project implements an end-to-end Machine Learning decision engine that:
- Assesses transaction risk using advanced ensemble models
- Optimizes approval thresholds based on Expected Monetary Value (EMV)
- Assigns dynamic credit limits based on real-time risk profiles
- Deploys a **fully automated machine learning pipeline**
- Visualizes results and portfolio health via a **public Streamlit dashboard**

---

## Key Concepts

- Default Probability Prediction
- Expected Monetary Value (EMV) Optimization
- Dynamic Credit Limit Assignment
- Model Explainability (SHAP)
- Machine Learning + Risk Management
- Real-time API Scoring

---

## Data Sources

| Data | Source |
|----|----|
| Loan Data | LendingClub Real-World Data |
| Features | Income, DTI, FICO Score, Loan Amount, Installment, etc. |

The pipeline strictly processes real-world financial data to simulate realistic BNPL scenarios.

---

## Technologies Used

### Languages
- Python

### Libraries & Frameworks
- Pandas, NumPy
- Scikit-Learn, LightGBM, XGBoost, CatBoost
- SHAP (Explainability)
- FastAPI, Uvicorn (Backend API)
- Streamlit (Frontend Dashboard)
- Matplotlib, Seaborn

### Infrastructure
- Streamlit Cloud (Deployment)
- Git / GitHub (Version Control)

---

## System Architecture

Raw User Data ──► Feature Engineering ──► Preprocessed Features

▲
ML Risk Prediction (LightGBM/XGBoost)

▲
Profit Optimization Engine (Threshold Tuning & Limits)

▲
Streamlit Dashboard (Portfolio Monitoring)


---

## Dashboard Features

The Streamlit dashboard displays:

- **Portfolio Health Summary**: Total transactions, approval rates, expected profit, and projected losses.
- **Interactive Risk Gauge**: Visualizes individual application risk levels.
- **Model Explainability**: SHAP force plots explaining *why* a decision was made.
- **Transaction Simulation**: Live form to test new applicant data.
- **Data Visualizations**: Distribution of FICO scores, Loan Amounts, and Default Rates.

---

## Key Results

- Effectively balanced approval rates against default risk.
- Implemented threshold optimization directly tied to business profitability.
- Advanced ensemble models provided superior discriminatory power (AUC/ROC) over traditional logistic regression.
- Fully interpretable recommendations accessible to non-technical stakeholders via SHAP.

---

## Future Scope (Recruiter-Focused)

High-impact extensions:
- Graph Neural Networks (GNNs) for detecting synthetic identity fraud.
- Reinforcement Learning for dynamic pricing and interest rate assignment.
- Alternative Data integration (e.g., Telecom billing, Utility payments).
- Automated CI/CD retraining pipelines for model drift adaptation.
- Real-time streaming features using Kafka/Flink.

---

## Author

**Jay Salot**  
Quantitative Finance & Machine Learning  
DAU, Gandhinagar (formerly known as DA-IICT)

---

If you find this project interesting, feel free to **star the repository**!
