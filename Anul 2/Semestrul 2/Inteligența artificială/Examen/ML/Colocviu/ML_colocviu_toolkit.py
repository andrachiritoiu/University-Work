
# ============================================================
# ML_COLOCVIU_TOOLKIT.py
# ============================================================
# Fisier de recapitulare pentru colocvii / laboratoare de Machine Learning.
#
# Contine:
#   1. Citiri frecvente din fisiere:
#      - .npy
#      - .txt cu linii simple
#      - .txt / .csv cu nume_fisier,label
#      - fisiere de semnale cu 3 coloane
#      - texte pentru NLP
#
#   2. Salvare predictii:
#      - .txt, o predictie pe linie
#      - .npy, vector de predictii
#      - .csv cu filename,label
#
#   3. Preprocesari:
#      - train/validation split
#      - standardizare
#      - normalizare L1 / L2
#      - discretizare cu bins
#      - padding/truncare semnale
#
#   4. Modele si algoritmi:
#      - Naive Bayes manual pentru date discrete
#      - Naive Bayes sklearn pentru text / histograme
#      - KNN manual cu L1 / L2
#      - KNN pe similaritate
#      - SVM clasic
#      - SVM cu kernel precomputed
#      - Kernel Ridge precomputed pentru clasificare
#      - Ridge Regression
#      - MLP feed-forward cu Adam
#
#   5. Kerneluri / features speciale:
#      - String kernel pe n-grame
#      - Matrice kernel precomputed
#      - Kernel liniar
#      - Kernel intersectie
#      - Kernel Hellinger
#      - Kernel RBF
#      - Features Markov pentru semnale x,y,z
#      - Convolutie text cu 3-grame
#      - Bag of Words pe caractere / cuvinte
#
# IMPORTANT:
#   Acest fisier este un "toolkit", nu trebuie rulat integral fara date.
#   Copiezi doar sectiunea necesara in functie de subiect.
#
# ============================================================


# ============================================================
# 0. IMPORTURI
# ============================================================

import os
import math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from collections import Counter, defaultdict

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

from sklearn.preprocessing import StandardScaler, Normalizer
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

from sklearn.naive_bayes import MultinomialNB, ComplementNB, GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC, LinearSVC
from sklearn.kernel_ridge import KernelRidge
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.neural_network import MLPClassifier


RANDOM_STATE = 42


# ============================================================
# 1. CITIRI DIN FISIERE
# ============================================================

# ------------------------------------------------------------
# 1.1 Citire .npy
# ------------------------------------------------------------
def read_npy(path, allow_pickle=True):
    """
    Cand folosesti:
        - train_data.npy
        - train_labels.npy
        - test_data.npy
        - imagini / texte / liste salvate numpy

    allow_pickle=True este util cand fisierul contine string-uri sau obiecte Python.

    Exemplu:
        X_train = read_npy("train_data.npy")
        y_train = read_npy("train_labels.npy")
    """
    return np.load(path, allow_pickle=allow_pickle)


def read_npy_texts(path):
    """
    Citeste un fisier .npy care contine texte/string-uri.

    Uneori np.load intoarce:
        - np.ndarray de string-uri
        - np.ndarray de bytes
        - np.ndarray de obiecte

    Functia transforma totul intr-o lista de str-uri Python.
    """
    arr = np.load(path, allow_pickle=True)
    arr = np.asarray(arr).ravel()

    texts = []
    for x in arr:
        if isinstance(x, bytes):
            texts.append(x.decode("utf-8"))
        else:
            texts.append(str(x))

    return texts


# ------------------------------------------------------------
# 1.2 Citire txt simplu: cate un exemplu pe linie
# ------------------------------------------------------------
def read_lines_txt(path, keep_empty=False):
    """
    Citeste un fisier text cu un exemplu pe linie.

    Cand folosesti:
        - train_sentences.txt
        - test_sentences.txt
        - words.txt, daca fiecare linie e un token / 3-gram

    keep_empty:
        - False: elimina liniile goale
        - True: pastreaza liniile goale
    """
    lines = []

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")

            if line == "" and not keep_empty:
                continue

            lines.append(line)

    return lines


def read_words_txt(path):
    """
    Citeste words.txt cu n-grame.

    Diferenta fata de read_lines_txt:
        Nu folosim strip(), fiindca un n-gram poate contine spatiu.
        Eliminam doar newline-ul.

    Exemplu:
        words = read_words_txt("words.txt")
    """
    words = []

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            word = line.rstrip("\n")
            if word != "":
                words.append(word)

    return words


# ------------------------------------------------------------
# 1.3 Citire CSV / TXT cu filename,label
# ------------------------------------------------------------
def read_train_file_label(path, sep=",", has_header=True):
    """
    Citeste un fisier de forma:
        filename,label

    Exemplu train.txt:
        file,label
        001.txt,0
        002.txt,3

    Returneaza:
        files  - lista de nume fisiere
        labels - np.array de int

    Cand folosesti:
        - subiecte cu director data/train si data/test
        - semnale stocate separat in fisiere .txt
    """
    files = []
    labels = []

    with open(path, "r", encoding="utf-8") as f:
        first = True

        for line in f:
            line = line.strip()
            if line == "":
                continue

            if first and has_header:
                first = False
                continue

            parts = line.split(sep)
            filename = parts[0].strip()
            label = int(parts[1].strip())

            files.append(filename)
            labels.append(label)

    return files, np.array(labels, dtype=np.int64)


def read_test_file_list(path, sep=",", has_header=True):
    """
    Citeste un fisier de forma:
        filename

    sau:
        filename,altceva

    Returneaza lista cu numele fisierelor de test.
    """
    files = []

    with open(path, "r", encoding="utf-8") as f:
        first = True

        for line in f:
            line = line.strip()
            if line == "":
                continue

            if first and has_header:
                first = False
                # Daca prima linie nu e header, poti seta has_header=False.
                continue

            filename = line.split(sep)[0].strip()
            files.append(filename)

    return files


