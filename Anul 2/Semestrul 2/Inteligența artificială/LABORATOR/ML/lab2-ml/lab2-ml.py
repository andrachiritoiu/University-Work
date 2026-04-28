import numpy as np
import matplotlib.pyplot as plt
from sklearn.naive_bayes import MultinomialNB

train_images = np.loadtxt('data_MNIST/data/train_images.txt')
train_labels = np.loadtxt('data_MNIST/data/train_labels.txt').astype(int)

test_images = np.loadtxt('data_MNIST/data/test_images.txt')
test_labels = np.loadtxt('data_MNIST/data/test_labels.txt').astype(int)



# REZOLVARE
# 1
data = [
    (160, 'F'),
    (165, 'F'),
    (155, 'F'),
    (172, 'F'),
    (175, 'B'),
    (180, 'B'),
    (177, 'B'),
    (190, 'B')
]

heights = [x[0] for x in data]
labels = [x[1] for x in data]

bins = [(150, 160), (161, 170), (171, 180), (181, 190)]

def get_bin(val, bins):
    for i in range(len(bins)):
        if bins[i][0]<=val<=bins[i][1]:
            return i

    return None


# discretizare
binned_data = [get_bin(h,bins) for h in heights]

# pt cine vrem predictia
x_test = 178
x_bin = get_bin(x_test, bins)

results = {}

for c in ['F', 'B']:
    #P(C)
    prior = labels.count(c) / len(labels)

    #cate sunt in clasa C
    total_c = labels.count(c)

    #cate sunt in interval cu x_test
    count=0

    for i in range(len(data)):
        if data[i][1] == c and binned_data[i] == x_bin:
            count+=1


    #P(x | c)
    likelihood = count / total_c

    #Scorul Bayes :  P(c | x) proportional cu P(c) * P(x | c)
    results[c] = prior * likelihood

# print("Scoruri nenormalizate:", results)

normalizare = sum(results.values())

for c in results:
    results[c] = results[c] / normalizare

# print("Probabilitati finale:", results)
#
# prediction = max(results, key=results.get)
# print("Predictie:", prediction)




# 2. discretizare
num_bins = 5
bins = np.linspace(0, 255, num_bins)

def values_to_bins(pixels, bins):
    return np.digitize(pixels, bins)

train_images_bins = values_to_bins(train_images, bins)
test_images_bins = values_to_bins(test_images, bins)

# print("Bins:")
# print(bins)
#
# print("Train discretizat:")
# print(train_images_bins)
#
# print("Test discretizat:")
# print(test_images_bins)



# 3. acuratetea = nr predictii corecte/ nr total ex
model = MultinomialNB()
model.fit(train_images_bins, train_labels)
predictions = model.predict(test_images_bins)
accuracy = model.score(test_images_bins, test_labels)

# print("Acuratețe:", accuracy)


# 4
num_bins_values = [3, 5, 7, 9, 11]

for num_bins in num_bins_values:
    bins = np.linspace(0,255,num_bins)

    train_images_bins = values_to_bins(train_images, bins)
    test_images_bins = values_to_bins(test_images, bins)

    model = MultinomialNB()
    model.fit(train_images_bins, train_labels)
    predictions = model.predict(test_images_bins)
    accuracy = model.score(test_images_bins, test_labels)

    # print(f"num_bins = {num_bins} -> accuracy = {accuracy}")



#5. ex misclasificate
num_bins = 7
bins = np.linspace(0,255,num_bins)

train_images_bins = values_to_bins(train_images, bins)
test_images_bins = values_to_bins(test_images, bins)

model = MultinomialNB()
model.fit(train_images_bins, train_labels)
predictions = model.predict(test_images_bins)

wrong = np.where(predictions != test_labels)[0]

for i in wrong[:10]:
    image = test_images[i]
    image = image.reshape(28, 28)

    plt.title(f"Real: {test_labels[i]}\nPred: {predictions[i]}")
    plt.imshow(image)
    # plt.show()


# 6.matricea de confuzie
confusion_matrix = np.zeros((10,10))

for i in range(len(test_labels)):
    real = test_labels[i]
    prez = predictions[i]

    confusion_matrix[real][prez] +=1

print(confusion_matrix)