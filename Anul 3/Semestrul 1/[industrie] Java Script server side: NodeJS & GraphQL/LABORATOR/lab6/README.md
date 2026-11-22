Aplicatii:

In `fakeDb.js` sunt exportate o serie de utilitare destinate manipularii bazei de date.

# E1

Definiti si implementati resolverul pentru un Query `user` care sa primeasca un argument de tip `int` numit `id`.
Query-ul trebuie sa returneze un `UserType` continand user-ul identificat.

# E2

Definiti si implementati resolverul pentru un Query `users` fara argumente.
Query-ul trebuie sa returneze o `List` de `UserType`

# E3

Definiti si implementati resolverul pentru o Mutatie `createUser` care sa primeasca un argument de tip `UserInput`.
Mutatia trebuie sa returneze `bool` true in cazul in care user-ul a fost creat cu succes.

# E4

Definiti si implementati resolverul pentru o Mutatie `updateUser` care sa primeasca un argument de tip `UserInput`, si unul de tip `int`.
Mutatia trebuie sa returneze `UserType` care sa corespunda modificarii efectuate.

# E5

Definiti si implementati resolverul pentru o Mutatie `deleteUser` care sa primeasca un argument de tip `int`.
Mutatia trebuie sa returneze `bool` true in cazul in care user-ul a fost sters cu succes.