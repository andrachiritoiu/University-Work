# Exercițiul 2 (BONUS) — Filtrare și scriere în fișier

> **Pachet:** `com.pao.laboratory08.exercise2`
> **Timp estimat:** ~25 min · **Fără teste automate**

---

## Scop

Vei reutiliza clasele `Student` și `Adresa` din exercițiul 1 și vei adăuga funcționalitate de **scriere în fișier** folosind `BufferedWriter`. Programul citește studenții din `studenti.txt`, filtrează după un prag de vârstă citit din stdin, scrie rezultatele într-un fișier de ieșire și afișează un sumar la consolă.

---

## Import din exercițiul 1

```java
import com.pao.laboratory08.exercise1.Student;
import com.pao.laboratory08.exercise1.Adresa;
```

---

## Fișierul de date

Același ca la exercițiul 1: `src/com/pao/laboratory08/tests/studenti.txt`

---

## Protocolul de intrare (stdin)

O singură linie cu un număr întreg — pragul minim de vârstă:

```
20
```

---

## Ce faci

1. Citește studenții din `studenti.txt` cu `BufferedReader` (ca la Ex 1)
2. Citește pragul de vârstă din stdin cu `Scanner`
3. Filtrează studenții cu `varsta >= prag`
4. Scrie studenții filtrați în `rezultate.txt` (în directorul curent) folosind `BufferedWriter`
   - Fiecare student pe câte o linie, format identic cu `toString()`
5. Afișează la consolă:
   - `Filtru: varsta >= <prag>`
   - `Rezultate: <N> studenti`
   - O linie goală
   - Studenții filtrați, câte unul pe linie
   - O linie goală
   - `Scris in: rezultate.txt`

---

## Exemplu

**Input (stdin):**
```
20
```

**Output (stdout):**
```
Filtru: varsta >= 20
Rezultate: 4 studenti

Student{nume='Mihai', varsta=22, adresa=Adresa{oras='Cluj', strada='Strada Mărășești'}}
Student{nume='Elena', varsta=20, adresa=Adresa{oras='Iași', strada='Bulevardul Independenței'}}
Student{nume='Maria', varsta=23, adresa=Adresa{oras='Brașov', strada='Strada Republicii'}}
Student{nume='Andrei', varsta=21, adresa=Adresa{oras='Constanța', strada='Bulevardul Mamaia'}}

Scris in: rezultate.txt
```

**Fișierul `rezultate.txt` (creat, dar NU verificat automat):**
```
Student{nume='Mihai', varsta=22, adresa=Adresa{oras='Cluj', strada='Strada Mărășești'}}
Student{nume='Elena', varsta=20, adresa=Adresa{oras='Iași', strada='Bulevardul Independenței'}}
Student{nume='Maria', varsta=23, adresa=Adresa{oras='Brașov', strada='Strada Republicii'}}
Student{nume='Andrei', varsta=21, adresa=Adresa{oras='Constanța', strada='Bulevardul Mamaia'}}
```

---

## Indicații

- Refolosește clasele din exercițiul 1 (import)
- `BufferedWriter fout = new BufferedWriter(new FileWriter("rezultate.txt"))`
- Nu uita `fout.newLine()` sau `fout.write("\n")` după fiecare linie
- Nu uita `fout.close()` (sau folosește try-with-resources dacă ai citit secțiunea de teorie viitoare)
- Fișierul `rezultate.txt` nu este verificat automat — verifică manual conținutul