# ------------------------------------------------------------
# 1.4 Citire CSV cu pandas
# ------------------------------------------------------------
def read_csv_pandas(path):
    """
    Pentru fisiere .csv clasice.

    Exemplu:
        df = read_csv_pandas("train.csv")
        X = df.drop("label", axis=1).values
        y = df["label"].values
    """
    return pd.read_csv(path)


# ------------------------------------------------------------
# 1.5 Citire date numerice din txt
# ------------------------------------------------------------
def read_numeric_txt(path, delimiter=None, dtype=np.float32):
    """
    Citeste fisiere numerice:
        - matrice de pixeli
        - semnale
        - features deja extrase

    delimiter:
        - None pentru spatii
        - "," pentru CSV simplu

    Exemplu:
        X = read_numeric_txt("train_images.txt")
    """
    return np.loadtxt(path, dtype=dtype, delimiter=delimiter)


# ------------------------------------------------------------
# 1.6 Citire semnal accelerometru cu 3 coloane
# ------------------------------------------------------------
def load_signal_3_axes(path):
    """
    Citeste un fisier cu semnal accelerometru:
        coloana 0 -> x
        coloana 1 -> y
        coloana 2 -> z

    Returneaza matrice de forma:
        (numar_momente, 3)
    """
    try:
        signal = np.loadtxt(path, dtype=np.float32)
    except ValueError:
        signal = np.loadtxt(path, dtype=np.float32, delimiter=",")

    if signal.ndim == 1:
        signal = signal.reshape(1, -1)

    signal = np.nan_to_num(signal, nan=0.0, posinf=0.0, neginf=0.0)

    if signal.shape[1] != 3:
        raise ValueError(f"Fisierul {path} trebuie sa aiba 3 coloane. Shape gasit: {signal.shape}")

    return signal


def load_signals_from_folder(file_names, folder_path):
    """
    Citeste mai multe semnale dintr-un folder.

    Exemplu:
        train_files, y = read_train_file_label("data/train.txt")
        train_signals = load_signals_from_folder(train_files, "data/train")
    """
    signals = []

    for file_name in file_names:
        path = os.path.join(folder_path, file_name)
        signals.append(load_signal_3_axes(path))

    return signals


# ------------------------------------------------------------
# 1.7 Citire mapping caracter,numar
# ------------------------------------------------------------
def read_char_mapping(path):
    """
    Citeste mapping.txt de forma:
        caracter,numar

    Atentie:
        Daca caracterul este spatiu, linia poate fi:
            " ,18"

    De aceea folosim rsplit(",", 1), nu strip complet.
    """
    mapping = {}

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")

            if line == "":
                continue

            char, value = line.rsplit(",", 1)
            mapping[char] = int(value.strip())

    return mapping


# ============================================================
# 2. SALVARE PREDICTII
# ============================================================

def save_predictions_txt(path, predictions):
    """
    Salveaza predictii in .txt, cate una pe linie.

    Cerinta frecventa:
        fisierul are exact numarul de exemple de test,
        fiecare linie contine o eticheta.

    Exemplu:
        save_predictions_txt("Popa_Maria_231_subiect4_solutia1.txt", y_pred)
    """
    predictions = np.asarray(predictions).ravel()

    with open(path, "w", encoding="utf-8") as f:
        for pred in predictions:
            f.write(str(int(pred)) + "\n")


def save_predictions_npy(path, predictions):
    """
    Salveaza predictii ca vector .npy.

    Exemplu:
        save_predictions_npy("subiect1_solutia1.npy", y_pred)
    """
    np.save(path, np.asarray(predictions))


def save_predictions_csv_filename_label(path, file_names, predictions):
    """
    Salveaza predictii in format:
        filename,label

    Util pentru subiecte unde train.txt are format filename,label.
    """
    with open(path, "w", encoding="utf-8") as f:
        f.write("filename,label\n")

        for file_name, pred in zip(file_names, predictions):
            f.write(f"{file_name},{int(pred)}\n")


# ============================================================
# 3. EVALUARE SI SPLIT
# ============================================================

def make_validation_split(X, y, test_size=0.2):
    """
    Split train / validare.

    stratify=y pastreaza proportia claselor.
    Important pentru clasificare.
    """
    return train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=RANDOM_STATE,
        stratify=y
    )


def print_classification_results(y_true, y_pred, title="Rezultate"):
    """
    Afiseaza acuratete, matrice de confuzie si raport.
    """
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)

    acc = accuracy_score(y_true, y_pred)
    print("Accuracy:", acc)

    print("\nConfusion matrix:")
    print(confusion_matrix(y_true, y_pred))

    print("\nClassification report:")
    print(classification_report(y_true, y_pred))

    return acc


def plot_validation_scores(results, save_path="raport_validare.png"):
    """
    results trebuie sa fie lista de dict-uri cu cheia 'val_accuracy'.

    Exemplu:
        results = [
            {"model": "KNN", "k": 3, "val_accuracy": 0.88},
            {"model": "KNN", "k": 5, "val_accuracy": 0.89}
        ]
    """
    df = pd.DataFrame(results)

    plt.figure(figsize=(12, 5))
    plt.bar(range(len(df)), df["val_accuracy"])
    plt.xticks(range(len(df)), df["model"], rotation=45)
    plt.ylabel("Acuratete validare")
    plt.title("Experimente pe validare")
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()

    return df


# ============================================================
# 4. PREPROCESARI GENERALE
# ============================================================

# ------------------------------------------------------------
# 4.1 Standardizare
# ------------------------------------------------------------
def standardize_train_test(X_train, X_test):
    """
    Standardizare:
        x_scaled = (x - mean) / std

    Cand folosesti:
        - MLP
        - SVM liniar / RBF
        - Ridge Regression
        - Kernel Ridge cu kernel liniar
        - orice model sensibil la scale

    IMPORTANT:
        fit pe train, transform pe test.
        Nu faci fit pe test.
    """
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, scaler


