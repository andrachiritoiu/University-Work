import numpy as np

from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


# INCARCARE DATE MNIST

train_images = np.loadtxt("data_MNIST/data/train_images.txt")
train_labels = np.loadtxt("data_MNIST/data/train_labels.txt").astype(int)

test_images = np.loadtxt("data_MNIST/data/test_images.txt")
test_labels = np.loadtxt("data_MNIST/data/test_labels.txt").astype(int)

print("train_images:", train_images.shape)
print("train_labels:", train_labels.shape)
print("test_images:", test_images.shape)
print("test_labels:", test_labels.shape)


# Daca vrei test rapid, poti decomenta:
# train_images = train_images[:300]
# train_labels = train_labels[:300]
# test_images = test_images[:100]
# test_labels = test_labels[:100]


def to_image_matrix(image):
    """
    Daca imaginea este vector 1D de 784 valori, o transformam in 28x28.
    Daca este deja matrice, o lasam asa.
    """
    if image.ndim == 1:
        side = int(np.sqrt(image.shape[0]))
        image = image.reshape(side, side)

    return image


# EXERCITIUL 1
# LBP-like histogram: compar pixelul cu vecinatatea d x d

def lbp_histogram(image, d=3):
    """
    Pentru fiecare pixel:
      - luam vecinatatea d x d
      - comparam fiecare pixel din vecinatate cu pixelul central
      - obtinem un vector binar
      - transformam vectorul binar intr-un cod numeric
    Pentru toata imaginea:
      - facem histograma codurilor

    Pentru d = 3 avem 3*3 = 9 biti => 2^9 = 512 pattern-uri posibile.
    Returnam o histograma de lungime fixa 512.
    """

    image = to_image_matrix(image)
    image = image.astype(float)

    radius = d // 2
    num_patterns = 2 ** (d * d)

    padded_image = np.pad(image, pad_width=radius, mode="edge")

    codes = []

    # ponderi pentru transformarea vectorului binar in numar
    # exemplu: [1,0,1] -> 1*1 + 0*2 + 1*4 = 5
    weights = 2 ** np.arange(d * d)

    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            center = padded_image[i + radius, j + radius]

            neighborhood = padded_image[i:i + d, j:j + d]

            binary_matrix = (neighborhood >= center).astype(int)

            binary_vector = binary_matrix.flatten()

            code = int(np.sum(binary_vector * weights))

            codes.append(code)

    hist = np.bincount(codes, minlength=num_patterns).astype(float)

    # normalizam histograma ca sa nu depinda de numarul de pixeli
    hist = hist / (hist.sum() + 1e-10)

    return hist


def build_lbp_histograms(images, d=3):
    histograms = []

    for image in images:
        histograms.append(lbp_histogram(image, d=d))

    return np.array(histograms)


# Construim histograme pentru train si test
train_histograms = build_lbp_histograms(train_images, d=3)
test_histograms = build_lbp_histograms(test_images, d=3)

print("\nEX 1")
print("train_histograms:", train_histograms.shape)
print("test_histograms:", test_histograms.shape)

# Model ML pe histogramele LBP
svm_lbp = SVC(kernel="linear", C=1.0)
svm_lbp.fit(train_histograms, train_labels)

pred_lbp = svm_lbp.predict(test_histograms)
acc_lbp = accuracy_score(test_labels, pred_lbp)

print("Accuracy ex1 - SVM linear pe histograme LBP:", acc_lbp)


# EXERCITIUL 2
# Magnitudinea gradientului + top k regiuni 3x3

def gradient_magnitude(image):
    image = to_image_matrix(image)
    image = image.astype(float)

    Gx = np.zeros_like(image)
    Gy = np.zeros_like(image)

    # gradient pe directia x: diferenta intre pixelul din dreapta si pixelul curent
    Gx[:, :-1] = image[:, 1:] - image[:, :-1]

    # gradient pe directia y: diferenta intre pixelul de jos si pixelul curent
    Gy[:-1, :] = image[1:, :] - image[:-1, :]

    G = np.sqrt(Gx ** 2 + Gy ** 2)

    return G


