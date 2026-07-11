import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
from sklearn.model_selection import train_test_split


# 1. Clasa KNN
class KnnClassifier:
    def __init__(self, train_images, train_labels):
        self.train_images = train_images
        self.train_labels = train_labels

    # clasificam imaginea => clasa de la 1 la 5
    def classify_image(self, test_image, num_neighbors=3, metric='l2'):
        if metric == 'l1':
            dif = test_image - self.train_images
            distances = np.sum(np.abs(dif), axis=1)

        elif metric == 'l2':
            dif = test_image - self.train_images
            distances = np.sqrt(np.sum(dif ** 2, axis=1))

        else:
            raise ValueError("Metric trebuie sa fie 'l1' sau 'l2'")

        # sortarea distantelor
        sorted_indices = np.argsort(distances)

        # cei mai apropiati k vecini
        nearest_indices = sorted_indices[:num_neighbors]

        # etichetele vecinilor
        labels = self.train_labels[nearest_indices]

        # vot majoritar
        vote = np.argmax(np.bincount(labels, minlength=6))

        return vote


# 2. Functie pentru citirea unei imagini
def load_image(image_path):
    image = Image.open(image_path)

    # grayscale
    image = image.convert("L")

    # redimensionare
    image = image.resize((64, 64))

    # transformare imagine in array
    image = np.array(image, dtype=np.float32)

    # normalizare in [0, 1]
    image = image / 255.0

    # vector 1D
    image = image.flatten()

    return image


# 3. Citire CSV-uri
train_c = pd.read_csv("train.csv")
test_c = pd.read_csv("test.csv")

# print("Train:")
# print(train_c.head())
#
# print("\nTest:")
# print(test_c.head())
#
# print("\nColoane train:", train_c.columns)
# print("Coloane test:", test_c.columns)



# 4. Incarcare imagini de train
train_images = []
train_labels = []

for i in range(len(train_c)):
    image_id = train_c.iloc[i]["id"]
    label = int(train_c.iloc[i]["label"])

    image_path = os.path.join("train", image_id)

    image = load_image(image_path)

    train_images.append(image)
    train_labels.append(label)

train_images = np.array(train_images)
train_labels = np.array(train_labels).astype(int)

# print("\ntrain_images shape:", train_images.shape)
# print("train_labels shape:", train_labels.shape)
# print("clase:", np.unique(train_labels))


# 5. Impartire date in train si validation
X_train, X_val, y_train, y_val = train_test_split(train_images, train_labels, test_size=0.2, random_state=42,stratify=train_labels)

# print("\nX_train shape:", X_train.shape)
# print("X_val shape:", X_val.shape)


# 6. Cream clasificatorul pe datele de train
classifier = KnnClassifier(X_train, y_train)


# 7. Testam mai multe valori pentru k cu L2
values = [1, 3, 5, 7, 9]
accuracy_graph_l2 = []

for k in values:
    predictions = []

    for i in range(len(X_val)):
        pred = classifier.classify_image(X_val[i:i + 1], num_neighbors=k, metric='l2')
        predictions.append(pred)

    predictions = np.array(predictions)
    accuracy = np.mean(predictions == y_val)
    accuracy_graph_l2.append(accuracy)

    print("k =", k, "L2 accuracy =", accuracy)

np.savetxt("acuratete_l2_radio.txt", accuracy_graph_l2)


# 8. Testam mai multe valori pentru k cu L1
accuracy_graph_l1 = []

for k in values:
    predictions = []

    for i in range(len(X_val)):
        pred = classifier.classify_image(
            X_val[i:i + 1],
            num_neighbors=k,
            metric='l1'
        )
        predictions.append(pred)

    predictions = np.array(predictions)
    accuracy = np.mean(predictions == y_val)
    accuracy_graph_l1.append(accuracy)

    print("k =", k, "L1 accuracy =", accuracy)

np.savetxt("acuratete_l1_radio.txt", accuracy_graph_l1)


# 9. Plot L1 vs L2
plt.plot(values, accuracy_graph_l2, label='L2')
plt.plot(values, accuracy_graph_l1, label='L1')
plt.xlabel("Numar vecini k")
plt.ylabel("Acuratete")
plt.title("KNN pe imaginile radio")
plt.legend()
plt.show()


# 10. Alegem cel mai bun k si cea mai buna metrica
best_l2 = max(accuracy_graph_l2)
best_l1 = max(accuracy_graph_l1)

if best_l2 >= best_l1:
    best_metric = 'l2'
    best_k = values[np.argmax(accuracy_graph_l2)]
else:
    best_metric = 'l1'
    best_k = values[np.argmax(accuracy_graph_l1)]

print("\nCel mai bun k:", best_k)
print("Cea mai buna metrica:", best_metric)


# 11. Antrenam KNN final pe toate datele de train
final_classifier = KnnClassifier(train_images, train_labels)


# 12. Incarcam imaginile de test
test_images = []
test_ids = []

for i in range(len(test_c)):
    image_id = test_c.iloc[i]["id"]

    image_path = os.path.join("test", image_id)

    image = load_image(image_path)

    test_images.append(image)
    test_ids.append(image_id)

test_images = np.array(test_images)

print("\ntest_images shape:", test_images.shape)


# 13. Predictii pe test
test_predictions = []

for i in range(len(test_images)):
    pred = final_classifier.classify_image(test_images[i:i + 1], num_neighbors=best_k, metric=best_metric)
    test_predictions.append(pred)

test_predictions = np.array(test_predictions)


submission = pd.DataFrame({"id": test_ids, "label": test_predictions})

submission.to_csv("submission_knn.csv", index=False)

print(submission.head())