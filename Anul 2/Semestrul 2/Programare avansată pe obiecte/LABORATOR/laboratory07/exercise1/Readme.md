# Exercițiul 1 — Sistem simplu de tracking pentru comenzi eCommerce

> **Pachet:** `com.pao.laboratory07.exercise1`
> **Timp estimat:** ~35 min · **Teste automate:** da (`Test.java`)

---

## Scop

Acest exercițiu te familiarizează cu structura laboratorului și testarea automată. Vei implementa un sistem simplu de urmărire a comenzilor pentru un magazin online, folosind un singur fișier `Main.java` și un enum pentru stări.

---

## Cerință generală

Creează în pachetul `com.pao.laboratory07.exercise1`:
- un enum `StareComanda` cu stările posibile ale unei comenzi;
- un `Main.java` care citește comenzile de la tastatură, procesează tranzițiile și afișează rezultatele conform cerințelor.

---

## Stările comenzii

O comandă poate fi în una din următoarele stări:
- `PLACED` (the order has been placed)
- `PROCESSED` (the order is processed)
- `SHIPPED` (the order has been shipped)
- `DELIVERED` (the order has been delivered — final state)
- `CANCELED` (the order has been canceled — final state)

---

## Input și Output

- Prima linie: starea inițială (`PLACED`, `PROCESSED`, `SHIPPED`, `DELIVERED`, `CANCELED`)
- Următoarele linii: comenzi (`next`, `cancel`, `undo`) până la `QUIT`
- Pentru fiecare comandă, afișează noua stare sau un mesaj special dacă nu se poate face tranziția

---

## Partea A — Tranziții de bază

- Comenzi acceptate: `next`, `QUIT`
- Tranziții:
  - `PLACED` → `PROCESSED` → `SHIPPED` → `DELIVERED` (stare finală)
- La fiecare pas, afișează starea curentă

**Exemple:**
```
Input:           Output:
PLACED           PLACED
next             PROCESSED
next             SHIPPED
next             DELIVERED
QUIT             User quit the program.
```

---

## Partea B — Anulare și stări finale

- Comandă suplimentară: `cancel`
- Dacă primești `cancel` din orice stare non-finală, treci la `CANCELED`
- Dacă ești într-o stare finală (`DELIVERED` sau `CANCELED`), orice comandă (`next`, `cancel`) afișează: `Comanda este in stare finala.`
- Comenzile continuă să fie citite până la `QUIT`, dar sunt ignorate

- TODO daca comanda este in stare finala, orice comanda (next, cancel) afiseaza: Comanda este in stare finala.
  - Programul continua sa citeasca comenzi pana la QUIT, dar orice comanda este ignorata (afiseaza doar mesajul de stare finala)

### Indicatii programare:
  - Folositi o exceptie custom pentru anularea unei comenzi in stare finala

### **Exemplu:**
```
Input:           Output:
DELIVERED          DELIVERED
next             Comanda este in stare finala.
cancel           Comanda este in stare finala.
QUIT
```

---

## Partea C — Undo (revenire la starea anterioară)

- Comandă suplimentară: `undo`
- `undo` revine la starea anterioară (dacă există una în istoric, altfel rămâne la starea curentă)
- Dacă nu există nicio stare anterioară în istoric, afișează mesajul: `Nu există stare anterioară pentru undo.`
- `undo` funcționează și dacă starea curentă este finală (ieși din starea finală!)
- La `undo` nu se afișează mesaj de stare finală, ci doar noua stare sau mesajul de mai sus

**Exemplu:**
```
Input:           Output:
PLACED          PLACED
next             PROCESSED
next             SHIPPED
undo             PROCESSED
undo             PLACED
undo             Nu există stare anterioară pentru undo.
QUIT
```

**Exemplu cu stare finală și undo:**
```
Input:           Output:
DELIVERED        DELIVERED
undo             Nu există stare anterioară pentru undo.
QUIT
```

---

## Hints
- Folosește un enum pentru stări și metode simple pentru tranziții
- Pentru `undo`, poți folosi o listă sau un stack pentru a ține istoricul stărilor

---

## Cum rulezi testele

Deschide `Test.java` și apasă **Run** în IntelliJ.
Directorul de lucru trebuie să fie rădăcina proiectului (`paoj-2026/`).
