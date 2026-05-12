# Exercise 2 - Raportare stream avansata

## Scenariu

Pornind de la rezultatele din exercitiul 1, trebuie construit un modul de raportare analitica pentru tranzactii, cu agregari pe luni, conturi si canale.

## Import din exercitiul 1

Refoloseste cel putin un tip din exercitiul 1 prin import explicit (de exemplu: modelul tranzactiei sau enum-uri).

## Cerinta

Construieste rapoarte deterministe folosind Stream API:
- agregare pe luna (`REPORT_MONTH`)
- agregare pe cont (`REPORT_ACCOUNT`)
- clasament canale (`TOP_CHANNELS`)

---

## Format input (exact)

```
N
id amount date country channel accountId    (N linii)
Q
comanda                                     (Q linii)
```

Campuri pe linie de tranzactie (6 campuri, spatiu-separate):
- `id`: int unic
- `amount`: decimal cu 2 zecimale (ex: `200.00`)
- `date`: `YYYY-MM-DD`
- `country`: 2 litere uppercase (ex: `RO`)
- `channel`: string uppercase (ex: `WEB`, `ATM`, `APP`)
- `accountId`: string (ex: `A1`, `A2`)

Comenzi posibile:
- `REPORT_MONTH <yyyy-MM>`
- `REPORT_ACCOUNT <accountId>`
- `TOP_CHANNELS <k>`

### Note de parsare (pentru implementare robusta)
- Ignora liniile goale la citire (utile in testele locale editate manual).
- Separarea token-urilor se face pe spatii multiple (`split("\\s+")`).
- Pentru acest set de teste, comenzile au aritate corecta (au argumentele necesare).

---

## Format output (exact)

### REPORT_MONTH
```
MONTH <yyyy-MM> total=<suma> count=<nr>
```
- `total`: suma tuturor tranzactiilor din luna respectiva, 2 zecimale
- `count`: numarul tranzactiilor din luna respectiva
- Daca nu exista tranzactii in luna respectiva: `total=0.00 count=0`

### REPORT_ACCOUNT
```
ACCOUNT <accountId> total=<suma> count=<nr>
```
- `total`: suma tuturor tranzactiilor contului, 2 zecimale
- `count`: numarul tranzactiilor contului
- Daca nu exista tranzactii pentru cont: `total=0.00 count=0`

### TOP_CHANNELS k
- Primele `k` canale ordonate dupa numarul de tranzactii descendent.
- Tie-breaker: canal alfabetic ascendent (la egalitate de count).
- Format linie: `<channel> <count>`
- Daca `k > nr_canale_unice`: se afiseaza toate canalele.
- Daca nu exista tranzactii: `NONE`

#### Clarificari importante
- Daca `k = 0`, nu se afiseaza nicio linie (exceptie: daca nu exista deloc tranzactii, ramane regula `NONE`).
- Rezultatul trebuie sa fie determinist: aceeasi intrare produce exact aceeasi ordine.

---

## Comparator TOP_CHANNELS (tie-breakers)

Ordine:
1. count descendent
2. channel name alfabetic ascendent

Exemplu tie-break:
- count-uri: `APP=2`, `ATM=2`, `WEB=3`
- ordinea finala: `WEB 3`, apoi `APP 2`, apoi `ATM 2` (deoarece `APP < ATM` alfabetic)

---

## Comportament la lipsa datelor (quick reference)

| Comanda | Cand nu exista potriviri | Output |
|---|---|---|
| `REPORT_MONTH 2026-07` | nu exista tranzactii in luna ceruta | `MONTH 2026-07 total=0.00 count=0` |
| `REPORT_ACCOUNT A99` | contul nu are tranzactii | `ACCOUNT A99 total=0.00 count=0` |
| `TOP_CHANNELS k` | nu exista deloc tranzactii in input (`N=0`) | `NONE` |

---

## Comenzi necunoscute

