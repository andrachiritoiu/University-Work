# lab6. car price => regresie liniara + ridge
import numpy as np

from sklearn.utils import shuffle
from sklearn.model_selection import KFold
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge


# load training data
# training_data = np.load('data_lab6/data/training_data.npy')
# prices = np.load('data_lab6/data/prices.npy')
# # print the first 4 samples
# print('The first 4 samples are:\n ', training_data[:4])
# print('The first 4 prices are:\n ', prices[:4])
# # shuffle
# training_data, prices = shuffle(training_data, prices, random_state=0)


# 1. normalizare date -> StandardScaler
# normalizam toate datele de train fara proces pt ca prices vrem sa prezicem
# celelate au scari foaret diferite

def normalizeaza_datele(date_antrenare, date_testare):
    scaler = StandardScaler()

    # FIT DOAR PE DATELE DE ANTRENARE
    scaler.fit(date_antrenare)   #calculeaza media coloanei si deviata standard a fiecarei coloane


    # x_normalizat = (x - media) / deviația_standard
    date_antrenare_normalizate = scaler.transform(date_antrenare)
    date_testare_normalizate = scaler.transform(date_testare)

    return date_antrenare_normalizate, date_testare_normalizate


# 2.antrenati un model de regresie liniara cu 3 folduri

# Adică trebuie să:
# 1)încărcăm datele;
# 2)amestecăm datele cu shuffle;
# 3)împărțim datele în 3 fold-uri;
# 4)pentru fiecare fold:
# luăm o parte pentru antrenare;
# luăm o parte pentru validare;
# normalizăm datele;
# antrenăm LinearRegression;
# prezicem prețurile;
# calculăm MSE și MAE;
# 5)la final facem media celor 3 valori MSE și MAE

training_data = np.load('data_lab6/data/training_data.npy')
prices = np.load('data_lab6/data/prices.npy').ravel()

# random_state = face ca daca rulezi codul de mai multe ori datele sa fie impartite la fel
training_data, prices = shuffle(training_data, prices, random_state=0)


# 3-fold cross-validation
# Avem tot datasetul de antrenare. Nu avem test separat.
#
# Atunci îl împărțim în 3 bucăți:
# Fold 1
# Fold 2
# Fold 3
#
# Apoi facem 3 runde:
#
# Runda 1:
# train = Fold 2 + Fold 3
# validare = Fold 1
#
# Runda 2:
# train = Fold 1 + Fold 3
# validare = Fold 2
#
# Runda 3:
# train = Fold 1 + Fold 2
# validare = Fold 3
#
# La final facem media rezultatelor.

kf = KFold(n_splits=3)

# pt fiecare dintre cele 3 fold uri vom obtine un MSE si MAE
mse_scores = []
mae_scores = []

for train_index, test_index in kf.split(training_data):
    X_train = training_data[train_index]
    y_train = prices[train_index]

    X_test = training_data[test_index]
    y_test = prices[test_index]

    X_train_normalizat, X_test_normalizat = normalizeaza_datele(X_train, X_test)

    model = LinearRegression()

    # aici modelul invata coeficientii w1,w2, .... si b
    model.fit(X_train_normalizat, y_train)

    # prezice preturi
    y_pred = model.predict(X_test_normalizat)

    # calculează media erorilor la pătrat
    mse = mean_squared_error(y_test, y_pred)
    # calculează media erorilor absolute
    mae = mean_absolute_error(y_test, y_pred)


    mse_scores.append(mse)
    mae_scores.append(mae)

# print("MSE pentru fiecare fold:", mse_scores)
# print("MAE pentru fiecare fold:", mae_scores)
#
# print("MSE mediu:", np.mean(mse_scores))
# print("MAE mediu:", np.mean(mae_scores))



# 3. antrenati un model de regresie ridge cu 3 cross validation
# verificare valoare alpha

# pentru fiecare alpha din [1, 10, 100, 1000]:
#     facem 3-fold cross-validation
#     antrenăm Ridge(alpha=alpha)
#     calculăm MSE și MAE pe fiecare fold
#     calculăm media MSE și media MAE
# alegem alpha-ul cu eroarea cea mai mică

# aplha = controleaza cat de puternica este penalizarea

alpha_values = [1, 10, 100, 1000]

# aici salvam rezultatele finale pentru fiecare alpha
rezultate_ridge = {}

