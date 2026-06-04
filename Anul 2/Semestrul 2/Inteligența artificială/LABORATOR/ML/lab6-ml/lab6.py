import numpy as np
import matplotlib.pyplot as plt
from sklearn.utils import shuffle

# 1. dreapta care separa perfect clasele
# Datele de antrenare
X = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])

y = np.array([-1, 1, 1, 1])

# Alegem o dreapta:
# x1 + x2 - 0.5 = 0
W = np.array([1, 1])
b = -0.5

# Calculam scorurile perceptronului
scoruri = np.dot(X, W) + b

# Aplicam functia sign pentru predictii
predictii = np.sign(scoruri)

print("Scoruri:", scoruri)
print("Predictii:", predictii)
print("Etichete reale:", y)

# Calculam acuratetea
acuratete = np.mean(predictii == y)
print("Acuratete:", acuratete)


#cod cu desenarea dereptei
#
# import numpy as np
# import matplotlib.pyplot as plt
#
# X = np.array([
#     [0, 0],
#     [0, 1],
#     [1, 0],
#     [1, 1]
# ])
#
# y = np.array([-1, 1, 1, 1])
#
# W = np.array([1, 1])
# b = -0.5
#
# # Punctele din clasa -1
# plt.plot(X[y == -1, 0], X[y == -1, 1], 'b+', label='clasa -1')
#
# # Punctele din clasa 1
# plt.plot(X[y == 1, 0], X[y == 1, 1], 'r+', label='clasa 1')
#
# # Dreapta: x1 + x2 - 0.5 = 0
# # x2 = -x1 + 0.5
# x1_values = np.linspace(-0.5, 1.5, 100)
# x2_values = -x1_values + 0.5
#
# plt.plot(x1_values, x2_values, 'k-', label='dreapta de separare')
#
# plt.xlim(-0.5, 1.5)
# plt.ylim(-0.5, 1.5)
# plt.legend()
# plt.grid()
# plt.show()





# 2.antrenare eprceptron cu Widrow-Hoff, 70 epoci, lr=0.1

# Perceptronul învață o dreaptă:
#     x1 * w1 + x2 * w2 + b = 0


# Datele de antrenare
X = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])

y = np.array([-1, 1, 1, 1])


def compute_y(x, W, bias):
    # Dreapta de decizie:
    # [x, y] * [W[0], W[1]] + bias = 0
    # x * W[0] + y * W[1] + bias = 0
    # y = (-x * W[0] - bias) / W[1]

    return (-x * W[0] - bias) / (W[1] + 1e-10)


def plot_decision_boundary(X, y, W, b, current_x, current_y):
    x1 = -0.5
    y1 = compute_y(x1, W, b)

    x2 = 1.5
    y2 = compute_y(x2, W, b)

    # sterge continutul ferestrei
    plt.clf()

    # alegem culoarea exemplului curent
    color = 'r'
    if current_y == -1:
        color = 'b'

    plt.ylim((-1, 2))
    plt.xlim((-1, 2))

    # punctele din clasa -1
    plt.plot(X[y == -1, 0], X[y == -1, 1], 'b+', label='clasa -1')

    # punctele din clasa 1
    plt.plot(X[y == 1, 0], X[y == 1, 1], 'r+', label='clasa 1')

    # exemplul curent
    plt.plot(current_x[0], current_x[1], color + 's')

    # dreapta de decizie
    plt.plot([x1, x2], [y1, y2], 'black')

    # plt.legend()
    # plt.show(block=False)
    # plt.pause(0.3)


# initializam ponderile si bias-ul cu 0
W = np.zeros(2)
b = 0

learning_rate = 0.1
num_epochs = 70


for epoch in range(num_epochs):

    # amestecam datele la fiecare epoca
    X_shuffled, y_shuffled = shuffle(X, y, random_state=epoch)

    for i in range(len(X_shuffled)):
        current_x = X_shuffled[i]
        current_y = y_shuffled[i]

        # predictia perceptronului fara sign,
        # pentru ca Widrow-Hoff foloseste functia identitate
        y_hat = np.dot(current_x, W) + b

        # eroarea pentru exemplul curent
        error = y_hat - current_y

        # actualizam ponderile
        W = W - learning_rate * error * current_x

        # actualizam bias-ul
        b = b - learning_rate * error

        # afisam dreapta de decizie la fiecare pas
        plot_decision_boundary(X, y, W, b, current_x, current_y)


# calculam predictiile finale
scores = np.dot(X, W) + b

# transformam scorurile in clase: -1 sau 1
predictions = np.where(scores >= 0, 1, -1)

accuracy = np.mean(predictions == y)

print("W final:", W)
print("b final:", b)
print("Scoruri finale:", scores)
print("Predictii finale:", predictions)
print("Etichete reale:", y)
print("Acuratete:", accuracy)



# 3. antrenare perceptron pe multime a de antrenare
# schimbam y de intarre fata de 2

