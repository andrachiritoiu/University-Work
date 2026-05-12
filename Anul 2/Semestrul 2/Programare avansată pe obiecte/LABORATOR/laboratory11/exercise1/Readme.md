# Exercise 1 - Motor de reguli antifrauda

## Scenariu

Construim un motor de reguli pentru tranzactii bancare. Pentru fiecare tranzactie se calculeaza un verdict (`ALLOW`/`FLAG`) si un scor de risc determinist.

## Cerinta

Implementeaza un pipeline de reguli folosind compozitie de predicate, astfel incat sa poata fi evaluate mai multe conditii fara duplicare de cod.

---

## Constante (valori exacte, obligatorii)

```
HIGH_RISK_COUNTRIES = { "RU", "NG", "IR", "KP", "SY" }

CHANNEL_SCORE:
  WEB    -> 15
  APP    -> 10
  CRYPTO -> 30
  POS    ->  5
  ATM    ->  0
  orice altul -> 0

FLAG_THRESHOLD = 60
```

---

## Calcul scor de risc (exact)

```
score = amountScore + countryScore + channelScore
```

### amountScore (treptat, integer):
| Conditie          | Punctaj |
|-------------------|---------|
| amount >= 5000    | +70     |
| amount >= 1000    | +40     |
| amount >= 500     | +20     |
| amount <= 100     | +5      |
| altfel (100–499)  | 0       |

> Treptele sunt exclusive top-down: prima conditie adevarata se aplica,
> CU EXCEPTIA `amount <= 100` care se aplica independent (nu intra in conflct cu >=500).
> Practic: amount>=5000 => +70, amount in [1000,4999] => +40, amount in [500,999] => +20,
> amount in [101,499] => 0, amount <= 100 => +5.

### countryScore:
- `+25` daca `country` ∈ `HIGH_RISK_COUNTRIES`, altfel `0`

### channelScore:
- valoarea din `CHANNEL_SCORE` pentru canalul tranzactiei, implicit `0`

---

## Verdict

```
score >= FLAG_THRESHOLD (60)  =>  FLAG
score <  FLAG_THRESHOLD       =>  ALLOW
```

> Verdictul NU se bazeaza pe predicate separate de suma/tara/canal, ci strict pe scorul total.

---

## Parti A / B / C

### Partea A — Reguli simple (CHECK)
Implementeaza fiecare regula elementara ca `Predicate<Transaction>`:
- `amountOverThreshold`: amount >= 1000
- `countryInRisk`: country ∈ HIGH_RISK_COUNTRIES
- `channelSuspicious`: channel ∈ {WEB, APP, CRYPTO}

Calculeaza scorul compus si verdictul pentru comanda `CHECK`.

### Partea B — Compozitie si LIST_FLAGGED
Compune regulile cu `.and()`, `.or()`, `.negate()` pentru a determina tranzactiile flagged.
Implementeaza comanda `LIST_FLAGGED`.

### Partea C — Sortare si TOP_RISK
Implementeaza comparatorul si comanda `TOP_RISK k`.

---

## Format input

```
N
id amount date country channel     (N linii)
Q
comanda                            (Q linii)
```

Campuri pe linie de tranzactie:
- `id`: int unic
- `amount`: decimal (ex: `1200.00`)
- `date`: `YYYY-MM-DD`
- `country`: 2 litere uppercase (ex: `RO`)
- `channel`: string uppercase (ex: `WEB`, `ATM`, `APP`, `CRYPTO`, `POS`)

Comenzi posibile:
- `CHECK <id>`
- `LIST_FLAGGED`
- `TOP_RISK <k>`
- orice altceva => `ERR UNKNOWN_COMMAND`

---

## Format output (exact)

### CHECK
```
CHECK <id> => <ALLOW|FLAG> score=<value>
CHECK <id> => NOT_FOUND              (daca id nu exista)
```

### LIST_FLAGGED
- Listeaza toate tranzactiile cu verdict `FLAG`, cate o linie, in ordinea comparatorului.
- Format linie: `[<id>] FLAG score=<value>`
- Daca nu exista nicio tranzactie flagged: `NONE`

### TOP_RISK k
- Primele `k` tranzactii (indiferent de verdict), ordonate cu comparatorul.
- Format linie: `[<id>] <ALLOW|FLAG> score=<value>`
- Daca `k = 0` sau nu sunt tranzactii: nu se afiseaza nimic.
- Daca `k > N`: se afiseaza toate N tranzactiile.

### Comenzi necunoscute
```
ERR UNKNOWN_COMMAND
```

---

## Comparator (tie-breakers deterministi)

Ordine pentru `LIST_FLAGGED` si `TOP_RISK`:
1. `score` descendent
2. `id` ascendent

---

## Exemple complete