def top_k_gradient_regions(image, k=10, region_size=3):
    """
    Calculam magnitudinea gradientului.
    Impartim imaginea in regiuni 3x3 care nu se suprapun.
    Alegem primele k regiuni cu magnitudinea medie cea mai mare.
    Pastram in imagine doar aceste regiuni.
    """

    image = to_image_matrix(image)
    G = gradient_magnitude(image)

    h, w = image.shape
    regions = []

    for i in range(0, h - region_size + 1, region_size):
        for j in range(0, w - region_size + 1, region_size):
            region_gradient = G[i:i + region_size, j:j + region_size]
            mean_gradient = np.mean(region_gradient)

            regions.append((mean_gradient, i, j))

    # sortare descrescatoare dupa magnitudinea medie
    regions.sort(reverse=True, key=lambda x: x[0])

    top_regions = regions[:k]

    new_image = np.zeros_like(image)

    for _, i, j in top_regions:
        new_image[i:i + region_size, j:j + region_size] = image[i:i + region_size, j:j + region_size]

    return new_image


def build_top_gradient_features(images, k=10, region_size=3):
    features = []

    for image in images:
        new_image = top_k_gradient_regions(image, k=k, region_size=region_size)

        # transformam imaginea in vector
        feature = new_image.flatten()

        # normalizam valorile pixelilor in [0, 1]
        feature = feature / 255.0

        features.append(feature)

    return np.array(features)


train_grad_features = build_top_gradient_features(train_images, k=10, region_size=3)
test_grad_features = build_top_gradient_features(test_images, k=10, region_size=3)

print("\nEX 2")
print("train_grad_features:", train_grad_features.shape)
print("test_grad_features:", test_grad_features.shape)

svm_grad = make_pipeline(
    StandardScaler(),
    SVC(kernel="linear", C=1.0)
)

svm_grad.fit(train_grad_features, train_labels)

pred_grad = svm_grad.predict(test_grad_features)
acc_grad = accuracy_score(test_labels, pred_grad)

print("Accuracy ex2 - SVM pe regiuni cu gradient mare:", acc_grad)


# EXERCITIUL 3
# Magnitudine + directie gradient + non-maximum suppression

def gradient_components(image):
    image = to_image_matrix(image)
    image = image.astype(float)

    Gx = np.zeros_like(image)
    Gy = np.zeros_like(image)

    Gx[:, :-1] = image[:, 1:] - image[:, :-1]
    Gy[:-1, :] = image[1:, :] - image[:-1, :]

    return Gx, Gy


def non_maximum_suppression(image):
    """
    Calculam magnitudinea gradientului si directia.
    Pentru fiecare pixel, comparam magnitudinea lui cu doi vecini
    aflati pe directia gradientului.
    Daca este maxim local, il pastram. Altfel punem 0.
    """

    image = to_image_matrix(image)

    Gx, Gy = gradient_components(image)

    G = np.sqrt(Gx ** 2 + Gy ** 2)

    theta = np.arctan2(Gy, Gx) * 180 / np.pi

    # aducem unghiurile in [0, 180)
    theta[theta < 0] += 180

    h, w = image.shape
    result = np.zeros_like(G)

    for i in range(1, h - 1):
        for j in range(1, w - 1):
            angle = theta[i, j]

            # directie aproximativ orizontala
            if (0 <= angle < 22.5) or (157.5 <= angle < 180):
                neighbor1 = G[i, j - 1]
                neighbor2 = G[i, j + 1]

            # diagonala 45 grade
            elif 22.5 <= angle < 67.5:
                neighbor1 = G[i - 1, j + 1]
                neighbor2 = G[i + 1, j - 1]

            # verticala
            elif 67.5 <= angle < 112.5:
                neighbor1 = G[i - 1, j]
                neighbor2 = G[i + 1, j]

            # diagonala 135 grade
            else:
                neighbor1 = G[i - 1, j - 1]
                neighbor2 = G[i + 1, j + 1]

            if G[i, j] >= neighbor1 and G[i, j] >= neighbor2:
                result[i, j] = G[i, j]
            else:
                result[i, j] = 0

    return result


def build_nms_features(images):
    features = []

    for image in images:
        nms_image = non_maximum_suppression(image)

        feature = nms_image.flatten()

        # normalizare pe fiecare imagine ca sa nu avem valori foarte mari
        feature = feature / (np.max(feature) + 1e-10)

        features.append(feature)

    return np.array(features)


