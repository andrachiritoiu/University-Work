import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score


# 1
class  KnnClassifier:
    def __init__(self, train_images, train_labels):
        self.train_images = train_images
        self.train_labels = train_labels

    # 2. trebuie sa clasificam imaginea => ce cifra este de la 0 la 9
    def classify_image(self, test_image, num_neighbors=3, metric='l2'):
        # distantele
        if metric == 'l1':
            #n = nr de features(de pixeli) ale unei imagini(784)
            #un pixel - o val intre 0 si 255
            # X = test_image
            # Y = train_image

            dif = test_image - self.train_images
            distances = np.sum(np.abs(dif), axis=1)

        elif metric == 'l2':
            dif = test_image - self.train_images
            distances = np.sqrt(np.sum(dif ** 2, axis=1))

        #  sortarea pentru a lua cei mai apropiati k vecini
        sorted_indices = np.argsort(distances)
        nearest_indices = sorted_indices[:num_neighbors]

        #etichetele vecinilor
        labels = self.train_labels[nearest_indices]

        #vecinul care apare de cele mai multe ori
        vote = np.argmax(np.bincount(labels))

        return vote



# 3. acuratetea
train_images = np.loadtxt('data_MNIST/data/train_images.txt')
train_labels = np.loadtxt('data_MNIST/data/train_labels.txt').astype(int)

test_images = np.loadtxt('data_MNIST/data/test_images.txt')
test_labels = np.loadtxt('data_MNIST/data/test_labels.txt').astype(int)

classfier = KnnClassifier(train_images, train_labels)
predictions = []

for i in range(len(test_images)):
    # shape(1, 784)
    pred = classfier.classify_image(test_images[i:i+1], num_neighbors=3, metric='l2')
    predictions.append(pred)

predictions = np.array(predictions)
accuracy = np.mean(predictions == test_labels)
np.savetxt('predictii_3nn_l2_mnist.txt', predictions)

# print(accuracy)



# 4
# a
values = [1,3, 5, 7, 9]
accuracy_graph = []

for k in values:
    predictions = []
    for i in range(len(test_images)):
        pred = classfier.classify_image(test_images[i:i+1], num_neighbors=k, metric='l2')
        predictions.append(pred)

    predictions = np.array(predictions)
    accuracy = np.mean(predictions == test_labels)
    accuracy_graph.append(accuracy)

np.savetxt('acuratete_l2.txt', accuracy_graph)
# plt.plot(accuracy_graph)
# plt.show()


# b
accuracy_graphl1 = []

for k in values:
    predictions = []
    for i in range(len(test_images)):
        pred = classfier.classify_image(test_images[i:i+1], num_neighbors=k, metric='l1')
        predictions.append(pred)

    predictions = np.array(predictions)
    accuracy = np.mean(predictions == test_labels)
    accuracy_graphl1.append(accuracy)



plt.plot(values, accuracy_graph, label='L2')
plt.plot(values, accuracy_graphl1, label='L1')
plt.show()