# ------------------------------------------------------------
# 4.2 Normalizare L1 / L2
# ------------------------------------------------------------
def normalize_l1_l2_train_test(X_train, X_test, norm="l2"):
    """
    Normalizare pe fiecare exemplu:
        L1: suma valorilor absolute devine 1
        L2: norma euclidiana devine 1

    Cand folosesti:
        - KNN pe vectori de frecvente
        - SVM pe histograme
        - probleme unde conteaza directia vectorului, nu magnitudinea
    """
    normalizer = Normalizer(norm=norm)
    X_train_norm = normalizer.fit_transform(X_train)
    X_test_norm = normalizer.transform(X_test)

    return X_train_norm, X_test_norm, normalizer


def manual_l2_normalize_rows(X):
    """
    Normalizare L2 facuta manual.

    Pentru fiecare linie x:
        x_normalizat = x / sqrt(sum(x_i^2))
    """
    X = np.asarray(X, dtype=np.float32)
    norms = np.linalg.norm(X, axis=1, keepdims=True)

    return np.divide(X, norms, out=np.zeros_like(X), where=(norms != 0))


def manual_l1_normalize_rows(X):
    """
    Normalizare L1 facuta manual.

    Pentru fiecare linie x:
        x_normalizat = x / sum(abs(x_i))
    """
    X = np.asarray(X, dtype=np.float32)
    norms = np.sum(np.abs(X), axis=1, keepdims=True)

    return np.divide(X, norms, out=np.zeros_like(X), where=(norms != 0))


# ------------------------------------------------------------
# 4.3 Discretizare cu bins
# ------------------------------------------------------------
def make_equal_width_bins(values, num_bins):
    """
    Creeaza intervale egale intre min si max.

    Folosit la:
        - Naive Bayes pentru date continue
        - Markov features pe semnale
    """
    values = np.asarray(values)
    min_val = np.min(values)
    max_val = np.max(values)

    if min_val == max_val:
        max_val = min_val + 1e-6

    # num_bins intervale au num_bins + 1 muchii
    edges = np.linspace(min_val, max_val, num_bins + 1)
    return edges


def discretize_values(values, edges):
    """
    Transforma valori continue in indici de interval.

    edges = [e0, e1, ..., ek]
    intoarce valori in {0, ..., k-1}

    Folosim muchiile interne:
        e1, e2, ..., e(k-1)
    """
    internal_edges = edges[1:-1]
    return np.digitize(values, internal_edges)


def discretize_matrix_per_feature_train_test(X_train, X_test, num_bins):
    """
    Discretizeaza fiecare coloana separat.

    Cand folosesti:
        - Naive Bayes manual pe date continue
        - transformare valori continue in categorii

    IMPORTANT:
        bins se calculeaza pe train si se aplica pe test.
    """
    X_train = np.asarray(X_train)
    X_test = np.asarray(X_test)

    X_train_disc = np.zeros_like(X_train, dtype=np.int64)
    X_test_disc = np.zeros_like(X_test, dtype=np.int64)

    bins_per_feature = []

    for j in range(X_train.shape[1]):
        edges = make_equal_width_bins(X_train[:, j], num_bins)
        bins_per_feature.append(edges)

        X_train_disc[:, j] = discretize_values(X_train[:, j], edges)
        X_test_disc[:, j] = discretize_values(X_test[:, j], edges)

    return X_train_disc, X_test_disc, bins_per_feature


# ------------------------------------------------------------
# 4.4 Padding / truncare semnale
# ------------------------------------------------------------
def fix_signal_length(signal, target_len):
    """
    Aduce un semnal (L, 3) la lungime fixa target_len.

    Daca e prea lung:
        taiem finalul.

    Daca e prea scurt:
        adaugam zerouri la final.

    Folosit la:
        - MLP pe semnale accelerometru
    """
    fixed = np.zeros((target_len, signal.shape[1]), dtype=np.float32)

    n = min(len(signal), target_len)
    fixed[:n, :] = signal[:n, :]

    return fixed


def build_fixed_length_signal_features(signals, target_len=None, percentile=95):
    """
    Transforma o lista de semnale de lungimi diferite in matrice de features.

    Fiecare semnal:
        (L, 3) -> (target_len, 3) -> vector target_len * 3

    target_len:
        daca None, folosim percentila 95 a lungimilor din train.
    """
    if target_len is None:
        lengths = np.array([len(s) for s in signals])
        target_len = int(np.percentile(lengths, percentile))
        target_len = max(target_len, 1)

    X = []

    for signal in signals:
        fixed = fix_signal_length(signal, target_len)
        X.append(fixed.flatten())

    return np.array(X, dtype=np.float32), target_len


# ============================================================
# 5. BAG OF WORDS / TEXT FEATURES
# ============================================================

def bow_char_features_train_test(train_texts, test_texts, ngram_range=(1, 3), use_tfidf=False):
    """
    Bag of Words la nivel de caracter.

    Cand folosesti:
        - clasificare text
        - subiecte cu train_sentences.txt / test_sentences.txt
        - Naive Bayes pe caractere

    ngram_range:
        (1,1) -> caractere simple
        (1,2) -> caractere + bigrame
        (1,3) -> caractere + bigrame + trigrame
    """
    if use_tfidf:
        vectorizer = TfidfVectorizer(
            analyzer="char",
            ngram_range=ngram_range,
            lowercase=False
        )
    else:
        vectorizer = CountVectorizer(
            analyzer="char",
            ngram_range=ngram_range,
            lowercase=False
        )

    X_train = vectorizer.fit_transform(train_texts)
    X_test = vectorizer.transform(test_texts)

    return X_train, X_test, vectorizer


def bow_word_features_train_test(train_texts, test_texts, ngram_range=(1, 1), use_tfidf=False):
    """
    Bag of Words la nivel de cuvant.

    Cand folosesti:
        - clasificare documente mai clasica
        - texte unde cuvintele conteaza mai mult decat caracterele
    """
    if use_tfidf:
        vectorizer = TfidfVectorizer(
            analyzer="word",
            ngram_range=ngram_range,
            lowercase=True
        )
    else:
        vectorizer = CountVectorizer(
            analyzer="word",
            ngram_range=ngram_range,
            lowercase=True
        )

    X_train = vectorizer.fit_transform(train_texts)
    X_test = vectorizer.transform(test_texts)

    return X_train, X_test, vectorizer


# ============================================================
# 6. NAIVE BAYES
# ============================================================

