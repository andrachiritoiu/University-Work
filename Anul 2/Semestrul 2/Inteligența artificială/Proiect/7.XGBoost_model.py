import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from PIL import Image
from itertools import product

from skimage.feature import hog, local_binary_pattern, canny
from skimage.transform import probabilistic_hough_line
from skimage.measure import label as connected_components, regionprops

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, ConfusionMatrixDisplay

from xgboost import XGBClassifier


# 1. Setari generale

RANDOM_STATE = 42
LABELS = [1, 2, 3, 4, 5]


# 2. Functii pentru feature-uri

def get_lbp_features(image):
    image_uint8 = (image * 255).astype(np.uint8)
    features = []

    for P, R in [(8, 1), (16, 2)]:
        lbp = local_binary_pattern(image_uint8, P=P, R=R, method="uniform")
        n_bins = P + 2

        hist, _ = np.histogram(
            lbp.ravel(),
            bins=n_bins,
            range=(0, n_bins),
            density=True
        )

        features.extend(hist)

    return np.array(features, dtype=np.float32)


def get_intensity_histogram(image):
    hist, _ = np.histogram(
        image.ravel(),
        bins=16,
        range=(0.0, 1.0),
        density=True
    )

    return hist.astype(np.float32)


def get_projection_features(image):
    features = []

    row_sum = np.sum(image, axis=1)
    col_sum = np.sum(image, axis=0)

    features.extend([
        np.mean(row_sum), np.std(row_sum), np.max(row_sum), np.min(row_sum),
        np.mean(col_sum), np.std(col_sum), np.max(col_sum), np.min(col_sum)
    ])

    row_parts = np.array_split(image, 16, axis=0)
    col_parts = np.array_split(image, 16, axis=1)

    for part in row_parts + col_parts:
        features.extend([
            np.mean(part),
            np.max(part),
            np.mean(part > 0.5)
        ])

    return np.array(features, dtype=np.float32)


def get_fft_features(image):
    fft = np.fft.fft2(image)
    fft_shift = np.fft.fftshift(fft)
    magnitude = np.log1p(np.abs(fft_shift))

    h, w = magnitude.shape
    center_h = h // 2
    center_w = w // 2

    center_patch = magnitude[
        center_h - 4:center_h + 4,
        center_w - 4:center_w + 4
    ]

    features = list(center_patch.flatten())

    features.extend([
        np.mean(magnitude),
        np.std(magnitude),
        np.max(magnitude),
        np.min(magnitude),
        np.median(magnitude)
    ])

    return np.array(features, dtype=np.float32)


def get_connected_components_features(image):
    features = []

    for threshold in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
        binary = image > threshold
        labeled = connected_components(binary)
        regions = regionprops(labeled)

        areas = [r.area for r in regions]
        areas = [area for area in areas if area >= 3]

        if len(areas) == 0:
            features.extend([0, 0, 0, 0])
        else:
            features.extend([
                len(areas),
                np.max(areas),
                np.mean(areas),
                np.sum(areas)
            ])

    return np.array(features, dtype=np.float32)


def get_hough_features(image):
    edges = canny(image, sigma=1.0)

    lines = probabilistic_hough_line(
        edges,
        threshold=5,
        line_length=10,
        line_gap=3
    )

    lengths = []
    angles = []

    for p0, p1 in lines:
        x0, y0 = p0
        x1, y1 = p1

        dx = x1 - x0
        dy = y1 - y0

        lengths.append(np.sqrt(dx * dx + dy * dy))
        angles.append(np.degrees(np.arctan2(dy, dx)))

    if len(lengths) == 0:
        return np.zeros(16, dtype=np.float32)

    lengths = np.array(lengths)
    angles = np.array(angles)

    features = [
        len(lengths),
        np.mean(lengths),
        np.max(lengths),
        np.std(lengths),
        np.sum(lengths),

        np.mean(np.abs(np.abs(angles) - 90) < 20),
        np.mean(np.abs(angles) < 20),
        np.mean((angles > 20) & (angles < 70)),
        np.mean((angles < -20) & (angles > -70)),

        np.mean(angles),
        np.std(angles),

        np.sum(np.abs(np.abs(angles) - 90) < 15),
        np.sum(np.abs(angles) < 15),
        np.sum((np.abs(angles) > 20) & (np.abs(angles) < 75)),

        np.sum(lengths > 20),
        np.sum(lengths > 35)
    ]

    return np.array(features, dtype=np.float32)


# 3. Citire imagine si extragere toate feature-urile

def load_image(image_path):
    image = Image.open(image_path)
    image = image.convert("L")
    image = image.resize((64, 64))

    image = np.array(image, dtype=np.float32) / 255.0

    image_hog = hog(
        image,
        orientations=12,
        pixels_per_cell=(8, 8),
        cells_per_block=(2, 2),
        block_norm="L2-Hys",
        feature_vector=True
    ).astype(np.float32)

    global_features = np.array([
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
        np.mean(image > 0.9)
    ], dtype=np.float32)

    features = np.concatenate([
        image_hog,
        get_lbp_features(image),
        get_intensity_histogram(image),
        get_projection_features(image),
        get_fft_features(image),
        get_connected_components_features(image),
        get_hough_features(image),
        global_features
    ])

    return features.astype(np.float32)


