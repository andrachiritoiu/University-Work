# Exercițiul 2 — Ierarhia Colaboratorilor și Interfețe

> **Pachet:** `com.pao.laboratory06.exercise2`
> **Timp estimat:** ~35 min · **Teste automate:** da (`Test.java`)

---

## Scenariul

Extindem ierarhia de la Angajat pentru a acoperi mai multe tipuri de colaboratori: angajați cu CIM, PFA și SRL. Fiecare tip are reguli diferite de calcul al venitului net anual. Vei folosi interfețe, clase abstracte, enumuri și vei implementa sortare, filtrare și sumarizare pe baza acestor date.

---

## Structura inputului

Fiecare linie de input începe cu un cuvânt-cheie care decide tipul de colaborator:
- **CIM**: `CIM Nume Prenume SalariuBrutLunar [BONUS]` (BONUS = DA/NU, opțional, default NU)
- **PFA**: `PFA Nume Prenume VenitLunar CheltuieliLunare`
- **SRL**: `SRL Nume Prenume VenitLunar CheltuieliLunare`

Toate sumele sunt lunare. Pentru calcule anuale, se înmulțesc cu 12.

---

## Cerințe generale

1. Creează o clasă abstractă `Colaborator` cu câmpuri comune (nume, prenume, venit brut lunar) și o metodă abstractă `double calculeazaVenitNetAnual()`.
2. Creează subclase pentru fiecare tip: `CIMColaborator`, `PFAColaborator`, `SRLColaborator`.
3. Creează o interfață `IOperatiiCitireScriere` cu metodele:
   - `void citeste(Scanner in)` — citește datele obiectului din input
   - `void afiseaza()` — afișează datele obiectului în formatul cerut
   - `String tipContract()` — returnează tipul contractului
   - `default boolean areBonus() { return false; }` — doar pentru CIM, dacă are bonus, venitul net anual crește cu 10%
4. Folosește un Enum `TipColaborator` pentru tipul de colaborator (CIM, PFA, SRL).
5. Ierarhia trebuie să distingă între persoane fizice (`PersoanaFizica`: CIM, PFA) și persoane juridice (`PersoanaJuridica`: SRL).

---

## Reguli de calcul venit net anual

- **CIM**: venit net anual = salariu brut lunar × 12 × 0.55; dacă are bonus, se adaugă 10% la rezultat.
- **PFA**: vezi detaliile de mai jos (toate sumele sunt anuale):
  1. venit net = (venit lunar - cheltuieli lunare) × 12
  2. impozit pe venit: 10% × venit net
  3. CASS (sănătate, 10%):
     - dacă venit net < 6 salarii minime brute/an: 10% × (6 × salariu minim brut)
     - dacă venit net între 6 și 72 salarii minime brute/an: 10% × venit net
     - dacă venit net > 72 salarii minime brute/an: 10% × (72 × salariu minim brut)
  4. CAS (pensie, 25%):
     - dacă venit net < 12 salarii minime brute/an: nu se plătește
     - dacă venit net între 12 și 24 salarii minime brute/an: 25% × (12 × salariu minim brut)
     - dacă venit net > 24 salarii minime brute/an: 25% × (24 × salariu minim brut)
  5. venit net anual = venit net - impozit - CASS - CAS
  > Pentru calcule, folosește salariul minim brut valabil în 2026 (4050 lei/lună × 12 luni = 48.600 lei/an).
- **SRL**: venit net anual = (venit lunar - cheltuieli lunare) × 12 × 0.84 (se aplică doar impozit pe profit de 16%).

---

## Cerințe suplimentare

1. Sortează colaboratorii descrescător după venit net anual.
2. Afișează colaboratorul cu venitul net anual maxim.
3. Afișează doar colaboratorii persoane juridice (SRL).
4. Pentru fiecare tip de colaborator (CIM, PFA, SRL), afișează suma veniturilor nete anuale și numărul de colaboratori de acel tip.
5. Folosește polimorfismul și enumuri pentru a implementa funcționalitățile de mai sus.

---

## Exemplu de input
```
6
CIM Popescu Ana 8000 DA
CIM Ionescu Vlad 7000 NU
PFA Georgescu Maria 12000 2000
PFA Enache Paul 4000 500
SRL SRLTech SRL 20000 8000
SRL MicroSRL SRL 5000 2000
```

## Exemplu de output
```
CIM: Popescu Ana, venit net anual: 58080.00 lei
CIM: Ionescu Vlad, venit net anual: 46200.00 lei
PFA: Georgescu Maria, venit net anual: 86400.00 lei
PFA: Enache Paul, venit net anual: 19200.00 lei
SRL: SRLTech SRL, venit net anual: 115200.00 lei
SRL: MicroSRL SRL, venit net anual: 30240.00 lei

Colaborator cu venit net maxim: SRL: SRLTech SRL, venit net anual: 115200.00 lei

Colaboratori persoane juridice:
SRL: SRLTech SRL, venit net anual: 115200.00 lei
SRL: MicroSRL SRL, venit net anual: 30240.00 lei

Sume și număr colaboratori pe tip:
CIM: suma = 104280.00 lei, număr = 2
PFA: suma = 105600.00 lei, număr = 2
SRL: suma = 145440.00 lei, număr = 2
```

> Testează și cu alte valori pentru a acoperi cazuri limită (PFA sub/ peste praguri, CIM cu/ fără bonus, etc).

---

## Cum rulezi testele

Deschide `Test.java` și apasă **Run** în IntelliJ.
Directorul de lucru trebuie să fie rădăcina proiectului (`paoj-2026/`).