### partA — test 1
Input:
```
3
1 1200.00 2026-05-01 RO WEB
2 90.00 2026-05-01 RU ATM
3 6000.00 2026-05-02 NG APP
3
CHECK 1
CHECK 3
CHECK 99
```
Calcul scoruri:
- tx1: amount=1200 in [1000,4999] => +40; RO nu e in risc => +0; WEB => +15; **score=55** => ALLOW
- tx2: amount=90 <= 100 => +5; RU in risc => +25; ATM => +0; **score=30** => ALLOW
- tx3: amount=6000 >= 5000 => +70; NG in risc => +25; APP => +10; **score=105** => FLAG

Output:
```
CHECK 1 => ALLOW score=55
CHECK 3 => FLAG score=105
CHECK 99 => NOT_FOUND
```

### partA — test 2
Input:
```
2
1 500.00 2026-05-01 RO POS
2 100.00 2026-05-01 KP CRYPTO
2
CHECK 1
CHECK 2
```
Calcul:
- tx1: amount=500 in [500,999] => +20; RO nu e in risc => +0; POS => +5; **score=25** => ALLOW
- tx2: amount=100 <= 100 => +5; KP in risc => +25; CRYPTO => +30; **score=60** => FLAG

Output:
```
CHECK 1 => ALLOW score=25
CHECK 2 => FLAG score=60
```

### partB — test 1
Input:
```
4
1 7000.00 2026-05-01 RU WEB
2 1500.00 2026-05-01 RO APP
3 5200.00 2026-05-02 RO CRYPTO
4 80.00 2026-05-03 KP POS
1
LIST_FLAGGED
```
Scoruri: tx1=110(FLAG), tx2=50(ALLOW), tx3=100(FLAG), tx4=35(ALLOW)

Output:
```
[1] FLAG score=110
[3] FLAG score=100
```

### partB — test 2 (LIST_FLAGGED gol)
Output:
```
NONE
```

### partC — test 1
Input:
```
5
1 1000.00 2026-05-01 RO WEB
2 1000.00 2026-05-01 RO WEB
3 5000.00 2026-05-02 RO ATM
4 500.00 2026-05-03 RU APP
5 100.00 2026-05-03 RU CRYPTO
2
TOP_RISK 3
TOP_RISK 10
```
Scoruri: tx1=55, tx2=55, tx3=70(FLAG), tx4=55, tx5=60(FLAG)
Ordine (score desc, id asc): tx3(70), tx5(60), tx1(55), tx2(55), tx4(55)

Output:
```
[3] FLAG score=70
[5] FLAG score=60
[1] ALLOW score=55
[3] FLAG score=70
[5] FLAG score=60
[1] ALLOW score=55
[2] ALLOW score=55
[4] ALLOW score=55
```

### partC — test 2 (TOP_RISK 0 + comanda invalida)
Input:
```
1
1 50.00 2026-05-01 RO ATM
2
TOP_RISK 0
BAD
```
Output:
```
ERR UNKNOWN_COMMAND
```
> `TOP_RISK 0` nu produce nicio linie; `BAD` produce `ERR UNKNOWN_COMMAND`.

---

## Teorie: pipeline de reguli cu Predicate

Un **pipeline de reguli** evalueaza o secventa de conditii (predicate) asupra unui obiect pentru a obtine un verdict sau un scor. Fiecare regula e o functie pura `Transaction -> boolean`.

### De ce Predicate<Transaction>?
Java 8+ ofera metode default `.and()`, `.or()`, `.negate()` pentru compunere:
```java
Predicate<Transaction> flaggedRule =
    amountOverThreshold.or(countryInRisk).or(channelSuspicious);
```

### Calcul scor vs. verdict prin predicate
In aceasta implementare, **verdictul deriva din scor** (`score >= 60`), nu direct din predicate compuse.
Predicatele sunt folosite pentru a verifica conditii individuale (exercitii partiale A/B) si pentru claritate,
insa decizia finala e numerica.

### Comparatorul
Definit o singura data ca constanta reutilizabila:
```java
Comparator<Transaction> BY_RISK_DESC_THEN_ID_ASC =
    Comparator.comparingInt(tx -> riskScore(tx));
// .reversed() si .thenComparingInt(tx -> tx.id)
```

### Structura recomandata
1. Parseaza N tranzactii; tine `List<Transaction>` si `Map<Integer, Transaction>` pentru lookup rapid.
2. `CHECK id` → lookup in map → calculeaza scor → afiseaza.
3. `LIST_FLAGGED` → filtreaza, sorteaza cu comparatorul, afiseaza sau "NONE".
4. `TOP_RISK k` → sorteaza toate, afiseaza primele k.
5. Comenzi necunoscute → `ERR UNKNOWN_COMMAND`.
