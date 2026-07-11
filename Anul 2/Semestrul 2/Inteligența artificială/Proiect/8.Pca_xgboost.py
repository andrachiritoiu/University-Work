import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from PIL import Image

from skimage.feature import hog
from skimage.feature import local_binary_pattern
from skimage.feature import canny
from skimage.transform import probabilistic_hough_line
from skimage.measure import label as connected_components
from skimage.measure import regionprops

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import ConfusionMatrixDisplay

from xgboost import XGBClassifier
from itertools import product


# 1. Functii pentru feature-uri

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
        np.mean(row_sum),
        np.std(row_sum),
        np.max(row_sum),
        np.min(row_sum),
        np.mean(col_sum),
        np.std(col_sum),
        np.max(col_sum),
        np.min(col_sum)
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

        if len(areas) > 0:
            features.extend([
                len(areas),
                np.max(areas),
                np.mean(areas),
                np.sum(areas)
            ])
        else:
            features.extend([0, 0, 0, 0])

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

    for line in lines:
        p0, p1 = line

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


# 2. Citire imagine si extragere toate feature-urile

def load_image(image_path):
    image = Image.open(image_path)
    image = image.convert("L")
    image = image.resize((64, 64))

    image = np.array(image, dtype=np.float32)
    image = image / 255.0

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

    train_images.append(load_image(image_path))
    train_labels.append(label)

train_images = np.array(train_images, dtype=np.float32)
train_labels = np.array(train_labels).astype(int)

print("train_images shape:", train_images.shape)
print("train_labels shape:", train_labels.shape)
print("clase:", np.unique(train_labels, return_counts=True))


# 5. XGBoost foloseste clasele 0, 1, 2, 3, 4

train_labels_xgb = train_labels - 1


# 6. Impartire train-validation

X_train, X_val, y_train, y_val = train_test_split(
    train_images,
    train_labels_xgb,
    test_size=0.2,
    random_state=42,
    stratify=train_labels_xgb
)

print("\nX_train shape:", X_train.shape)
print("X_val shape:", X_val.shape)


# 7. Testare PCA + XGBoost

pca_values = [50, 100, 200, 0.95]

param_grid = list(product(
    [300, 500],      # n_estimators
    [2, 3, 4],      # max_depth
    [0.03, 0.05],   # learning_rate
    [0.8, 0.9],     # subsample
    [0.8, 0.9],     # colsample_bytree
    [3, 5]          # reg_lambda
))

best_acc = 0
best_pca_value = None
best_params = None
best_predictions = None

results = []

for pca_value in pca_values:
    print("\nTestez PCA =", pca_value)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)

    if isinstance(pca_value, float):
        pca = PCA(
            n_components=pca_value,
            svd_solver="full",
            random_state=42
        )
    else:
        pca = PCA(
            n_components=pca_value,
            random_state=42
        )

    X_train_pca = pca.fit_transform(X_train_scaled)
    X_val_pca = pca.transform(X_val_scaled)

    explained_variance = np.sum(pca.explained_variance_ratio_)

    print("X_train_pca shape:", X_train_pca.shape)
    print("X_val_pca shape:", X_val_pca.shape)
    print("Explained variance:", explained_variance)

    for n_estimators, max_depth, learning_rate, subsample, colsample, reg_lambda in param_grid:
        model = XGBClassifier(
            objective="multi:softmax",
            num_class=5,
            eval_metric="mlogloss",
            tree_method="hist",
            random_state=42,
            n_jobs=-1,

            n_estimators=n_estimators,
            max_depth=max_depth,
            learning_rate=learning_rate,
            subsample=subsample,
            colsample_bytree=colsample,
            reg_lambda=reg_lambda
        )

        model.fit(X_train_pca, y_train)

        predictions = model.predict(X_val_pca)
        acc = accuracy_score(y_val, predictions)

        print(
            "PCA =", pca_value,
            "n_estimators =", n_estimators,
            "max_depth =", max_depth,
            "lr =", learning_rate,
            "accuracy =", acc
        )

        results.append([
            pca_value,
            X_train_pca.shape[1],
            explained_variance,
            n_estimators,
            max_depth,
            learning_rate,
            subsample,
            colsample,
            reg_lambda,
            acc
        ])

        if acc > best_acc:
            best_acc = acc
            best_pca_value = pca_value
            best_params = {
                "n_estimators": n_estimators,
                "max_depth": max_depth,
                "learning_rate": learning_rate,
                "subsample": subsample,
                "colsample_bytree": colsample,
                "reg_lambda": reg_lambda
            }
            best_predictions = predictions


