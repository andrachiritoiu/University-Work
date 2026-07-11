import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
from skimage.feature import hog
from skimage.feature import canny
from skimage.transform import probabilistic_hough_line
from skimage.measure import label as connected_components
from skimage.measure import regionprops
from sklearn import preprocessing
from sklearn.linear_model import LogisticRegression
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


# 2. Functie pentru feature-uri globale
def extract_global_features(image):
    # calculam statistici simple despre imagine
    global_features = [
        np.mean(image),
        np.std(image),
        np.max(image),
        np.min(image),
        np.median(image),

        np.mean(image > 0.1),
        np.mean(image > 0.2),
        np.mean(image > 0.3),
        np.mean(image > 0.4),
        np.mean(image > 0.5),
        np.mean(image > 0.6),
        np.mean(image > 0.7),
        np.mean(image > 0.8),
        np.mean(image > 0.9),
    ]

    return global_features


# 3. Functie pentru profile pe randuri si coloane
def extract_profile_features(image):
    # impartim imaginea in 8 bucati pe randuri si coloane
    row_parts = np.array_split(image, 8, axis=0)
    col_parts = np.array_split(image, 8, axis=1)

    row_mean_features = [np.mean(part) for part in row_parts]
    row_max_features = [np.max(part) for part in row_parts]
    row_bright_features = [np.mean(part > 0.5) for part in row_parts]

    col_mean_features = [np.mean(part) for part in col_parts]
    col_max_features = [np.max(part) for part in col_parts]
    col_bright_features = [np.mean(part > 0.5) for part in col_parts]

    profile_features = (
        row_mean_features
        + row_max_features
        + row_bright_features
        + col_mean_features
        + col_max_features
        + col_bright_features
    )

    return profile_features


# 4. Functie pentru componente conectate
def extract_component_features(image):
    component_features = []

    # testam mai multe praguri pentru zonele luminoase
    for threshold in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
        binary = image > threshold

        # gasim componentele conectate din imaginea binara
        labeled = connected_components(binary)
        regions = regionprops(labeled)

        areas = [r.area for r in regions]

        # eliminam componentele foarte mici, probabil zgomot
        areas = [area for area in areas if area >= 3]

        if len(areas) > 0:
            num_components = len(areas)
            max_area = np.max(areas)
            mean_area = np.mean(areas)
            total_area = np.sum(areas)
        else:
            num_components = 0
            max_area = 0
            mean_area = 0
            total_area = 0

        component_features.extend([
            num_components,
            max_area,
            mean_area,
            total_area
        ])

    return component_features


# 5. Functie pentru feature-uri Hough
def extract_hough_features(image):
    # detectam marginile din imagine
    edges = canny(image, sigma=1.0)

    # detectam linii in imagine
    lines = probabilistic_hough_line(
        edges,
        threshold=5,
        line_length=10,
        line_gap=3
    )

    lengths = []
    angles = []

    for line in lines:
        p0, p1 = line

        x0, y0 = p0
        x1, y1 = p1

        dx = x1 - x0
        dy = y1 - y0

        length = np.sqrt(dx * dx + dy * dy)
        angle = np.degrees(np.arctan2(dy, dx))

        lengths.append(length)
        angles.append(angle)

    if len(lengths) > 0:
        lengths = np.array(lengths)
        angles = np.array(angles)

        num_lines = len(lengths)
        mean_length = np.mean(lengths)
        max_length = np.max(lengths)
        std_length = np.std(lengths)
        total_length = np.sum(lengths)

        # calculam aproximativ tipurile de linii
        vertical_lines = np.mean(np.abs(np.abs(angles) - 90) < 20)
        horizontal_lines = np.mean(np.abs(angles) < 20)
        diagonal_pos = np.mean((angles > 20) & (angles < 70))
        diagonal_neg = np.mean((angles < -20) & (angles > -70))

        mean_angle = np.mean(angles)
        std_angle = np.std(angles)

    else:
        num_lines = 0
        mean_length = 0
        max_length = 0
        std_length = 0
        total_length = 0

        vertical_lines = 0
        horizontal_lines = 0
        diagonal_pos = 0
        diagonal_neg = 0

        mean_angle = 0
        std_angle = 0

    hough_features = [
        num_lines,
        mean_length,
        max_length,
        std_length,
        total_length,
        vertical_lines,
        horizontal_lines,
        diagonal_pos,
        diagonal_neg,
        mean_angle,
        std_angle
    ]

    return hough_features


# 6. Functie pentru citirea unei imagini si extragerea feature-urilor
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
    image_hog = hog(
        image,
        orientations=12,
        pixels_per_cell=(8, 8),
        cells_per_block=(2, 2),
        block_norm="L2-Hys",
        feature_vector=True
    )

    # extragem feature-uri suplimentare
    global_features = extract_global_features(image)
    profile_features = extract_profile_features(image)
    component_features = extract_component_features(image)
    hough_features = extract_hough_features(image)

    # concatenam toate feature-urile suplimentare
    extra_features = np.array(
        global_features
        + profile_features
        + component_features
        + hough_features,
        dtype=np.float32
    )

    # concatenam HOG cu restul feature-urilor
    features = np.concatenate([image_hog, extra_features])

    return features