# ------------------------------------------------------------
# 6.1 Naive Bayes sklearn pentru text / frecvente
# ------------------------------------------------------------
def train_multinomial_nb(X_train, y_train, X_test, alpha=1.0):
    """
    MultinomialNB:
        - bun pentru text
        - bun pentru histograme / counts
        - input nenegativ

    alpha:
        Laplace smoothing.
        Evita probabilitati 0.
    """
    model = MultinomialNB(alpha=alpha)
    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    return pred, model


def train_complement_nb(X_train, y_train, X_test, alpha=1.0):
    """
    ComplementNB:
        - foarte folosit pentru text
        - poate merge mai bine decat MultinomialNB la clase dezechilibrate
    """
    model = ComplementNB(alpha=alpha)
    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    return pred, model


def validate_naive_bayes_text(train_texts, y_train):
    """
    Testeaza mai multe configuratii pentru Bayes Naiv pe text.
    """
    X_text_tr, X_text_val, y_tr, y_val = train_test_split(
        train_texts,
        y_train,
        test_size=0.2,
        random_state=RANDOM_STATE,
        stratify=y_train
    )

    configs = [
        ("MultinomialNB", 0.1, (1, 1)),
        ("MultinomialNB", 0.5, (1, 2)),
        ("MultinomialNB", 1.0, (1, 3)),
        ("ComplementNB", 0.1, (1, 1)),
        ("ComplementNB", 0.5, (1, 2)),
        ("ComplementNB", 1.0, (1, 3)),
    ]

    results = []
    best = None

    for model_name, alpha, ngram_range in configs:
        vectorizer = CountVectorizer(
            analyzer="char",
            ngram_range=ngram_range,
            lowercase=False
        )

        X_tr = vectorizer.fit_transform(X_text_tr)
        X_val = vectorizer.transform(X_text_val)

        if model_name == "MultinomialNB":
            model = MultinomialNB(alpha=alpha)
        else:
            model = ComplementNB(alpha=alpha)

        model.fit(X_tr, y_tr)
        pred = model.predict(X_val)

        acc = accuracy_score(y_val, pred)

        row = {
            "model": model_name,
            "alpha": alpha,
            "ngram_range": ngram_range,
            "val_accuracy": acc
        }
        results.append(row)

        if best is None or acc > best["val_accuracy"]:
            best = row

    return best, results


# ------------------------------------------------------------
# 6.2 Naive Bayes manual pentru date discrete
# ------------------------------------------------------------
class ManualDiscreteNaiveBayes:
    """
    Naive Bayes manual pentru date discrete.

    Cand folosesti:
        - seminar / exercitii pe hartie
        - date cu valori discretizate in bins
        - X are valori intregi 0..num_bins-1

    Formula:
        P(c | x) proportional cu P(c) * produs P(x_j | c)

    In cod folosim log:
        log P(c | x) = log P(c) + suma log P(x_j | c)
    """

    def __init__(self, alpha=1.0):
        self.alpha = alpha
        self.classes_ = None
        self.log_priors_ = None
        self.feature_value_log_probs_ = None
        self.num_values_per_feature_ = None

    def fit(self, X, y):
        X = np.asarray(X, dtype=np.int64)
        y = np.asarray(y)

        n_samples, n_features = X.shape

        self.classes_ = np.unique(y)
        self.num_values_per_feature_ = [int(X[:, j].max()) + 1 for j in range(n_features)]

        self.log_priors_ = {}
        self.feature_value_log_probs_ = {}

        for c in self.classes_:
            mask = (y == c)
            X_c = X[mask]
            n_c = X_c.shape[0]

            # Prior P(c)
            self.log_priors_[c] = math.log(n_c / n_samples)

            self.feature_value_log_probs_[c] = []

            for j in range(n_features):
                num_values = self.num_values_per_feature_[j]

                counts = np.zeros(num_values, dtype=np.float64)

                for value in X_c[:, j]:
                    counts[value] += 1

                # Laplace smoothing:
                # P(x_j = v | c) = (count + alpha) / (n_c + alpha * num_values)
                probs = (counts + self.alpha) / (n_c + self.alpha * num_values)
                log_probs = np.log(probs)

                self.feature_value_log_probs_[c].append(log_probs)

    def predict_one(self, x):
        x = np.asarray(x, dtype=np.int64)

        best_class = None
        best_score = -np.inf

        for c in self.classes_:
            score = self.log_priors_[c]

            for j, value in enumerate(x):
                # Daca apare o valoare care nu a fost vazuta in train,
                # ii dam probabilitate foarte mica.
                log_probs = self.feature_value_log_probs_[c][j]

                if value < len(log_probs):
                    score += log_probs[value]
                else:
                    score += math.log(1e-12)

            if score > best_score:
                best_score = score
                best_class = c

        return best_class

    def predict(self, X):
        X = np.asarray(X, dtype=np.int64)
        return np.array([self.predict_one(x) for x in X])


# ============================================================
# 7. KNN
# ============================================================

# ------------------------------------------------------------
# 7.1 Distante
# ------------------------------------------------------------
def l1_distance(x, y):
    """
    Distanta Manhattan / L1:
        sum |x_i - y_i|

    Folosita la:
        - KNN
        - comparare histograme / vectori simpli
    """
    return np.sum(np.abs(x - y))


def l2_distance(x, y):
    """
    Distanta Euclidiana / L2:
        sqrt(sum (x_i-y_i)^2)

    In KNN, sqrt nu schimba ordinea, deci putem folosi suma patratelor.
    """
    return np.sqrt(np.sum((x - y) ** 2))


