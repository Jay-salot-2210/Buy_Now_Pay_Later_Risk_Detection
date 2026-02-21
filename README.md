<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/Jay-salot-2210/Modeling-Systematic-Market-Risk-via-Principal-Component-Analysis-and-Macroeconomic-News/daily_pc1_prediction.yml?label=Daily%20Pipeline&logo=github" />
  <img src="https://img.shields.io/badge/Python-3.10-blue?logo=python" />
  <img src="https://img.shields.io/badge/ML-Scikit--Learn-orange" />
  <img src="https://img.shields.io/badge/Data-GDELT%20%7C%20Yahoo%20Finance-green" />
  <img src="https://img.shields.io/badge/Dashboard-Streamlit-red?logo=streamlit" />
  <img src="https://img.shields.io/badge/Status-Production--Ready-success" />
</p>

# Modeling Systematic Market Risk via PCA and Macroeconomic News

A full-stack quantitative finance project that **detects, predicts, and visualizes systematic market risk** using **Principal Component Analysis (PCA)** and **global macroeconomic news**.

**Live Dashboard:**  
https://pc1-market-risk-by-jay.streamlit.app/

---

## Project Overview

When hundreds of stocks move together, it is rarely coincidence — it is **systematic risk**.

This project:
- Decomposes market returns into **orthogonal eigen-portfolios**
- Identifies **PC1 as the market mode**
- Predicts PC1 direction using **macroeconomic news**
- Deploys a **fully automated daily pipeline**
- Visualizes results via a **public Streamlit dashboard**

---

## Key Concepts

- Eigen-Portfolios
- Market Mode (PC1)
- News-Driven Market Prediction
- Machine Learning + Finance
- End-to-End Deployment

---

## Data Sources

| Data | Source |
|----|----|
| Equity Prices | Yahoo Finance |
| Macroeconomic News | GDELT Project |
| Sentiment & Events | GDELT v2 |

GDELT monitors **global news in real time** across thousands of sources.

---

## Technologies Used

### Languages
- Python

### Libraries
- NumPy, Pandas
- Scikit-Learn
- Scrapy
- yFinance
- Streamlit
- Matplotlib

### Infrastructure
- GitHub Actions (Automation)
- Streamlit Cloud (Deployment)

---

## System Architecture
Market Prices ──► PCA ──► PC1 Labels

Macroeconomic News ──► Feature Engineering

▲
ML Prediction (Daily)

▲
GitHub Actions Automation

▲
Streamlit Dashboard


---

## Automation 

- Runs **automatically every weekday**
- Scheduled using **GitHub Actions (IST aligned)**
- Fetches live news
- Generates features
- Predicts PC1 direction
- Updates dashboard data

Fully cloud-based  
No local server required

---

## Dashboard Features

The Streamlit dashboard displays:

- Daily PC1 prediction
- Prediction confidence
- Historical PC1 direction
- Feature impact explanation
- Trend visualization

**Dashboard:**  
https://pc1-market-risk-by-jay.streamlit.app/

---

## Technologies Used

### Programming Language
- Python

### Libraries & Tools
- NumPy
- Pandas
- Scikit-learn
- Scrapy
- yFinance
- Matplotlib
- Streamlit
- Joblib

### Infrastructure
- GitHub Actions (CI/CD)
- Streamlit Cloud (Hosting)

---

## Key Results

- PC1 explains **~37%** of total market variance
- Macroeconomic news shows **predictive power**
- Strategy demonstrates controlled market correlation
- Fully interpretable and reproducible pipeline

---

## Future Scope (Recruiter-Focused)

High-impact extensions:
- LLM-based news embeddings (FinBERT / GPT)
- Multi-factor prediction (PC2, PC3)
- Intraday market risk forecasting
- Reinforcement learning portfolio allocation
- Cross-market deployment (NIFTY, STOXX, Nikkei)
- Real-time alerts (Telegram / Email)

---

## Author

**Jay Salot**  
Quantitative Finance & Machine Learning  
DAU, Gandhinagar(formerly known as DA-IICT)

---

If you find this project interesting, feel free to **star the repository**!