# 7. Citire CSV-uri
train_c = pd.read_csv("train.csv")
test_c = pd.read_csv("test.csv")


# 8. Incarcare imagini de train
train_images = []
train_labels = []

for i in range(len(train_c)):
    image_id = str(train_c.iloc[i]["id"])
    label_value = int(train_c.iloc[i]["label"])

    image_path = os.path.join("train", image_id)

    image = load_image(image_path)

    train_images.append(image)
    train_labels.append(label_value)

train_images = np.array(train_images)
train_labels = np.array(train_labels).astype(int)

print("train_images shape:", train_images.shape)
print("train_labels shape:", train_labels.shape)
print("clase:", np.unique(train_labels, return_counts=True))


# 9. Impartire date in train si validation
X_train, X_val, y_train, y_val = train_test_split(
    train_images,
    train_labels,
    test_size=0.2,
    random_state=42,
    stratify=train_labels
)

print("\nX_train shape:", X_train.shape)
print("X_val shape:", X_val.shape)


# 10. Normalizare date
# Pentru Logistic Regression este important sa standardizam feature-urile
X_train_norm, X_val_norm = normalize_data(X_train, X_val, tip="standard")


# 11. Testam mai multe valori pentru C si class_weight
C_values = [
    1e-06,
    2e-06,
    3e-06,
    5e-06,
    7e-06,
    1e-05,
    2e-05,
    3e-05,
    5e-05,
    7e-05,
    1e-04,
    2e-04,
    3e-04,
    5e-04,
    7e-04,
    1e-03,
    2e-03,
    3e-03,
    5e-03,
    7e-03,
    1e-02,
    3e-02,
    5e-02,
    1e-01,
    0.3,
    1
]

class_weight_values = [None, "balanced"]

best_acc = 0
best_C = None
best_class_weight = None
best_predictions = None

results = []

for class_weight in class_weight_values:
    for C in C_values:
        # LogisticRegression este echivalent cu softmax pentru mai multe clase
        # C controleaza regularizarea: C mai mic inseamna regularizare mai puternica
        model = LogisticRegression(
            C=C,
            solver="lbfgs",
            max_iter=10000,
            random_state=42,
            class_weight=class_weight
        )

        # antrenam modelul
        model.fit(X_train_norm, y_train)

        # prezicem pe validation
        predictions = model.predict(X_val_norm)

        # calculam acuratetea
        acc = accuracy_score(y_val, predictions)

        print("Softmax | class_weight =", class_weight, "C =", C, "accuracy =", acc)

        results.append([
            "None" if class_weight is None else class_weight,
            C,
            acc
        ])

        # pastram cei mai buni parametri
        if acc > best_acc:
            best_acc = acc
            best_C = C
            best_class_weight = class_weight
            best_predictions = predictions

print("\nBest Softmax C =", best_C)
print("Best Softmax class_weight =", best_class_weight)
print("Best Softmax validation accuracy =", best_acc)


# 12. Salvam rezultatele pentru raport
results_df = pd.DataFrame(
    results,
    columns=["class_weight", "C", "validation_accuracy"]
)

results_df.to_csv("softmax_hog_global_hough_results.csv", index=False)

print("\nRezultate Softmax + feature-uri:")
print(results_df)


# 13. Plot pentru valorile lui C
plt.figure()

for class_weight_name in results_df["class_weight"].unique():
    subset = results_df[results_df["class_weight"] == class_weight_name]

    plt.plot(
        subset["C"],
        subset["validation_accuracy"],
        marker="o",
        label="class_weight=" + str(class_weight_name)
    )

plt.xscale("log")
plt.xlabel("C")
plt.ylabel("Acuratete validation")
plt.title("Softmax + HOG + extra features")
plt.legend()
plt.grid(True)
plt.savefig("softmax_hog_global_hough_plot.png", dpi=300, bbox_inches="tight")
plt.show()


# 14. Matricea de confuzie pentru cel mai bun model
labels = np.unique(train_labels)

cm = confusion_matrix(y_val, best_predictions, labels=labels)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=labels
)

disp.plot()
plt.title("Confusion Matrix - Softmax + Extra Features")
plt.savefig("softmax_hog_global_hough_confusion_matrix.png", dpi=300, bbox_inches="tight")
plt.show()


# 15. Antrenam modelul final pe toate datele de train
# Refacem scaler-ul pe toate datele de train
scaler = preprocessing.StandardScaler()
scaler.fit(train_images)

train_images_norm = scaler.transform(train_images)

final_model = LogisticRegression(
    C=best_C,
    solver="lbfgs",
    max_iter=10000,
    random_state=42,
    class_weight=best_class_weight
)

final_model.fit(train_images_norm, train_labels)


# 16. Incarcare imagini de test
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


# 17. Normalizare test
# Folosim acelasi scaler calculat pe train
test_images_norm = scaler.transform(test_images)


# 18. Predictii pe test
test_predictions = final_model.predict(test_images_norm)


# 19. Salvare submission
submission = pd.DataFrame({
    "id": test_ids,
    "label": test_predictions
})

submission.to_csv("submission_softmax_hog_global_hough.csv", index=False)

print("\nPrimele predictii:")
print(submission.head())