- Politica folosita in checker-ul curent: comenzile necunoscute sunt ignorate (nu se afiseaza nimic).
- Recomandare pentru productie: poti afisa explicit o eroare, dar pastreaza comportamentul cerut de teste.

---

## Exemple complete

### Test 1 — REPORT_MONTH
Input:
```
4
1 200.00 2026-05-01 RO WEB A1
2 300.00 2026-05-01 RO ATM A1
3 50.00 2026-05-10 NL APP A2
4 90.00 2026-06-02 RO WEB A1
1
REPORT_MONTH 2026-05
```
Calcul: tx1, tx2, tx3 au data in 2026-05 => total=550.00, count=3

Output:
```
MONTH 2026-05 total=550.00 count=3
```

### Test 2 — TOP_CHANNELS
Input:
```
3
1 10.00 2026-05-01 RO WEB A1
2 20.00 2026-05-01 RO WEB A2
3 30.00 2026-05-01 RO ATM A3
1
TOP_CHANNELS 1
```
Calcul: WEB=2, ATM=1 => top 1 = WEB

Output:
```
WEB 2
```

### Test 3 — REPORT_ACCOUNT
Input:
```
4
1 200.00 2026-05-01 RO WEB A1
2 300.00 2026-05-01 RO ATM A1
3 50.00 2026-05-10 NL APP A2
4 90.00 2026-06-02 RO WEB A1
1
REPORT_ACCOUNT A1
```
Calcul: tx1, tx2, tx4 au accountId=A1 => total=590.00, count=3

Output:
```
ACCOUNT A1 total=590.00 count=3
```

### Test 4 — REPORT_MONTH fara tranzactii
Input:
```
2
1 200.00 2026-05-01 RO WEB A1
2 300.00 2026-05-01 RO ATM A1
1
REPORT_MONTH 2026-07
```
Output:
```
MONTH 2026-07 total=0.00 count=0
```

---

## Teorie: Stream API pentru agregare

### groupingBy + downstream collectors
```java
Map<String, DoubleSummaryStatistics> byMonth = txs.stream()
    .collect(Collectors.groupingBy(
        tx -> tx.date.substring(0, 7),           // yyyy-MM
        Collectors.summarizingDouble(tx -> tx.amount)
    ));
```

### REPORT_MONTH / REPORT_ACCOUNT
Folosind `filter` + `reduce` sau `Collectors.summingDouble`:
```java
double total = txs.stream()
    .filter(tx -> tx.date.startsWith(month))
    .mapToDouble(tx -> tx.amount)
    .sum();
long count = txs.stream()
    .filter(tx -> tx.date.startsWith(month))
    .count();
```

### TOP_CHANNELS
```java
Map<String, Long> counts = txs.stream()
    .collect(Collectors.groupingBy(tx -> tx.channel, Collectors.counting()));

counts.entrySet().stream()
    .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder())
        .thenComparing(Map.Entry.comparingByKey()))
    .limit(k)
    .forEach(e -> System.out.println(e.getKey() + " " + e.getValue()));
```

### Formatare valori monetare
Foloseste `Locale.US` pentru a evita virgula zecimala in locul punctului:
```java
System.out.printf(Locale.US, "MONTH %s total=%.2f count=%d%n", month, total, count);
```

### Separarea responsabilitatilor
- Nu combina logica de parsare cu logica de raportare.
- Tine tranzactiile intr-o `List<Tx>` si itereaza / aplica stream-uri la cerere.
- Fiecare comanda e o metoda separata.

---

## Hint-uri

- Foloseste `groupingBy` cu colectori downstream pentru agregari multi-dimensionale.
- Stabileste o ordine clara pentru ties (alfabetic ascendent la TOP_CHANNELS).
- Formateaza valorile monetare cu `%.2f` si `Locale.US`.
- Detectia lunii se poate face simplu cu `date.startsWith("yyyy-MM")`.
