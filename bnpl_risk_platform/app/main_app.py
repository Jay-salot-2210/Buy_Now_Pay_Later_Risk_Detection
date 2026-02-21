import streamlit as st
import pandas as pd
import requests
import os
import sys
import matplotlib.pyplot as plt
import seaborn as sns

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(BASE_DIR)

from src.data_utils import load_data

st.set_page_config(page_title="BNPL Risk Dashboard", layout="wide")

st.title("💳 BNPL Risk & Profit Optimization Platform")

mode = st.sidebar.selectbox("Mode", ["Admin Dashboard", "Transaction Simulator"])

if mode == "Admin Dashboard":
    st.header("Portfolio Overview")
    
    # Load sample data efficiently
    try:
        data_path = os.path.join(BASE_DIR, 'data/raw/LendingClub_data.csv')
        df = load_data(data_path)
        
        col1, col2, col3 = st.columns(3)
        col1.metric("Total Transactions", len(df))
        col2.metric("Default Rate", f"{df['is_default'].mean():.2%}")
        col3.metric("Total Volume", f"${df['amount'].sum():,.0f}")
        
        st.subheader("Risk Distribution")
        fig, ax = plt.subplots(figsize=(10, 4))
        sns.histplot(df['credit_score_external'], bins=30, ax=ax, kde=True)
        st.pyplot(fig)
        
    except Exception as e:
        st.error(f"Could not load data: {e}")

elif mode == "Transaction Simulator":
    st.header("Real-time Decision Engine (Real Data)")
    
    with st.form("txn_form"):
        col1, col2 = st.columns(2)
        with col1:
            annual_inc = st.number_input("Annual Income ($)", 0, 1000000, 60000)
            loan_amnt = st.number_input("Loan Amount ($)", 500, 40000, 10000)
            fico = st.number_input("FICO Score", 300, 850, 700)
            dti = st.number_input("Debt-to-Income (DTI)", 0.0, 100.0, 15.0)
            int_rate = st.number_input("Interest Rate (%)", 5.0, 30.0, 12.0)
            
        with col2:
            grade = st.selectbox("Grade", ['A', 'B', 'C', 'D', 'E', 'F', 'G'])
            term = st.selectbox("Term", ["36 months", "60 months"])
            purpose = st.selectbox("Purpose", [
                'debt_consolidation', 'credit_card', 'home_improvement', 'other', 
                'major_purchase', 'medical', 'small_business', 'car', 'vacation', 
                'moving', 'house', 'wedding', 'renewable_energy', 'educational'
            ])
            home = st.selectbox("Home Ownership", ['RENT', 'MORTGAGE', 'OWN'])
            
        submitted = st.form_submit_button("Assess Risk")
        
        if submitted:
            # Construct payload
            term_months = 36.0 if "36" in term else 60.0
            
            # Use local inference
            try:
                from src.model import RiskModel # Lazy load
                from src.inference import make_decision, get_recommended_limit, calculate_expected_profit
                
                model_path = os.path.join(BASE_DIR, 'models/lightgbm_model.pkl')
                model = RiskModel(model_path)
                
                # Mock request object logic from API
                features = {
                    'loan_amnt': loan_amnt, 'int_rate': int_rate, 'installment': loan_amnt/term_months, # Approx
                    'annual_inc': annual_inc, 'dti': dti, 'fico_range_low': fico,
                    'revol_util': 50.0, 'total_acc': 20.0, 'open_acc': 10.0, 'pub_rec': 0.0,
                    'term_months': term_months
                }
                
                # Zero out cats
                grades = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
                home_ownerships = ['RENT', 'MORTGAGE', 'OWN', 'OTHER', 'NONE', 'ANY']
                verification_statuses = ['Verified', 'Source Verified', 'Not Verified']
                purposes = ['debt_consolidation', 'credit_card', 'home_improvement', 'other', 'major_purchase', 'medical', 'small_business', 'car', 'vacation', 'moving', 'house', 'wedding', 'renewable_energy', 'educational']

                for g in grades: features[f'grade_{g}'] = 0
                for h in home_ownerships: features[f'home_ownership_{h}'] = 0
                for v in verification_statuses: features[f'verification_status_{v}'] = 0
                for p in purposes: features[f'purpose_{p}'] = 0

                # Set active
                if f'grade_{grade}' in features: features[f'grade_{grade}'] = 1
                if f'home_ownership_{home}' in features: features[f'home_ownership_{home}'] = 1
                features[f'verification_status_Source Verified'] = 1 # Default assumption
                if f'purpose_{purpose}' in features: features[f'purpose_{purpose}'] = 1
                
                # Predict
                prob = model.predict_proba(pd.DataFrame([features]))[0]
                
                decision = make_decision(prob, loan_amnt)
                limit = get_recommended_limit(prob)
                profit = calculate_expected_profit(prob, loan_amnt)
                
                st.write("---")
                if decision == "APPROVE":
                    st.success(f"DECISION: {decision}")
                else:
                    st.error(f"DECISION: {decision}")
                
                c1, c2, c3 = st.columns(3)
                c1.metric("Default Probability", f"{prob:.2%}")
                c2.metric("Recommended Limit", f"${limit}")
                c3.metric("Expected Profit", f"${profit:.2f}")
                
            except Exception as e:
                st.error(f"Error: {e}")
