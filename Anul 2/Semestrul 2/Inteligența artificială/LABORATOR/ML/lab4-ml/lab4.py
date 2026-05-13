import numpy as np
import matplotlib.pyplot as plt
from pyexpat import features
from sklearn import preprocessing
from sklearn import svm
from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score


# 1. incarcare date
training_labels = np.load("data/training_labels.npy")
training_sentences = np.load("data/training_sentences.npy", allow_pickle=True)

test_labels = np.load("data/test_labels.npy")
test_sentences = np.load("data/test_sentences.npy", allow_pickle=True)

# print(training_sentences)
# print(training_sentences[0])


# 2. normalizare
def normalize_data(train_data, test_data, type=None):
    if type is None:
        return train_data, test_data
    elif type == "standard":
        scaler = preprocessing.StandardScaler()
        scaler.fit(train_data)

        train_data = scaler.transform(train_data)
        test_data = scaler.transform(test_data)

        return train_data, test_data

    elif type == "l1":
        normalizer = preprocessing.Normalizer(norm="l1")

        train_data = normalizer.transform(train_data)
        test_data = normalizer.transform(test_data)

        return train_data, test_data

    elif type == "l2":
        normalizer = preprocessing.Normalizer(norm="l2")

        train_data = normalizer.transform(train_data)
        test_data = normalizer.transform(test_data)

        return train_data, test_data


# 3.vocabularul
class BagOfWords:
    def __init__(self):
        self.vocabulary = dict()
        self.words = []


    def build_vocabulary(self, data):
        cnt = 0

        for sentence in data:
            for word in sentence:
                if word not in self.vocabulary:
                    self.vocabulary[word] = cnt
                    cnt+=1
                    self.words.append(word)


# bag_of_words = BagOfWords()
# bag_of_words.build_vocabulary(training_sentences)
# print(len(bag_of_words.vocabulary))


# 4.frecventele
    def get_data(self, data):
        features = np.zeros((len(data), len(self.vocabulary)))

        for i in range(len(data)):
            for key,value in self.vocabulary.items():
                features[i][value] = data[i].count(key)

        return features

# bag_of_words = BagOfWords()
# bag_of_words.build_vocabulary(training_sentences)
# features = bag_of_words.get_data(training_sentences)
# print(features)



# 5.repreentarile Bow
bag_of_words = BagOfWords()
bag_of_words.build_vocabulary(training_sentences)
features_traing = bag_of_words.get_data(training_sentences)
features_test = bag_of_words.get_data(test_sentences)
features_traing, features_test = normalize_data(features_traing,features_test,"l2")

# print(features_train.shape)
# print(features_test.shape)


# 6.SVM linear
model = svm.SVC(C=1,kernel='linear', gamma='auto')

# anternarea
model.fit(features_traing, training_labels)

# predictii
predictions = model.predict(features_test)

# accurancy = nr_predictii_corecte/nr_predictii
acc = accuracy_score(test_labels, predictions)
print(acc)

# F1 - score
f1 = f1_score(test_labels, predictions)
print(f1)

# afisare
idxs = model.coef_[0]    # 1d - vector

negative_indices = np.argsort(idxs)[:10]
positive_indices = np.argsort(idxs)[-10:]

negative_words = [bag_of_words.words[i] for i in negative_indices]
positive_words = [bag_of_words.words[i] for i in positive_indices]

print(negative_words)
print(positive_words)