# ------------------------------------------------------------
# 7.2 KNN manual
# ------------------------------------------------------------
class ManualKNNClassifier:
    """
    KNN manual cu L1 / L2.

    Cand folosesti:
        - laborator KNN
        - cand trebuie sa implementezi tu modelul
        - imagini vectorizate, features numerice etc.

    Idee:
        Pentru fiecare exemplu de test:
            1. calculez distantele fata de toate exemplele de train
            2. iau cei mai apropiati k
            3. vot majoritar
    """

    def __init__(self, n_neighbors=3, metric="l2"):
        self.n_neighbors = n_neighbors
        self.metric = metric
        self.X_train = None
        self.y_train = None

    def fit(self, X_train, y_train):
        self.X_train = np.asarray(X_train, dtype=np.float32)
        self.y_train = np.asarray(y_train)

    def _distances_to_train(self, x):
        if self.metric == "l1":
            return np.sum(np.abs(self.X_train - x), axis=1)

        if self.metric == "l2":
            # Nu punem sqrt pentru ca ordinea distantelor ramane aceeasi.
            return np.sum((self.X_train - x) ** 2, axis=1)

        raise ValueError("metric trebuie sa fie 'l1' sau 'l2'.")

    def predict_one(self, x):
        distances = self._distances_to_train(x)

        # Cele mai mici distante = cei mai apropiati vecini.
        neighbor_indices = np.argsort(distances)[:self.n_neighbors]
        neighbor_labels = self.y_train[neighbor_indices]

        # Vot majoritar.
        counts = Counter(neighbor_labels)
        prediction = counts.most_common(1)[0][0]

        return prediction

    def predict(self, X_test):
        X_test = np.asarray(X_test, dtype=np.float32)
        return np.array([self.predict_one(x) for x in X_test])


def train_sklearn_knn(X_train, y_train, X_test, n_neighbors=3, metric="minkowski", p=2):
    """
    KNN sklearn.

    Pentru L2:
        metric='minkowski', p=2

    Pentru L1:
        metric='manhattan'
        sau metric='minkowski', p=1
    """
    model = KNeighborsClassifier(
        n_neighbors=n_neighbors,
        metric=metric,
        p=p
    )

    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    return pred, model


# ------------------------------------------------------------
# 7.3 KNN pe similaritate
# ------------------------------------------------------------
class SimilarityKNNClassifier:
    """
    KNN cand ai similaritate, nu distanta.

    Exemplu:
        - string kernel
        - kernel intersectie
        - orice K_test_train unde valori mari = mai aproape

    predict_from_kernel primeste:
        K_test_train.shape = (n_test, n_train)
    """

    def __init__(self, n_neighbors=3):
        self.n_neighbors = n_neighbors
        self.y_train = None

    def fit(self, y_train):
        self.y_train = np.asarray(y_train)

    def predict_from_kernel(self, K_test_train):
        predictions = []

        for i in range(K_test_train.shape[0]):
            sims = K_test_train[i]

            # Similaritatea mare este buna, deci sortam descrescator.
            idx = np.argsort(-sims)[:self.n_neighbors]

            labels = self.y_train[idx]
            selected_sims = sims[idx]

            pred = self._vote(labels, selected_sims)
            predictions.append(pred)

        return np.array(predictions)

    def _vote(self, labels, sims):
        """
        Vot majoritar.
        In caz de egalitate, aleg clasa cu suma similaritatilor mai mare.
        """
        best_label = None
        best_count = -1
        best_sim_sum = -1

        for label in np.unique(labels):
            mask = (labels == label)
            count = np.sum(mask)
            sim_sum = np.sum(sims[mask])

            if count > best_count:
                best_count = count
                best_sim_sum = sim_sum
                best_label = label
            elif count == best_count and sim_sum > best_sim_sum:
                best_sim_sum = sim_sum
                best_label = label

        return best_label


# ============================================================
# 8. STRING KERNEL SI MATRICE KERNEL
# ============================================================

def get_ngrams_set(text, p=8):
    """
    Intoarce setul de n-grame de lungime p.

    Bit de prezenta:
        daca o n-grama apare de 5 ori, o pastram o singura data.

    Folosit la:
        - string kernel
        - texte scurte/lungi unde conteaza fragmente comune
    """
    if len(text) < p:
        return set()

    return {text[i:i+p] for i in range(len(text) - p + 1)}


def string_kernel_presence(s, t, p=8):
    """
    Similaritate string kernel:
        numarul de n-grame comune.

    Exemplu:
        string_kernel_presence("ananas copt", "banana verde", p=4) = 2
    """
    s_set = get_ngrams_set(s, p)
    t_set = get_ngrams_set(t, p)

    return len(s_set.intersection(t_set))


def build_ngram_sets(texts, p=8):
    """
    Precalculeaza seturile de n-grame pentru viteza.
    """
    return [get_ngrams_set(text, p) for text in texts]


def kernel_from_ngram_sets(set_a, set_b):
    """
    K(a,b) = numarul de n-grame comune.
    """
    return len(set_a.intersection(set_b))


def compute_kernel_matrix(A_sets, B_sets):
    """
    Matrice kernel intre doua multimi:
        K[i,j] = K(A_i, B_j)

    Pentru test:
        A_sets = test_sets
        B_sets = train_sets
        rezultat shape = n_test x n_train
    """
    K = np.zeros((len(A_sets), len(B_sets)), dtype=np.float32)

    for i in range(len(A_sets)):
        for j in range(len(B_sets)):
            K[i, j] = kernel_from_ngram_sets(A_sets[i], B_sets[j])

    return K


def compute_symmetric_train_kernel_matrix(train_sets):
    """
    Matrice kernel train x train.
    E simetrica, deci calculam doar j >= i.
    """
    n = len(train_sets)
    K = np.zeros((n, n), dtype=np.float32)

    for i in range(n):
        for j in range(i, n):
            val = kernel_from_ngram_sets(train_sets[i], train_sets[j])
            K[i, j] = val
            K[j, i] = val

    return K


# ============================================================
# 9. KERNELURI NUMERICE
# ============================================================

def linear_kernel_matrix(X, Y):
    """
    Kernel liniar:
        K(x,y) = x dot y

    Folosit la:
        - Kernel Ridge liniar
        - SVM precomputed liniar
    """
    return np.asarray(X) @ np.asarray(Y).T


def intersection_kernel_matrix(X, Y):
    """
    Kernel intersectie:
        K(x,y) = sum min(x_i, y_i)

    Folosit la:
        - histograme
        - vectori de probabilitati / Markov
        - features nenegative
    """
    X = np.asarray(X, dtype=np.float32)
    Y = np.asarray(Y, dtype=np.float32)

    K = np.zeros((X.shape[0], Y.shape[0]), dtype=np.float32)

    for i in range(X.shape[0]):
        K[i, :] = np.minimum(X[i], Y).sum(axis=1)

    return K


