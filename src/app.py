
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import json
import pandas as pd

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

app = FastAPI(title="Telco Customer Churn Prediction API")

# Serve dashboard static assets
app.mount("/static", StaticFiles(directory="src/static"), name="static")

# Load model and features
model = joblib.load("models/churn_best_model.pkl")

with open("models/feature_names.json", "r") as f:
    feature_names = json.load(f)

class CustomerData(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: float

@app.get("/")
def home():
    return FileResponse("src/static/index.html")

@app.get("/dashboard")
def dashboard():
    return RedirectResponse(url="/")

@app.post("/predict")
def predict_churn(data: CustomerData):
    # Convert input to dataframe
    input_data = pd.DataFrame([data.dict()])
    
    # Encoding (same as training)
    cat_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 'MultipleLines',
                'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection',
                'TechSupport', 'StreamingTV', 'StreamingMovies', 'Contract',
                'PaperlessBilling', 'PaymentMethod']
    
    input_data = pd.get_dummies(input_data, columns=cat_cols, drop_first=True)
    
    # Missing columns fill with 0
    for col in feature_names:
        if col not in input_data.columns:
            input_data[col] = 0
    
    input_data = input_data[feature_names]
    
    # Prediction
    probability = model.predict_proba(input_data)[0][1]
    prediction = "Yes" if probability > 0.5 else "No"
    
    return {
        "churn_prediction": prediction,
        "churn_probability": round(float(probability), 4),
        "confidence": "High" if abs(probability - 0.5) > 0.2 else "Medium"
    }
