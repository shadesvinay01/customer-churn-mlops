# Telco Customer Churn Prediction - MLOps Project

![Python](https://img.shields.io/badge/Python-3.10-blue) 
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![MLflow](https://img.shields.io/badge/MLflow-Tracking-orange)
![Docker](https://img.shields.io/badge/Docker-Container-blue)

**Production-ready End-to-End MLOps Project** for predicting customer churn.

GitHub Repository: [https://github.com/shadesvinay01/customer-churn-mlops](https://github.com/shadesvinay01/customer-churn-mlops)

---

## 🚀 Features

- **Interactive MLOps Dashboard**: A premium, dark-themed dashboard demonstrating the churn engine's pipeline (features control deck, real-time pipeline status flow, and live log output).
- **End-to-End ML Pipeline**: Automated training, evaluation, and logging.
- **Experiment Tracking**: Track runs, metrics, and parameters with **MLflow**.
- **Hyperparameter Tuning**: Automated search via **Optuna**.
- **Class Imbalance Handling**: Applied **SMOTE** to handle class imbalances.
- **FastAPI Backend**: Fast, lightweight REST API for serving real-time model predictions.
- **Streamlit Dashboard**: Secondary monitoring and analysis interface.
- **Docker Support**: Containerized application setup for seamless deployment.

---

## 🖥️ Premium Interactive Dashboard

Our interactive dashboard shows the end-to-end churn prediction engine in action, inspired by state-of-the-art MLOps visualization tools.

### Key Sections:
1. **Control Deck**: Dynamic configuration inputs to customize customer attributes (tenure, contract type, internet service, monthly charges, support history, etc.)
2. **Processor Core**: Animated step-by-step pipeline visualization showing:
   - **Data Ingestion**: Raw customer data ingestion.
   - **Feature Processing**: Category mapping and numerical handling.
   - **Feature Scaling**: Centering and scaling inputs.
   - **Model Inference**: Model evaluation via the Random Forest classifier.
   - **Verdict**: Churn risk calculation with exact percentages and recommended actions.
3. **Live System Console**: Real-time streaming log of the step-by-step internal calculations and feature mappings.

### How to Run the Dashboard:

1. **Install Core Dependencies**:
   ```bash
   pip install fastapi uvicorn python-multipart pandas scikit-learn joblib
   ```

2. **Launch the FastAPI Server**:
   ```bash
   python -m uvicorn src.app:app --port 8000
   ```

3. **Open the Dashboard**:
   Go to [http://127.0.0.1:8000](http://127.0.0.1:8000) in your web browser.

---

## 📊 Best Model Performance

- **F1 Score**: 0.6292
- **ROC AUC**: 0.8336
- **Recall**: ~0.66

---

## 🛠️ Tech Stack

- **ML**: Scikit-learn, RandomForest, Optuna, SMOTE
- **Tracking**: MLflow
- **API**: FastAPI, Uvicorn
- **Frontend**: HTML5, Vanilla CSS3, Javascript ES6 (Custom Premium Dark Theme)
- **Deployment**: Docker

---

## 📁 Repository & Link

This project is hosted on GitHub:  
👉 **[https://github.com/shadesvinay01/customer-churn-mlops](https://github.com/shadesvinay01/customer-churn-mlops)**