def l1_normalize_nonnegative(X):
    """
    Normalizeaza fiecare linie astfel incat suma sa fie 1.

    Folosit inainte de Hellinger, cand vectorii sunt histograme/counts.
    """
    X = np.maximum(np.asarray(X, dtype=np.float32), 0)

    row_sums = X.sum(axis=1, keepdims=True)

    return np.divide(
        X,
        row_sums,
        out=np.zeros_like(X),
        where=(row_sums != 0)
    )


def hellinger_kernel_matrix(X, Y, normalize=True):
    """
    Kernel Hellinger:
        K(x,y) = sum sqrt(x_i * y_i)

    Daca x si y sunt histograme normalizate L1,
    kernelul masoara similaritatea intre distributii.

    Implementare rapida:
        sqrt(X) @ sqrt(Y).T
    """
    X = np.maximum(np.asarray(X, dtype=np.float32), 0)
    Y = np.maximum(np.asarray(Y, dtype=np.float32), 0)

    if normalize:
        X = l1_normalize_nonnegative(X)
        Y = l1_normalize_nonnegative(Y)

    return np.sqrt(X) @ np.sqrt(Y).T


def rbf_kernel_matrix(X, Y, gamma=1.0):
    """
    Kernel RBF / Gaussian:
        K(x,y) = exp(-gamma * ||x-y||^2)

    Folosit la:
        - SVM cu kernel RBF
        - modele neliniare pe features numerice

    Pentru date mari poate fi costisitor.
    """
    X = np.asarray(X, dtype=np.float32)
    Y = np.asarray(Y, dtype=np.float32)

    X_norm = np.sum(X ** 2, axis=1, keepdims=True)
    Y_norm = np.sum(Y ** 2, axis=1, keepdims=True).T

    distances_sq = X_norm + Y_norm - 2 * X @ Y.T
    distances_sq = np.maximum(distances_sq, 0)

    return np.exp(-gamma * distances_sq)


def polynomial_kernel_matrix(X, Y, degree=2, c=1.0):
    """
    Kernel polinomial:
        K(x,y) = (x dot y + c)^degree

    Folosit cand vrei relatii neliniare de grad degree.
    """
    return (np.asarray(X) @ np.asarray(Y).T + c) ** degree


# ============================================================
# 10. SVM
# ============================================================

def train_svm_linear(X_train, y_train, X_test, C=1.0):
    """
    SVM liniar.

    Cand folosesti:
        - date cu multe features
        - Bag of Words / TF-IDF
        - separare aproximativ liniara

    Pentru text, LinearSVC este adesea mai rapid decat SVC(kernel='linear').
    """
    model = LinearSVC(C=C, random_state=RANDOM_STATE)
    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    return pred, model


def train_svm_rbf(X_train, y_train, X_test, C=1.0, gamma="scale"):
    """
    SVM cu kernel RBF.

    Cand folosesti:
        - features numerice dense
        - probleme neliniare
        - dataset nu foarte mare

    Recomandat:
        standardizare inainte.
    """
    model = SVC(C=C, kernel="rbf", gamma=gamma)
    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    return pred, model


def train_svm_precomputed(K_train, y_train, K_test, C=1.0):
    """
    SVM cu kernel precomputed.

    Cand folosesti:
        - subiectul cere explicit kernel='precomputed'
        - ai string kernel / Hellinger / intersection calculat manual

    Shape-uri obligatorii:
        K_train: n_train x n_train
        K_test:  n_test x n_train
    """
    model = SVC(C=C, kernel="precomputed")
    model.fit(K_train, y_train)
    pred = model.predict(K_test)

    return pred, model


# ============================================================
# 11. KERNEL RIDGE PENTRU CLASIFICARE
# ============================================================

def one_hot_labels(y):
    """
    Transforma etichete in one-hot.

    Exemplu:
        y = [0, 2, 1]
        classes = [0, 1, 2]

        Y =
        [[1,0,0],
         [0,0,1],
         [0,1,0]]
    """
    y = np.asarray(y)
    classes = np.unique(y)
    class_to_idx = {cls: idx for idx, cls in enumerate(classes)}

    Y = np.zeros((len(y), len(classes)), dtype=np.float32)

    for i, label in enumerate(y):
        Y[i, class_to_idx[label]] = 1.0

    return Y, classes


def predict_from_scores(scores, classes):
    """
    Transforma scorurile modelului in etichete.

    scores shape:
        n_examples x n_classes
    """
    indices = np.argmax(scores, axis=1)
    return classes[indices]


class PrecomputedKernelRidgeClassifier:
    """
    Kernel Ridge pentru clasificare folosind kernel precomputed.

    Cand folosesti:
        - subiecte cu KRR si kernel precomputed
        - string kernel
        - linear/intersection/Hellinger precomputed

    Formula sklearn:
        KernelRidge(alpha=..., kernel='precomputed')
    """

    def __init__(self, alpha=1.0):
        self.alpha = alpha
        self.model = KernelRidge(alpha=alpha, kernel="precomputed")
        self.classes_ = None

    def fit(self, K_train, y_train):
        Y_train, classes = one_hot_labels(y_train)
        self.classes_ = classes

        self.model.fit(K_train, Y_train)

    def predict(self, K_test):
        scores = self.model.predict(K_test)
        return predict_from_scores(scores, self.classes_)


class ManualKernelRidgeClassifier:
    """
    Implementare manuala Kernel Ridge multi-clasa.

    Formula:
        alpha = solve(K + lambda*I, Y)

    Predict:
        scores = K_test @ alpha
        y_pred = argmax(scores)
    """

    def __init__(self, lmbda=1.0):
        self.lmbda = lmbda
        self.alpha_ = None
        self.classes_ = None

    def fit(self, K_train, y_train):
        Y_train, classes = one_hot_labels(y_train)
        self.classes_ = classes

        n = K_train.shape[0]
        A = K_train + self.lmbda * np.eye(n)

        self.alpha_ = np.linalg.solve(A, Y_train)

    def predict(self, K_test):
        scores = K_test @ self.alpha_
        return predict_from_scores(scores, self.classes_)


