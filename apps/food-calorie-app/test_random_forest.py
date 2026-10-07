import json
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

DATA = Path("data/foodDataset.json")

with open(DATA, "r", encoding="utf-8") as f:
    foods = json.load(f)

print("=" * 55)
print("PHASE 2 - RANDOM FOREST OFFLINE MODEL TEST")
print("=" * 55)
print("Dataset records:", len(foods))

features = []
labels = []

for food in foods:
    features.append([
        float(food.get("calories", 0)),
        float(food.get("protein", 0)),
        float(food.get("carbs", 0)),
        float(food.get("fat", 0)),
        float(food.get("fiber", 0)),
        float(food.get("sugar", 0)),
        float(food.get("sodium", 0)),
    ])
    labels.append(food["name"])

X_train, X_test, y_train, y_test = train_test_split(
    features,
    labels,
    test_size=0.33,
    random_state=42
)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print()
print("TRAINING SAMPLES:", len(X_train))
print("TEST SAMPLES:", len(X_test))
print()

for actual, predicted in zip(y_test, predictions):
    print(f"Actual: {actual:10s} | Predicted: {predicted}")

print()
print("=" * 55)
print("RANDOM FOREST RESULTS")
print("=" * 55)
print(f"Accuracy: {accuracy * 100:.2f}%")
print("Model runs offline: YES")
print("Algorithm: Random Forest")
print("Trees: 100")
print("=" * 55)
