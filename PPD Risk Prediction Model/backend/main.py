from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib 
import pandas as pd
import shap 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # To replace with frontend URL
    #allow_credentials=True, for allowing login credentials
    allow_methods=["*"],
    allow_headers=["*"]
)

model = joblib.load('model.pkl')
encoder = joblib.load("encoder.pkl")
print("Type of encoder:", type(encoder))
print("Is encoder fitted:", hasattr(encoder, "categories_"))
feature_columns = joblib.load('feature_columns.pkl')
age_order = joblib.load('age_order.pkl')
explainer = shap.TreeExplainer(model)

multi_choice_cols = [
    "Feeling sad or Tearful", "Irritable towards baby & partner",
    "Trouble sleeping at night", "Problems concentrating or making decision",
    "Overeating or loss of appetite", "Feeling of guilt",
    "Problems of bonding with baby", "Suicide attempt"
]

def preprocess(input_data: dict) -> pd.DataFrame: 
    df = pd.DataFrame([input_data])

    #Encoding of age using the same mapping as the training model 
    df["Age"] = df["Age"].map({age: i for i, age in enumerate(age_order)})

    # Onehot encoding 
    encoded = encoder.transform(df[multi_choice_cols])
    encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(multi_choice_cols))

    df = df.drop(columns=multi_choice_cols)
    df = pd.concat([df.reset_index(drop=True), encoded_df], axis=1)

    # Ensure columns match exactly what the model expects
    df = df.reindex(columns=feature_columns, fill_value=0)
    return df

@app.post("/predict")
def predict(input_data: dict):
    df = preprocess(input_data)
    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0].tolist()
    return {"prediction": int(prediction), "probability": probability}

@app.post("/explain")
def explain(input_data: dict):
    df = preprocess(input_data)
    shap_values = explainer.shap_values(df)
    return {
        "features": feature_columns,
        "shap_values": shap_values[0].tolist(),
        "base_value": float(explainer.expected_value)
    }