# ============================================================
# 12. RIDGE REGRESSION / REGRESIE
# ============================================================

def train_ridge_regression(X_train, y_train, X_test, alpha=1.0):
    """
    Ridge Regression.

    Cand folosesti:
        - probleme de regresie
        - trebuie afisati coeficientii si biasul
        - selectare cel mai important atribut dupa |coeficient|

    Important:
        Standardizeaza datele inainte daca features au scale diferite.
    """
    model = Ridge(alpha=alpha)
    model.fit(X_train, y_train)

    pred = model.predict(X_test)

    print("Coeficienti:", model.coef_)
    print("Bias / intercept:", model.intercept_)

    # Cel mai semnificativ atribut = coeficientul cu valoarea absoluta cea mai mare.
    most_important = np.argsort(-np.abs(model.coef_))
    print("Ordinea atributelor dupa importanta:", most_important)

    return pred, model


# ============================================================
# 13. REGRESIE LOGISTICA / SOFTMAX
# ============================================================

def train_logistic_regression(X_train, y_train, X_test, C=1.0):
    """
    Logistic Regression multinomiala / Softmax.

    Cand folosesti:
        - clasificare multi-clasa
        - baseline puternic pe features numerice / BoW
        - vrei coeficienti interpretabil

    C:
        inversul regularizarii.
        C mare -> regularizare mica.
        C mic -> regularizare mare.
    """
    model = LogisticRegression(
        C=C,
        max_iter=1000,
        solver="lbfgs",
        multi_class="auto"
    )

    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    return pred, model


# ============================================================
# 14. MLP / RETEA NEURONALA FEED-FORWARD CU ADAM
# ============================================================

def train_mlp_classifier(X_train, y_train, X_test,
                         hidden_layer_sizes=(128,),
                         learning_rate_init=0.001,
                         alpha=0.0001,
                         max_iter=500):
    """
    MLPClassifier = retea neuronala feed-forward.

    Cand folosesti:
        - subiectul cere retea feed-forward
        - date vectorizate numeric
        - semnale transformate la lungime fixa
        - imagini flatten / features

    Parametri:
        hidden_layer_sizes:
            (128,) -> un strat ascuns cu 128 neuroni
            (256,128) -> doua straturi ascunse

        solver='adam':
            optimizator Adam, cerut des in subiecte

        alpha:
            regularizare L2

        learning_rate_init:
            rata de invatare
    """
    model = MLPClassifier(
        hidden_layer_sizes=hidden_layer_sizes,
        solver="adam",
        activation="relu",
        learning_rate_init=learning_rate_init,
        alpha=alpha,
        max_iter=max_iter,
        random_state=RANDOM_STATE
    )

    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    return pred, model


# ============================================================
# 15. FEATURES MARKOV PENTRU SEMNALE x,y,z
# ============================================================

def fit_markov_bins(train_signals, k=6):
    """
    Calculeaza intervalele de discretizare pentru cele 3 axe.

    Cand folosesti:
        - semnale accelerometru
        - cerinta cu matrice de tranzitie Markov

    IMPORTANT:
        bins se calculeaza doar pe train.
    """
    all_values = np.vstack(train_signals)
    bins_per_axis = []

    for axis in range(3):
        edges = make_equal_width_bins(all_values[:, axis], k)
        bins_per_axis.append(edges)

    return bins_per_axis


def markov_features_one_signal(signal, bins_per_axis, k=6):
    """
    Pentru un semnal (L,3), calculeaza vector Markov.

    Pentru fiecare axa:
        1. discretizam valorile in stari 0..k-1
        2. construim matrice A k x k
        3. A[i,j] = nr tranzitii i -> j
        4. normalizam fiecare linie
        5. flatten

    Pentru 3 axe:
        vector final are dimensiunea 3*k*k.
        Daca k=6, dimensiune = 108.
    """
    features = []

    for axis in range(3):
        states = discretize_values(signal[:, axis], bins_per_axis[axis])

        A = np.zeros((k, k), dtype=np.float32)

        for t in range(len(states) - 1):
            i = states[t]
            j = states[t + 1]
            A[i, j] += 1

        row_sums = A.sum(axis=1, keepdims=True)

        A_norm = np.divide(
            A,
            row_sums,
            out=np.zeros_like(A),
            where=(row_sums != 0)
        )

        features.append(A_norm.flatten())

    return np.concatenate(features)


def build_markov_features(signals, bins_per_axis, k=6):
    """
    Aplica Markov features pe toate semnalele.
    """
    return np.array(
        [markov_features_one_signal(s, bins_per_axis, k) for s in signals],
        dtype=np.float32
    )


# ============================================================
# 16. CONVOLUTIE TEXT CU 3-GRAME
# ============================================================

def text_to_numeric_vector(text, mapping):
    """
    Transforma text in vector numeric folosind mapping caracter -> numar.

    Caracter necunoscut -> 0.
    """
    return np.array([mapping.get(ch, 0) for ch in text], dtype=np.float32)


def words_to_filter_matrix(words, mapping):
    """
    Transforma lista de 3-grame in matrice:
        num_filters x 3
    """
    filters = []

    for word in words:
        vec = text_to_numeric_vector(word, mapping)

        if len(vec) != 3:
            raise ValueError(f"Filtrul {word!r} nu are lungime 3.")

        filters.append(vec)

    return np.array(filters, dtype=np.float32)