train_nms_features = build_nms_features(train_images)
test_nms_features = build_nms_features(test_images)

print("\nEX 3")
print("train_nms_features:", train_nms_features.shape)
print("test_nms_features:", test_nms_features.shape)

svm_nms = make_pipeline(
    StandardScaler(),
    SVC(kernel="linear", C=1.0)
)

svm_nms.fit(train_nms_features, train_labels)

pred_nms = svm_nms.predict(test_nms_features)
acc_nms = accuracy_score(test_labels, pred_nms)

print("Accuracy ex3 - SVM pe imagini NMS:", acc_nms)


# EXERCITIUL 4
# Regiuni binarizate + KNN cu distanta Hamming

def binary_region_features(image, region_size=3):
    """
    Impartim imaginea in regiuni distincte de dimensiune region_size x region_size.
    Pentru fiecare regiune:
      - luam pixelul central al regiunii
      - comparam toti pixelii din regiune cu pixelul central
      - obtinem un vector binar
    Concatenam toti vectorii binari.
    """

    image = to_image_matrix(image)
    image = image.astype(float)

    h, w = image.shape

    all_bits = []

    for i in range(0, h - region_size + 1, region_size):
        for j in range(0, w - region_size + 1, region_size):
            region = image[i:i + region_size, j:j + region_size]

            center = region[region_size // 2, region_size // 2]

            binary_region = (region >= center).astype(int)

            all_bits.extend(binary_region.flatten())

    return np.array(all_bits)


def build_binary_features(images, region_size=3):
    features = []

    for image in images:
        features.append(binary_region_features(image, region_size=region_size))

    return np.array(features)


def hamming_distance(a, b):
    return np.sum(a != b)


def knn_hamming_predict(train_features, train_labels, test_feature, k=3):
    distances = []

    for i in range(len(train_features)):
        dist = hamming_distance(train_features[i], test_feature)
        distances.append((dist, train_labels[i]))

    distances.sort(key=lambda x: x[0])

    nearest_labels = [label for _, label in distances[:k]]

    labels, counts = np.unique(nearest_labels, return_counts=True)

    return labels[np.argmax(counts)]


def knn_hamming_predict_all(train_features, train_labels, test_features, k=3):
    predictions = []

    for test_feature in test_features:
        pred = knn_hamming_predict(train_features, train_labels, test_feature, k=k)
        predictions.append(pred)

    return np.array(predictions)


train_binary_features = build_binary_features(train_images, region_size=3)
test_binary_features = build_binary_features(test_images, region_size=3)

print("\nEX 4")
print("train_binary_features:", train_binary_features.shape)
print("test_binary_features:", test_binary_features.shape)

pred_hamming = knn_hamming_predict_all(
    train_binary_features,
    train_labels,
    test_binary_features,
    k=3
)

acc_hamming = accuracy_score(test_labels, pred_hamming)

print("Accuracy ex4 - KNN Hamming:", acc_hamming)


# EXERCITIUL 5
# SVM cu kernel intersectie folosind histogramele de la ex1

def intersection_kernel(h1, h2):
    return np.sum(np.minimum(h1, h2))


def compute_intersection_kernel_matrix(X1, X2):
    """
    X1 = histograme pentru primul set
    X2 = histograme pentru al doilea set

    Returneaza matricea K unde:
    K[i, j] = sum(min(X1[i], X2[j]))
    """

    K = np.zeros((len(X1), len(X2)))

    for i in range(len(X1)):
        for j in range(len(X2)):
            K[i, j] = intersection_kernel(X1[i], X2[j])

    return K


print("\nEX 5")

K_train = compute_intersection_kernel_matrix(train_histograms, train_histograms)
K_test = compute_intersection_kernel_matrix(test_histograms, train_histograms)

print("K_train:", K_train.shape)
print("K_test:", K_test.shape)

svm_intersection = SVC(kernel="precomputed", C=1.0)

svm_intersection.fit(K_train, train_labels)

pred_intersection = svm_intersection.predict(K_test)

acc_intersection = accuracy_score(test_labels, pred_intersection)

print("Accuracy ex5 - SVM kernel intersectie:", acc_intersection)

