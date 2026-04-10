# Exercițiul 3 — Platforma de plăți online (CAN_DO, interfețe, sortare, SMS)

> **EXERCIȚIU BONUS:** Acest exercițiu este opțional și permite obținerea unui bonus de 0.5% la nota finală de laborator, dacă participi la cel puțin 8 exerciții. Poți atinge nota maximă chiar dacă nu se rotunjește la 50% la calculul final. Exercițiul nu are testare automată, dar este recomandat pentru aprofundare și pentru a obține bonusul.

> **Pachet:** `com.pao.laboratory06.exercise3`
> **Timp estimat:** ~45 min · **Teste automate:** nu (demonstrație în `Main.java`)

---

## Scenariul

Modelezi o platformă de plăți online pentru o bancă, cu suport pentru mai multe tipuri de utilizatori (persoane fizice și juridice) și capabilități diferite. Unii utilizatori pot plăti doar prin cont bancar, alții pot primi și confirmare prin SMS. Pentru fiecare client care are capabilitate SMS, se vor păstra și înregistra mesajele trimise, mapate la acel client. Trebuie tratate și cazurile în care un client nu are număr de telefon sau se încearcă trimiterea SMS către o entitate fără această capabilitate.

---

## Structura generală și cerințe explicite

### 1. Interfețe
- `PlataOnline` (interfață de bază):
  - `void autentificare(String user, String parola)`
  - `double consultareSold()`
  - `boolean efectuarePlata(double suma)`
- `PlataOnlineSMS` (extinde `PlataOnline`):
  - `boolean trimiteSMS(String mesaj)`
    - Returnează `false` dacă clientul nu are număr de telefon valid sau dacă mesajul este null/gol.
    - Dacă metoda este apelată pe o entitate fără capabilitate SMS, aruncă `UnsupportedOperationException`.
- `ConstanteFinanciare` (enum):
  - Enum cu valori precum `TVA`, `SALARIU_MINIM`, `COTA_IMPOZIT` (ex: `TVA(0.19)`, etc.).
  - Fiecare constantă are un getter pentru valoare.

### 2. Clase și ierarhie
- `Persoana` (abstractă):
  - Câmpuri: `String nume`, `String prenume`, `String telefon` (poate fi null sau gol)
- `Angajat` (extinde `Persoana`):
  - Câmp: `double salariu`
- `Inginer` (extinde `Angajat`, implementează `PlataOnline`, `Comparable<Inginer>`):
  - Natural order: după `nume` (alfabetic)
  - Toate metodele din `PlataOnline` trebuie implementate
- `PersoanaJuridica` (extinde `Persoana`, implementează `PlataOnlineSMS`):
  - Câmp: `List<String> smsTrimise` (inițializată goală)
  - Implementarea `trimiteSMS`: dacă `telefon` este null/gol, returnează `false` și nu adaugă mesajul; altfel, adaugă mesajul în listă și returnează `true`.
- `ComparatorInginerSalariu` (Comparator<Inginer>):
  - Sortează inginerii descrescător după salariu.

### 3. Edge cases și validare
- Pentru orice metodă care primește argumente null/gol, aruncă `IllegalArgumentException` sau returnează `false` (specifică la fiecare metodă).
- Pentru `trimiteSMS`, dacă este apelată pe o entitate fără capabilitate SMS, aruncă `UnsupportedOperationException`.
- Pentru `autentificare`, dacă user sau parola sunt null/gol, aruncă `IllegalArgumentException`.

### 4. Demonstrații obligatorii în Main.java
- Creează și sortează un array de `Inginer` (natural și cu comparatorul de salariu).
- Demonstrează accesul la un `Inginer` doar prin referința de tip `PlataOnline` (nu ai acces la metodele specifice inginerului).
- Demonstrează accesul la o `PersoanaJuridica` prin referința de tip `PlataOnlineSMS` și stocarea mesajelor trimise, inclusiv cazurile fără telefon sau cu mesaj invalid.
- Afișează cel puțin o constantă din enumul de constante financiare.
- Demonstrează tratarea cazurilor de eroare (ex: trimitere SMS fără telefon, apel pe entitate greșită, autentificare cu user null).

---

## Hints și recomandări
- Folosește `extends` între interfețe pentru a modela capabilități suplimentare (ex: SMS).
- O clasă poate implementa mai multe interfețe simultan.
- Referința de tip interfață permite acces doar la metodele acelei interfețe, indiferent de tipul concret al obiectului.
- Pentru stocarea SMS-urilor, folosește un `ArrayList<String>` în fiecare `PersoanaJuridica`.
- Pentru sortare alternativă, implementează un `Comparator` separat.
- Pentru constante, folosește obligatoriu un enum cu getter.
- Comentează codul pentru a explica deciziile de design și tratarea erorilor.

---

## Structură recomandată a pachetului
- `Persoana` (abstractă)
- `Angajat` (extinde Persoana)
- `Inginer` (extinde Angajat, implementează PlataOnline și Comparable)
- `PersoanaJuridica` (extinde Persoana, implementează PlataOnlineSMS)
- `ComparatorInginerSalariu` (criteriu alternativ de sortare)
- `PlataOnline` (interfață de bază)
- `PlataOnlineSMS` (sub-interfață cu SMS)
- `ConstanteFinanciare` (enum pentru constante)

---

> Nu este necesar un input/output fix. Demonstrează toate funcționalitățile cerute în `Main.java` cu exemple relevante și comentarii pentru fiecare caz, inclusiv edge cases.
