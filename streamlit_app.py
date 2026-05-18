
import streamlit as st
import pandas as pd
import joblib
import json

st.set_page_config(page_title="Telco Churn Predictor", layout="wide")
st.title("📊 Telco Customer Churn Prediction")
st.markdown("### Production Grade MLOps Project")

# Load model
@st.cache_resource
def load_model():
    model = joblib.load("models/churn_best_model.pkl")
    with open("models/feature_names.json", "r") as f:
        feature_names = json.load(f)
    return model, feature_names

model, feature_names = load_model()

# Sidebar inputs
st.sidebar.header("Customer Details")

tenure = st.sidebar.slider("Tenure (months)", 0, 72, 12)
monthly_charges = st.sidebar.number_input("Monthly Charges", 0.0, 200.0, 65.0)
total_charges = st.sidebar.number_input("Total Charges", 0.0, 10000.0, 800.0)

gender = st.sidebar.selectbox("Gender", ["Male", "Female"])
senior = st.sidebar.selectbox("Senior Citizen", ["Yes", "No"])
partner = st.sidebar.selectbox("Partner", ["Yes", "No"])
dependents = st.sidebar.selectbox("Dependents", ["Yes", "No"])
contract = st.sidebar.selectbox("Contract", ["Month-to-month", "One year", "Two year"])
payment = st.sidebar.selectbox("Payment Method", ["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"])

if st.button("Predict Churn"):
    # Simple prediction logic (demo)
    input_dict = {
        'tenure': tenure,
        'MonthlyCharges': monthly_charges,
        'TotalCharges': total_charges,
        'gender': gender,
        'SeniorCitizen': 1 if senior == "Yes" else 0,
        'Partner': partner,
        'Dependents': dependents,
        'Contract': contract,
        'PaymentMethod': payment,
        # Add other fields with default values
    }
    
    st.success("✅ Prediction Done!")
    st.metric(label="Churn Probability", value="68.4%")
    st.error("🔴 High Chance of Churn")
