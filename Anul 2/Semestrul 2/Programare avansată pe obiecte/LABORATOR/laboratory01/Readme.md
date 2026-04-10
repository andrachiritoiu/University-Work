# Laboratory 01 — Primul program Java

## Ce am învățat

### 1. Metoda `main` — punctul de intrare
Orice program Java pornește de la metoda `main`. Semnătura ei este întotdeauna:
```java
public static void main(String[] args) {
    // codul tău aici
}
```
- `public` — vizibilă de oriunde (JVM-ul o apelează din exterior).
- `static` — aparține clasei, nu unui obiect (nu trebuie să creăm o instanță ca să o rulăm).
- `void` — nu returnează nimic.
- `String[] args` — argumente primite din linia de comandă (opționale).

### 2. Regula clasei `public`
Într-un fișier `.java` **poate exista o singură clasă `public`**, iar **numele fișierului trebuie să coincidă cu numele clasei**.

Exemplu: fișierul `Main.java` conține `public class Main`.

### 3. Ce este un pachet (`package`)
Pachetele organizează clasele în foldere logice, ca un sistem de directoare.

```java
package com.pao.laboratory01;
```

- `com.pao` — domeniul proiectului (inversul unui domeniu web, prin convenție).
- `laboratory01` — numele laboratorului.
- Toate fișierele din acest folder **trebuie** să aibă aceeași declarație `package` pe prima linie.
- Când vrei să folosești o clasă din alt pachet, o imporți cu `import`.

### 4. `Scanner` — citire de la tastatură
```java
Scanner scanner = new Scanner(System.in);
int n = scanner.nextInt();   // citește un număr întreg
```
- `Scanner` vine din `java.util.Scanner` — trebuie importat.
- `nextInt()` citește un `int`, `nextDouble()` citește un `double`, `nextLine()` citește un șir.

### 5. Array-uri — declarare și parcurgere
```java
int[] array = new int[n];          // declarare cu dimensiune n

for (int i = 0; i < n; i++) { }   // parcurgere clasică (cu index)
for (int num : array) { }         // enhanced for (fără index)
```

---

## Fișiere din acest laborator

| Fișier | Rol | Deschide |
|--------|-----|----------|
| [Main.java](Main.java) | **Demo** — exemplu rezolvat de profesor: citire array + afișare în 2 moduri | ⬅ Citește codul și comentariile |
| [MediaAritmetica.java](MediaAritmetica.java) | **Exercițiul 1** — de rezolvat de student | ⬅ Scrie codul aici |
| [DiagonaleleMatricei.java](DiagonaleleMatricei.java) | **Exercițiul 2** — de rezolvat de student | ⬅ Scrie codul aici |

---

## Exercițiul 1 — Media aritmetică
📄 **Fișier:** [MediaAritmetica.java](MediaAritmetica.java)

> Citiți de la tastatură un șir cu **n** elemente întregi.
> 1. Afișați elementele șirului în **două modalități** (cu index și cu enhanced for).
> 2. Afișați **media aritmetică** a elementelor șirului.

**Indicii:**
- Uită-te în `Main.java` la cum se citește un array — fă la fel.
- Media aritmetică = suma elementelor / numărul de elemente.
- Atenție: `int / int` dă rezultat `int` în Java. Folosește un cast: `(double) suma / n`.

---

## Exercițiul 2 — Diagonalele matricei
📄 **Fișier:** [DiagonaleleMatricei.java](DiagonaleleMatricei.java)

> Citiți de la tastatură o matrice de **n × n** elemente **REALE** (`double`).
> 1. Afișați matricea în consolă.
> 2. Afișați **suma** elementelor de pe diagonala principală.
> 3. Afișați **produsul** elementelor de pe diagonala secundară.

**Indicii:**
- Matricea se declară: `double[][] mat = new double[n][n];`
- Citire cu două for-uri imbricate.
- Diagonala principală: elementele unde `i == j`.
- Diagonala secundară: elementele unde `i + j == n - 1`.
- Inițializează produsul cu `1.0`, nu cu `0`.

---

## Cum rulez?
1. Deschide fișierul exercițiului (ex: `MediaAritmetica.java`).
2. Click dreapta pe metoda `main` → **Run**.
3. Scrie valorile în consola din IntelliJ (jos) și apasă Enter.

---

## Recapitulare rapidă

| Concept | Ce trebuie să rețin |
|---------|---------------------|
| `main` | Punct de intrare — semnătura fixă, una per clasă |
| `public class` | Numele clasei = numele fișierului, max 1 per fișier |
| `package` | Prima linie din fișier, reflectă structura de foldere |
| `Scanner` | Import din `java.util`, citește cu `nextInt()` / `nextDouble()` / `nextLine()` |
| Array | Dimensiune fixă, parcurgere cu index sau enhanced for |