# testam fiecare valoare alpha
for alpha in alpha_values:

    # pentru fiecare alpha, avem cate 3 valori MSE si 3 valori MAE
    mse_scores = []
    mae_scores = []

    # facem 3-fold cross-validation
    kf = KFold(n_splits=3)

    for train_index, test_index in kf.split(training_data):

        # impartim datele in train si validare
        X_train = training_data[train_index]
        y_train = prices[train_index]

        X_test = training_data[test_index]
        y_test = prices[test_index]

        # normalizam datele folosind metoda definita anterior
        X_train_normalizat, X_test_normalizat = normalizeaza_datele(X_train, X_test)

        # definim modelul Ridge cu alpha-ul curent
        model = Ridge(alpha=alpha)

        # antrenam modelul
        model.fit(X_train_normalizat, y_train)

        # prezicem preturile
        y_pred = model.predict(X_test_normalizat)

        # calculam erorile
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)

        # salvam erorile fold-ului curent
        mse_scores.append(mse)
        mae_scores.append(mae)

    # calculam media erorilor pentru alpha-ul curent
    mse_mediu = np.mean(mse_scores)
    mae_mediu = np.mean(mae_scores)

    # salvam rezultatele
    rezultate_ridge[alpha] = (mse_mediu, mae_mediu)

    # afisam rezultatul pentru alpha-ul curent
    print("Alpha:", alpha)
    print("MSE pentru fiecare fold:", mse_scores)
    print("MAE pentru fiecare fold:", mae_scores)
    print("MSE mediu:", mse_mediu)
    print("MAE mediu:", mae_mediu)
    print()

# asta caută alpha-ul pentru care MSE-ul mediu este cel mai mic
best_alpha = min(rezultate_ridge, key=lambda alpha: rezultate_ridge[alpha][0])

print("Cel mai bun alpha este:", best_alpha)
print("MSE mediu pentru best alpha:", rezultate_ridge[best_alpha][0])
print("MAE mediu pentru best alpha:", rezultate_ridge[best_alpha][1])


# 4.antrnam pe toate datele de antrenare cu cel mai bun alpha, nu doar pe folduri
# Regriesie Ridge

# 1. luăm best_alpha de la exercițiul 3
# 2. normalizăm toate datele de antrenare
# 3. antrenăm Ridge(best_alpha) pe tot training_data
# 4. afișăm coeficienții modelului
# 5. afișăm bias-ul modelului
# 6. găsim atributul cu coeficientul cel mai mare în valoare absolută
# 7. găsim al doilea cel mai important atribut
# 8. găsim atributul cel mai puțin important

# Modelul Ridge învață o formulă de forma:
    # preț = w1*x1 + w2*x2 + ... + w14*x14 + b

# w = coeficientii modelului
# x = atributele masinii

# !!!!!!!!!!!!!
# model.coef_   - îți dă coeficienții
#
# model.intercept_ - îți dă bias-ul


# din enunt
atribute = [
    "anul fabricatiei",
    "numarul de kilometri",
    "mileage",
    "motor",
    "putere",
    "numarul de locuri",
    "numarul de proprietari",
    "fuel_type_1",
    "fuel_type_2",
    "fuel_type_3",
    "fuel_type_4",
    "fuel_type_5",
    "transmisie_manual",
    "transmisie_automatic"
]

# Normalizam toata multimea de antrenare.
# Functia noastra cere doua seturi de date, asa ca trimitem training_data de doua ori.
training_data_normalizat, _ = normalizeaza_datele(training_data, training_data)

# Definim modelul Ridge cu cel mai bun alpha
ridge_model = Ridge(alpha=best_alpha)

# Antrenam modelul pe toate datele de antrenare
ridge_model.fit(training_data_normalizat, prices)

# Extragem coeficientii si bias-ul
coeficienti = ridge_model.coef_.ravel()
bias = ridge_model.intercept_

print("Best alpha:", best_alpha)
print("Coeficienti:")
print(coeficienti)

print("Bias:")
print(bias)


print("\nCoeficient pentru fiecare atribut:")
for nume_atribut, coeficient in zip(atribute, coeficienti):
    print(nume_atribut, ":", coeficient)


# Luam valoarea absoluta a coeficientilor
# pentru ca si un coeficient negativ mare este important
coeficienti_abs = np.abs(coeficienti)

# argsort returneaza indicii care ar sorta coeficientii crescator
indici_sortati = np.argsort(coeficienti_abs)

indice_cel_mai_putin_semnificativ = indici_sortati[0]
indice_al_doilea_semnificativ = indici_sortati[-2]
indice_cel_mai_semnificativ = indici_sortati[-1]

print("\nCel mai semnificativ atribut:")
print(
    atribute[indice_cel_mai_semnificativ],
    "cu coeficientul",
    coeficienti[indice_cel_mai_semnificativ]
)

print("\nAl doilea cel mai semnificativ atribut:")
print(
    atribute[indice_al_doilea_semnificativ],
    "cu coeficientul",
    coeficienti[indice_al_doilea_semnificativ]
)

print("\nCel mai putin semnificativ atribut:")
print(
    atribute[indice_cel_mai_putin_semnificativ],
    "cu coeficientul",
    coeficienti[indice_cel_mai_putin_semnificativ]
)