# 4. Incarcare date

def load_dataset(csv_file, image_dir, has_labels=True):
    data = pd.read_csv(csv_file)

    images = []
    labels = []
    ids = []

    for i in range(len(data)):
        image_id = str(data.iloc[i]["id"])
        image_path = os.path.join(image_dir, image_id)

        images.append(load_image(image_path))
        ids.append(image_id)

        if has_labels:
            labels.append(int(data.iloc[i]["label"]))

    images = np.array(images, dtype=np.float32)

    if has_labels:
        labels = np.array(labels).astype(int)
        return data, images, labels, ids

    return data, images, ids


train_c, train_images, train_labels, train_ids = load_dataset(
    "train.csv",
    "train",
    has_labels=True
)

test_c, test_images, test_ids = load_dataset(
    "test.csv",
    "test",
    has_labels=False
)

print("train_images shape:", train_images.shape)
print("train_labels shape:", train_labels.shape)
print("test_images shape:", test_images.shape)
print("clase:", np.unique(train_labels, return_counts=True))


# 5. Pregatire labeluri pentru XGBoost

train_labels_xgb = train_labels - 1

X_train, X_val, y_train, y_val = train_test_split(
    train_images,
    train_labels_xgb,
    test_size=0.2,
    random_state=RANDOM_STATE,
    stratify=train_labels_xgb
)

print("\nX_train shape:", X_train.shape)
print("X_val shape:", X_val.shape)


# 6. Functie pentru model XGBoost

def make_xgb_model(params):
    return XGBClassifier(
        objective="multi:softmax",
        num_class=5,
        eval_metric="mlogloss",
        tree_method="hist",
        random_state=RANDOM_STATE,
        n_jobs=-1,

        n_estimators=params["n_estimators"],
        max_depth=params["max_depth"],
        learning_rate=params["learning_rate"],
        subsample=params["subsample"],
        colsample_bytree=params["colsample_bytree"],
        reg_lambda=params["reg_lambda"]
    )


# 7. Testare hiperparametri

param_grid = list(product(
    [300, 500],      # n_estimators
    [2, 3, 4],      # max_depth
    [0.03, 0.05],   # learning_rate
    [0.8, 0.9],     # subsample
    [0.8, 0.9],     # colsample_bytree
    [3, 5]          # reg_lambda
))

best_acc = 0
best_params = None
best_predictions = None

results = []

for values in param_grid:
    params = {
        "n_estimators": values[0],
        "max_depth": values[1],
        "learning_rate": values[2],
        "subsample": values[3],
        "colsample_bytree": values[4],
        "reg_lambda": values[5]
    }

    model = make_xgb_model(params)
    model.fit(X_train, y_train)

    predictions = model.predict(X_val)
    acc = accuracy_score(y_val, predictions)

    print(params, "accuracy =", acc)

    results.append([
        params["n_estimators"],
        params["max_depth"],
        params["learning_rate"],
        params["subsample"],
        params["colsample_bytree"],
        params["reg_lambda"],
        acc
    ])

    if acc > best_acc:
        best_acc = acc
        best_params = params
        best_predictions = predictions


print("\nBest params:")
print(best_params)
print("Best validation accuracy =", best_acc)


# 8. Salvare rezultate

results_df = pd.DataFrame(
    results,
    columns=[
        "n_estimators",
        "max_depth",
        "learning_rate",
        "subsample",
        "colsample_bytree",
        "reg_lambda",
        "accuracy"
    ]
)

results_df.to_csv("xgboost_features_results.csv", index=False)

print("\nRezultate XGBoost:")
print(results_df)


# 9. Plot top 10 configuratii

top_results = results_df.sort_values("accuracy", ascending=False).head(10)

plt.figure(figsize=(10, 5))
plt.bar(range(len(top_results)), top_results["accuracy"])

plt.xticks(
    range(len(top_results)),
    [
        "n=" + str(row["n_estimators"])
        + ", d=" + str(row["max_depth"])
        + ", lr=" + str(row["learning_rate"])
        for _, row in top_results.iterrows()
    ],
    rotation=45,
    ha="right"
)

plt.xlabel("Configuratie")
plt.ylabel("Acuratete validation")
plt.title("Top 10 configuratii XGBoost")
plt.tight_layout()
plt.savefig("xgboost_features_top_results.png", dpi=300, bbox_inches="tight")
plt.show()


# 10. Matricea de confuzie

cm = confusion_matrix(
    y_val + 1,
    best_predictions + 1,
    labels=LABELS
)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=LABELS
)

disp.plot()
plt.title("Confusion Matrix - XGBoost + Feature Extraction")
plt.savefig("xgboost_features_confusion_matrix.png", dpi=300, bbox_inches="tight")
plt.show()


# 11. Train final pe toate datele

print("\nAntrenez modelul final pe toate datele...")

final_model = make_xgb_model(best_params)
final_model.fit(train_images, train_labels_xgb)


# 12. Predictii pe test si salvare submission

test_predictions_xgb = final_model.predict(test_images)
test_predictions = test_predictions_xgb + 1

submission = pd.DataFrame({
    "id": test_ids,
    "label": test_predictions
})

submission.to_csv("submission_xgboost_features.csv", index=False)

print("\nPrimele predictii:")
print(submission.head())