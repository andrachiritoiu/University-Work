import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from PIL import Image

from sklearn.model_selection import train_test_split
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import ConfusionMatrixDisplay


BASE_DIR = ""


# 1. Functie pentru citirea unei imagini
def load_image(image_path):
    image = Image.open(image_path)

    # transformam imaginea in grayscale
    image = image.convert("L")

    # redimensionam imaginea
    image = image.resize((64, 64))

    # transformam imaginea in array
    image = np.array(image, dtype=np.float32)

    # normalizam valorile pixelilor in [0, 1]
    image = image / 255.0

    # transformam matricea imaginii intr-un vector 1D
    image = image.flatten()

    return image


# 2. Citire CSV-uri
train_c = pd.read_csv(os.path.join(BASE_DIR, "train.csv"))
test_c = pd.read_csv(os.path.join(BASE_DIR, "test.csv"))


# 3. Incarcare imagini de train
train_images = []
train_labels = []

for i in range(len(train_c)):
    image_id = str(train_c.iloc[i]["id"])
    label = int(train_c.iloc[i]["label"])

    image_path = os.path.join(BASE_DIR, "train", image_id)

    image = load_image(image_path)

    train_images.append(image)
    train_labels.append(label)

train_images = np.array(train_images)
train_labels = np.array(train_labels).astype(int)

print("train_images shape:", train_images.shape)
print("train_labels shape:", train_labels.shape)
print("clase:", np.unique(train_labels))


# 4. Impartire date in train si validation
X_train, X_val, y_train, y_val = train_test_split(
    train_images,
    train_labels,
    test_size=0.2,
    random_state=42,
    stratify=train_labels
)

print("\nX_train shape:", X_train.shape)
print("X_val shape:", X_val.shape)


# 5. Testam mai multi parametri pentru ExtraTrees
n_estimators_values = [100, 300, 500]
max_depth_values = [None, 20, 40]

best_accuracy = 0
best_n_estimators = None
best_max_depth = None
best_model = None
best_predictions = None

results = []

for n_estimators in n_estimators_values:
    for max_depth in max_depth_values:
        print("\nTestez ExtraTrees cu:")
        print("n_estimators =", n_estimators)
        print("max_depth =", max_depth)

        # ExtraTrees este un model de tip ensemble
        # el foloseste mai multi arbori de decizie si combina predictiile lor
        model = ExtraTreesClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=42,
            n_jobs=-1
        )

        # antrenam modelul pe datele de train
        model.fit(X_train, y_train)

        # facem predictii pe validation
        predictions = model.predict(X_val)

        # calculam acuratetea
        accuracy = accuracy_score(y_val, predictions)

        print("Accuracy =", accuracy)

        results.append([n_estimators, max_depth, accuracy])

        # pastram cel mai bun model
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_n_estimators = n_estimators
            best_max_depth = max_depth
            best_model = model
            best_predictions = predictions


# 6. Salvam rezultatele pentru raport
results_df = pd.DataFrame(
    results,
    columns=["n_estimators", "max_depth", "accuracy"]
)

results_path = os.path.join(BASE_DIR, "extratrees_results.csv")
results_df.to_csv(results_path, index=False)

print("\nRezultate:")
print(results_df)


# 7. Afisam cei mai buni parametri
print("\nCei mai buni parametri:")
print("best_n_estimators =", best_n_estimators)
print("best_max_depth =", best_max_depth)
print("best_accuracy =", best_accuracy)


# 8. Plot
plt.figure()

for max_depth in max_depth_values:
    acc_values = []

    for n_estimators in n_estimators_values:
        row = results_df[
            (results_df["n_estimators"] == n_estimators)
            & (results_df["max_depth"].isna() if max_depth is None else results_df["max_depth"].eq(max_depth))
        ]

        acc_values.append(float(row["accuracy"].iloc[0]))

    label = "max_depth=None" if max_depth is None else "max_depth=" + str(max_depth)
    plt.plot(n_estimators_values, acc_values, marker="o", label=label)

plt.xlabel("Numar arbori")
plt.ylabel("Acuratete validation")
plt.title("ExtraTrees - testare hiperparametri")
plt.legend()
plt.grid(True)
plt.savefig(os.path.join(BASE_DIR, "extratrees_hyperparameters.png"), dpi=300, bbox_inches="tight")
plt.show()


# 9. Matricea de confuzie pentru cel mai bun model
cm = confusion_matrix(y_val, best_predictions)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot()
plt.title("Confusion Matrix - ExtraTrees")
plt.savefig(os.path.join(BASE_DIR, "extratrees_confusion_matrix.png"), dpi=300, bbox_inches="tight")
plt.show()


# 10. Antrenam modelul final pe toate datele de train
final_model = ExtraTreesClassifier(
    n_estimators=best_n_estimators,
    max_depth=best_max_depth,
    random_state=42,
    n_jobs=-1
)

print("\nAntrenez modelul final pe toate datele de train...")
final_model.fit(train_images, train_labels)


# 11. Acuratete pe toate datele de train
train_predictions = final_model.predict(train_images)
train_accuracy = accuracy_score(train_labels, train_predictions)

print("\nTrain accuracy pe toate datele =", train_accuracy)


# 12. Incarcare imagini de test
test_images = []
test_ids = []

for i in range(len(test_c)):
    image_id = str(test_c.iloc[i]["id"])

    image_path = os.path.join(BASE_DIR, "test", image_id)

    image = load_image(image_path)

    test_images.append(image)
    test_ids.append(image_id)

test_images = np.array(test_images)

print("\ntest_images shape:", test_images.shape)


# 13. Predictii pe test
test_predictions = final_model.predict(test_images)


# 14. Salvare submission
submission = pd.DataFrame({
    "id": test_ids,
    "label": test_predictions
})

submission_path = os.path.join(BASE_DIR, "submission_extratrees.csv")
submission.to_csv(submission_path, index=False)

print("\nSubmission salvat in:", submission_path)
print(submission.head())