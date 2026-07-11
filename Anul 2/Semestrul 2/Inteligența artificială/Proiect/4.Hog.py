import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
from skimage.feature import hog
from sklearn import preprocessing
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import ConfusionMatrixDisplay


# 1. Functie pentru normalizarea datelor
def normalize_data(train_data, test_data, tip=None):
    if tip is None:
        return train_data, test_data

    elif tip == "standard":
        # standardizam datele: medie 0 si deviatie standard 1
        scaler = preprocessing.StandardScaler()
        scaler.fit(train_data)

        train_data = scaler.transform(train_data)
        test_data = scaler.transform(test_data)

        return train_data, test_data

    elif tip == "l1":
        # normalizare L1
        normalizer = preprocessing.Normalizer(norm="l1")

        train_data = normalizer.transform(train_data)
        test_data = normalizer.transform(test_data)

        return train_data, test_data

    elif tip == "l2":
        # normalizare L2
        normalizer = preprocessing.Normalizer(norm="l2")

        train_data = normalizer.transform(train_data)
        test_data = normalizer.transform(test_data)

        return train_data, test_data

    else:
        raise ValueError("Tipul de normalizare trebuie sa fie None, standard, l1 sau l2")


# 2. Functie pentru citirea unei imagini si extragerea HOG
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

    # extragem caracteristicile HOG
    # HOG descrie forma si orientarea marginilor din imagine
    image_hog = hog(
        image,
        orientations=12,
        pixels_per_cell=(8, 8),
        cells_per_block=(2, 2),
        block_norm="L2-Hys",
        feature_vector=True
    )

    return image_hog


# 3. Citire CSV-uri
train_c = pd.read_csv("train.csv")
test_c = pd.read_csv("test.csv")


# 4. Incarcare imagini de train
train_images = []
train_labels = []

for i in range(len(train_c)):
    image_id = str(train_c.iloc[i]["id"])
    label = int(train_c.iloc[i]["label"])

    image_path = os.path.join("train", image_id)

    image = load_image(image_path)

    train_images.append(image)
    train_labels.append(label)

train_images = np.array(train_images)
train_labels = np.array(train_labels).astype(int)

print("train_images shape:", train_images.shape)
print("train_labels shape:", train_labels.shape)
print("clase:", np.unique(train_labels, return_counts=True))


# 5. Impartire date in train si validation
X_train, X_val, y_train, y_val = train_test_split(
    train_images,
    train_labels,
    test_size=0.2,
    random_state=42,
    stratify=train_labels
)

print("\nX_train shape:", X_train.shape)
print("X_val shape:", X_val.shape)


# 6. Normalizare date
# Pentru SVM este important sa standardizam caracteristicile
X_train_norm, X_val_norm = normalize_data(X_train, X_val, tip="standard")


# 7. Testam mai multe valori pentru C
C_values = [0.00005, 0.0001, 0.0002, 0.0003, 0.0004]

best_acc = 0
best_C = None
best_model = None
best_predictions = None

results = []

for C in C_values:
    # LinearSVC este un SVM liniar
    # C controleaza penalizarea greselilor
    model = svm.LinearSVC(
        C=C,
        max_iter=20000,
        random_state=42,
        dual=False
    )

    # antrenam modelul pe datele de train
    model.fit(X_train_norm, y_train)

    # facem predictii pe validation
    predictions = model.predict(X_val_norm)

    # calculam acuratetea
    acc = accuracy_score(y_val, predictions)

    print("C =", C, "accuracy =", acc)

    results.append([C, acc])

    # pastram cel mai bun model
    if acc > best_acc:
        best_acc = acc
        best_C = C
        best_model = model
        best_predictions = predictions

print("\nBest C =", best_C)
print("Best validation accuracy =", best_acc)


# 8. Salvam rezultatele pentru raport
results_df = pd.DataFrame(
    results,
    columns=["C", "validation_accuracy"]
)

results_df.to_csv("hog_svm_results.csv", index=False)

print("\nRezultate HOG + SVM:")
print(results_df)


# 9. Plot pentru valorile lui C
plt.figure()
plt.plot(C_values, results_df["validation_accuracy"], marker="o")
plt.xlabel("C")
plt.ylabel("Acuratete validation")
plt.title("HOG + SVM - influenta parametrului C")
plt.grid(True)
plt.savefig("hog_svm_c_values_plot.png", dpi=300, bbox_inches="tight")
plt.show()


# 10. Matricea de confuzie pentru cel mai bun model
cm = confusion_matrix(y_val, best_predictions)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot()
plt.title("Confusion Matrix - HOG + SVM")
plt.savefig("hog_svm_confusion_matrix.png", dpi=300, bbox_inches="tight")
plt.show()


# 11. Antrenam modelul final pe toate datele de train
# Refacem scaler-ul pe toate datele de train
scaler = preprocessing.StandardScaler()
scaler.fit(train_images)

train_images_norm = scaler.transform(train_images)

final_model = svm.LinearSVC(
    C=best_C,
    max_iter=20000,
    random_state=42,
    dual=False
)

final_model.fit(train_images_norm, train_labels)


# 12. Incarcare imagini de test
test_images = []
test_ids = []

for i in range(len(test_c)):
    image_id = str(test_c.iloc[i]["id"])

    image_path = os.path.join("test", image_id)

    image = load_image(image_path)

    test_images.append(image)
    test_ids.append(image_id)

test_images = np.array(test_images)

print("\ntest_images shape:", test_images.shape)


# 13. Normalizare test
# Folosim acelasi scaler calculat pe train
test_images_norm = scaler.transform(test_images)


# 14. Predictii pe test
test_predictions = final_model.predict(test_images_norm)


# 15. Salvare submission
submission = pd.DataFrame({
    "id": test_ids,
    "label": test_predictions
})

submission.to_csv("submission_hog_svm.csv", index=False)

print("\nPrimele predictii:")
print(submission.head())