def convolution_3gram_features_one_text(text, filter_matrix, mapping, threshold=0.9):
    """
    Aplica toate filtrele de lungime 3 pe un text.

    Pentru fiecare filtru:
        - calculez similaritatea cosinus cu fiecare fereastra de lungime 3
        - numar cate similaritati depasesc threshold

    Returneaza vector:
        [count_f1, count_f2, ..., count_f500]
    """
    doc = text_to_numeric_vector(text, mapping)
    n = 3

    num_filters = filter_matrix.shape[0]

    if len(doc) < n:
        return np.zeros(num_filters, dtype=np.float32)

    windows = np.lib.stride_tricks.sliding_window_view(doc, window_shape=n)

    # dot_products shape: num_windows x num_filters
    dot_products = windows @ filter_matrix.T

    window_norms = np.linalg.norm(windows, axis=1, keepdims=True)
    filter_norms = np.linalg.norm(filter_matrix, axis=1, keepdims=True).T

    denominator = window_norms * filter_norms

    similarities = np.divide(
        dot_products,
        denominator,
        out=np.zeros_like(dot_products),
        where=(denominator != 0)
    )

    counts = (similarities > threshold).sum(axis=0)

    return counts.astype(np.float32)


def build_convolution_3gram_features(texts, words, mapping, threshold=0.9):
    """
    Pentru toate textele:
        returneaza matrice n_texts x n_filters.
    """
    filter_matrix = words_to_filter_matrix(words, mapping)

    X = []

    for text in texts:
        features = convolution_3gram_features_one_text(
            text,
            filter_matrix,
            mapping,
            threshold=threshold
        )
        X.append(features)

    return np.array(X, dtype=np.float32)


# ============================================================
# 17. TEMPLATE-URI RAPIDE PENTRU TIPURI DE SUBIECTE
# ============================================================

def template_text_naive_bayes():
    """
    EXEMPLU DE UTILIZARE:
    Subiect text + Bayes Naiv + Bag of Words pe caractere.

    train_texts = read_lines_txt("train_sentences.txt")
    y_train = read_npy("train_labels.npy")
    test_texts = read_lines_txt("test_sentences.txt")

    X_train, X_test, vectorizer = bow_char_features_train_test(
        train_texts,
        test_texts,
        ngram_range=(1,3),
        use_tfidf=False
    )

    pred, model = train_multinomial_nb(X_train, y_train, X_test, alpha=1.0)
    save_predictions_npy("subiect1_solutia1.npy", pred)
    """
    pass


def template_string_kernel_krr():
    """
    EXEMPLU DE UTILIZARE:
    Subiect cu string kernel pe n-grame si Kernel Ridge precomputed.

    train_texts = read_npy_texts("train_data.npy")
    y_train = read_npy("train_labels.npy")
    test_texts = read_npy_texts("test_data.npy")

    train_sets = build_ngram_sets(train_texts, p=8)
    test_sets = build_ngram_sets(test_texts, p=8)

    K_train = compute_symmetric_train_kernel_matrix(train_sets)
    K_test = compute_kernel_matrix(test_sets, train_sets)

    model = PrecomputedKernelRidgeClassifier(alpha=0.1)
    model.fit(K_train, y_train)
    pred = model.predict(K_test)

    save_predictions_txt("subiect4_solutia1.txt", pred)
    """
    pass


def template_signal_markov_svm():
    """
    EXEMPLU DE UTILIZARE:
    Subiect cu semnale accelerometru + Markov features + SVM precomputed.

    train_files, y_train = read_train_file_label("data/train.txt")
    test_files = read_test_file_list("data/test.txt")

    train_signals = load_signals_from_folder(train_files, "data/train")
    test_signals = load_signals_from_folder(test_files, "data/test")

    bins = fit_markov_bins(train_signals, k=6)

    X_train = build_markov_features(train_signals, bins, k=6)
    X_test = build_markov_features(test_signals, bins, k=6)

    K_train = intersection_kernel_matrix(X_train, X_train)
    K_test = intersection_kernel_matrix(X_test, X_train)

    pred, model = train_svm_precomputed(K_train, y_train, K_test, C=10)
    save_predictions_csv_filename_label("subiect4_solutia1.txt", test_files, pred)
    """
    pass


def template_mlp_signals():
    """
    EXEMPLU DE UTILIZARE:
    Subiect cu semnale + MLP feed-forward.

    train_files, y_train = read_train_file_label("data/train.txt")
    test_files = read_test_file_list("data/test.txt")

    train_signals = load_signals_from_folder(train_files, "data/train")
    test_signals = load_signals_from_folder(test_files, "data/test")

    X_train, target_len = build_fixed_length_signal_features(train_signals)
    X_test, _ = build_fixed_length_signal_features(test_signals, target_len=target_len)

    X_train_scaled, X_test_scaled, scaler = standardize_train_test(X_train, X_test)

    pred, model = train_mlp_classifier(
        X_train_scaled,
        y_train,
        X_test_scaled,
        hidden_layer_sizes=(256,128),
        learning_rate_init=0.001,
        alpha=0.0001
    )

    save_predictions_csv_filename_label("subiect1_solutia1.txt", test_files, pred)
    """
    pass


# ============================================================
# 18. MAIN DEMO MIC, FARA DATE EXTERNE
# ============================================================

if __name__ == "__main__":
    print("ML Colocviu Toolkit incarcat corect.")
    print("Acest fisier este gandit ca material de copiat pe bucati in functie de subiect.")
    print()

    # Demo string kernel din enuntul clasic:
    s = "ananas copt"
    t = "banana verde"
    print("Demo string kernel:")
    print("s =", s)
    print("t =", t)
    print("p = 4")
    print("similaritate =", string_kernel_presence(s, t, p=4))
    print("Valoarea asteptata in exemplul din subiect: 2")
    print()

    # Demo Naive Bayes manual pe date mici, discretizate.
    X_demo = np.array([
        [0, 1],
        [0, 0],
        [1, 1],
        [2, 0],
        [2, 1],
    ])
    y_demo = np.array([0, 0, 1, 1, 1])

    nb = ManualDiscreteNaiveBayes(alpha=1.0)
    nb.fit(X_demo, y_demo)

    print("Demo Naive Bayes manual:")
    print("Predictie pentru [0,1]:", nb.predict(np.array([[0, 1]]))[0])
    print()

    # Demo KNN manual.
    knn = ManualKNNClassifier(n_neighbors=3, metric="l1")
    knn.fit(X_demo, y_demo)
    print("Demo KNN manual:")
    print("Predictie pentru [1,0]:", knn.predict(np.array([[1, 0]]))[0])
    print()