# Datele pentru XOR
X = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])

y = np.array([-1, 1, 1, -1])


def compute_y(x, W, bias):
    # Dreapta de decizie:
    # x * W[0] + y * W[1] + bias = 0
    # y = (-x * W[0] - bias) / W[1]

    return (-x * W[0] - bias) / (W[1] + 1e-10)


def plot_decision_boundary(X, y, W, b, current_x, current_y):
    x1 = -0.5
    y1 = compute_y(x1, W, b)

    x2 = 1.5
    y2 = compute_y(x2, W, b)

    plt.clf()

    color = 'r'
    if current_y == -1:
        color = 'b'

    plt.ylim((-1, 2))
    plt.xlim((-1, 2))

    # punctele din clasa -1
    plt.plot(X[y == -1, 0], X[y == -1, 1], 'b+', label='clasa -1')

    # punctele din clasa 1
    plt.plot(X[y == 1, 0], X[y == 1, 1], 'r+', label='clasa 1')

    # exemplul curent
    plt.plot(current_x[0], current_x[1], color + 's')

    # dreapta de decizie
    plt.plot([x1, x2], [y1, y2], 'black')

    # plt.legend()
    # plt.show(block=False)
    # plt.pause(0.3)


# Initializam ponderile si bias-ul
W = np.zeros(2)
b = 0

learning_rate = 0.1
num_epochs = 70


for epoch in range(num_epochs):

    # Amestecam datele la fiecare epoca
    X_shuffled, y_shuffled = shuffle(X, y, random_state=epoch)

    for i in range(len(X_shuffled)):
        current_x = X_shuffled[i]
        current_y = y_shuffled[i]

        # Predictia continua, fara sign
        y_hat = np.dot(current_x, W) + b

        # Eroarea
        error = y_hat - current_y

        # Actualizam ponderile
        W = W - learning_rate * error * current_x

        # Actualizam bias-ul
        b = b - learning_rate * error

        # Afisam dreapta de decizie
        plot_decision_boundary(X, y, W, b, current_x, current_y)


# Calculam predictiile finale
scores = np.dot(X, W) + b

predictions = np.where(scores >= 0, 1, -1)

accuracy = np.mean(predictions == y)

print("W final:", W)
print("b final:", b)
print("Scoruri finale:", scores)
print("Predictii finale:", predictions)
print("Etichete reale:", y)
print("Acuratete:", accuracy)






# 4. antrenare retea neuronala cu un strat ascuns pentru xor
# cu alg coborarii pe gradient

# Datele pentru XOR
X = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])

y = np.array([-1, 1, 1, -1])


def compute_y(x, W, bias):
    # Dreapta de decizie:
    # x * W[0] + y * W[1] + bias = 0
    # y = (-x * W[0] - bias) / W[1]

    return (-x * W[0] - bias) / (W[1] + 1e-10)


def plot_decision_boundary(X, y, W, b, current_x, current_y):
    x1 = -0.5
    y1 = compute_y(x1, W, b)

    x2 = 1.5
    y2 = compute_y(x2, W, b)

    plt.clf()

    color = 'r'
    if current_y == -1:
        color = 'b'

    plt.ylim((-1, 2))
    plt.xlim((-1, 2))

    # punctele din clasa -1
    plt.plot(X[y == -1, 0], X[y == -1, 1], 'b+', label='clasa -1')

    # punctele din clasa 1
    plt.plot(X[y == 1, 0], X[y == 1, 1], 'r+', label='clasa 1')

    # exemplul curent
    plt.plot(current_x[0], current_x[1], color + 's')

    # dreapta de decizie
    plt.plot([x1, x2], [y1, y2], 'black')

    plt.legend()
    plt.show(block=False)
    plt.pause(0.3)


# Initializam ponderile si bias-ul
W = np.zeros(2)
b = 0

learning_rate = 0.1
num_epochs = 70


for epoch in range(num_epochs):

    # Amestecam datele la fiecare epoca
    X_shuffled, y_shuffled = shuffle(X, y, random_state=epoch)

    for i in range(len(X_shuffled)):
        current_x = X_shuffled[i]
        current_y = y_shuffled[i]

        # Predictia continua, fara sign
        y_hat = np.dot(current_x, W) + b

        # Eroarea
        error = y_hat - current_y

        # Actualizam ponderile
        W = W - learning_rate * error * current_x

        # Actualizam bias-ul
        b = b - learning_rate * error

        # Afisam dreapta de decizie
        plot_decision_boundary(X, y, W, b, current_x, current_y)


# Calculam predictiile finale
scores = np.dot(X, W) + b

predictions = np.where(scores >= 0, 1, -1)

accuracy = np.mean(predictions == y)

print("W final:", W)
print("b final:", b)
print("Scoruri finale:", scores)
print("Predictii finale:", predictions)
print("Etichete reale:", y)
print("Acuratete:", accuracy)