print("\nBest PCA:", best_pca_value)
print("Best params:")
print(best_params)
print("Best validation accuracy =", best_acc)


# 8. Salvare rezultate pentru raport

results_df = pd.DataFrame(
    results,
    columns=[
        "pca_value",
        "pca_components_real",
        "explained_variance",
        "n_estimators",
        "max_depth",
        "learning_rate",
        "subsample",
        "colsample_bytree",
        "reg_lambda",
        "accuracy"
    ]
)

results_df.to_csv("xgboost_features_pca_results.csv", index=False)

print("\nRezultate salvate in xgboost_features_pca_results.csv")
print(results_df)


# 9. Plot pentru PCA

best_by_pca = results_df.groupby("pca_value")["accuracy"].max().reset_index()

plt.figure()
plt.bar(best_by_pca["pca_value"].astype(str), best_by_pca["accuracy"])
plt.xlabel("PCA")
plt.ylabel("Acuratete validation")
plt.title("XGBoost + PCA - rezultate pe validation")
plt.savefig("xgboost_features_pca_plot.png", dpi=300, bbox_inches="tight")
plt.show()


# 10. Matricea de confuzie

cm = confusion_matrix(
    y_val + 1,
    best_predictions + 1,
    labels=[1, 2, 3, 4, 5]
)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=[1, 2, 3, 4, 5]
)

disp.plot()
plt.title("Confusion Matrix - XGBoost + Feature Extraction + PCA")
plt.savefig("xgboost_features_pca_confusion_matrix.png", dpi=300, bbox_inches="tight")
plt.show()


# 11. Train final pe toate datele

print("\nAntrenez modelul final pe toate datele...")

final_scaler = StandardScaler()
train_images_scaled = final_scaler.fit_transform(train_images)

if isinstance(best_pca_value, float):
    final_pca = PCA(
        n_components=best_pca_value,
        svd_solver="full",
        random_state=42
    )
else:
    final_pca = PCA(
        n_components=best_pca_value,
        random_state=42
    )

train_images_pca = final_pca.fit_transform(train_images_scaled)

print("train_images_pca shape:", train_images_pca.shape)
print("Final explained variance:", np.sum(final_pca.explained_variance_ratio_))

final_model = XGBClassifier(
    objective="multi:softmax",
    num_class=5,
    eval_metric="mlogloss",
    tree_method="hist",
    random_state=42,
    n_jobs=-1,

    n_estimators=best_params["n_estimators"],
    max_depth=best_params["max_depth"],
    learning_rate=best_params["learning_rate"],
    subsample=best_params["subsample"],
    colsample_bytree=best_params["colsample_bytree"],
    reg_lambda=best_params["reg_lambda"]
)

final_model.fit(train_images_pca, train_labels_xgb)


# 12. Incarcare imagini de test

test_images = []
test_ids = []

for i in range(len(test_c)):
    image_id = str(test_c.iloc[i]["id"])
    image_path = os.path.join("test", image_id)

    test_images.append(load_image(image_path))
    test_ids.append(image_id)

test_images = np.array(test_images, dtype=np.float32)

print("\ntest_images shape:", test_images.shape)


# 13. Aplicam acelasi scaler si PCA pe test

test_images_scaled = final_scaler.transform(test_images)
test_images_pca = final_pca.transform(test_images_scaled)

print("test_images_pca shape:", test_images_pca.shape)


# 14. Predictii pe test

test_predictions_xgb = final_model.predict(test_images_pca)

# revenim la clasele 1, 2, 3, 4, 5
test_predictions = test_predictions_xgb + 1


# 15. Salvare submission

submission = pd.DataFrame({
    "id": test_ids,
    "label": test_predictions
})

submission.to_csv("submission_xgboost_features_pca.csv", index=False)

print("\nPrimele predictii:")
print(submission.head())