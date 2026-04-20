# Laboratory 08 — Interfețe Marker, Clonare și Fluxuri de I/O (Introducere)

> **Pachet:** `com.pao.laboratory08`
> **Data limită:** miercuri 25 aprilie 2026, ora 23:59

---

## Sumar

| # | Pachet | Concept principal | Timp estimat | Teste automate |
|---|--------|-------------------|--------------|----------------|
| 1 | [`exercise1/`](exercise1/Readme.md) | `BufferedReader` + `Cloneable`, shallow vs. deep clone — domeniu Student | ~1h | ✓ (3 părți) |
| 2 *(bonus)* | [`exercise2/`](exercise2/Readme.md) | `BufferedWriter` / `FileWriter` — filtrare și scriere studenți în fișier | ~25 min | manual |

> **Total estimat:** ~1h (fără bonus) · ~1h25 min (cu bonus)

---

## Noțiuni teoretice

### Interfețe marker

O **interfață marker** este o interfață fără metode — rolul ei este să asocieze metadate unei clase, pe care JVM-ul le folosește la rulare:

- `java.lang.Cloneable` — permite apelul `Object.clone()`; fără ea, JVM aruncă `CloneNotSupportedException`
- `java.io.Serializable` — permite serializarea obiectelor (conversie în șir de octeți)

### Clonare superficială vs. profundă

- **Shallow cloning** — `super.clone()` copiază câmpurile primitive și referințele, dar **nu** obiectele referite. Modificarea unui câmp obiect în clonă afectează și originalul.
- **Deep cloning** — se redefinește `clone()` la fiecare nivel de referință, creând copii independente.

```java
// Deep clone:
@Override
public Object clone() throws CloneNotSupportedException {
    Student clona = (Student) super.clone();
    clona.setAdresa((Adresa) this.adresa.clone()); // copie independentă
    return clona;
}
```

### Fluxuri de I/O — Introducere

| Flux | Tip | Când să folosești |
|------|-----|-------------------|
| `FileReader` / `FileWriter` | caracter | Fișiere text mici, caracter cu caracter |
| `BufferedReader` / `BufferedWriter` | caracter + buffer | **Recomandat** — fișiere text, linie cu linie |
| `FileInputStream` / `FileOutputStream` | octet | Fișiere binare |

```java
BufferedReader fin = new BufferedReader(new FileReader("studenti.txt"));
BufferedWriter fout = new BufferedWriter(new FileWriter("rezultate.txt"));
String linie;
while ((linie = fin.readLine()) != null) {
    fout.write(linie);
    fout.newLine();
}
fin.close();
fout.close();
```

### `Serializable` *(previzualizare — obligatoriu în Lab 09)*

- Declarați `private static final long serialVersionUID` pentru compatibilitate între versiuni
- Câmpurile `transient` **nu** sunt serializate

---

## ⏭️ Ce urmează la Laboratory 09

> 📖 Teorie detaliată: [`theory1/Readme.md`](theory1/Readme.md)

- **`Serializable`** aprofundat: `serialVersionUID`, `transient`, `ObjectInputStream`/`ObjectOutputStream`
- **`DataInputStream` / `DataOutputStream`** — tipuri primitive în fișiere binare
- **`BufferedInputStream` / `BufferedOutputStream`** — buffering pentru fluxuri binare
- **`RandomAccessFile`** — acces aleatoriu, `seek()`, prelucrare imagini BMP
- **`ByteBuffer`** și endianness — big-endian ↔ little-endian
- **`try-with-resources`** — închidere automată a resurselor `AutoCloseable`

---

## Cum rulezi testele automate

Deschide `exercise1/Test.java` în IntelliJ și apasă **Run**.
Directorul de lucru trebuie să fie rădăcina proiectului (`paoj-2026/`):
`Run → Edit Configurations → Working directory → $PROJECT_DIR$`

- **exercise1**: teste pe părți (`partA`, `partB`, `partC`); citesc din `tests/studenti.txt` via `BufferedReader`, parametrii suplimentari din `stdin`
- **exercise2** (bonus): fără teste automate — verifică manual output-ul și `rezultate.txt`

---

## Fișiere din acest laborator

| Fișier | Rol |
|--------|-----|
| [tests/studenti.txt](tests/studenti.txt) | Fișier CSV partajat — citit de ambele exerciții |
| [exercise1/Readme.md](exercise1/Readme.md) | Cerința completă Ex 1 |
| [exercise1/Main.java](exercise1/Main.java) | Punct de intrare Ex 1 |
| [exercise1/Test.java](exercise1/Test.java) | Runner teste automate Ex 1 |
| [exercise2/Readme.md](exercise2/Readme.md) | Cerința completă Ex 2 (bonus) |
| [exercise2/Main.java](exercise2/Main.java) | Punct de intrare Ex 2 (bonus) |
| [theory1/Readme.md](theory1/Readme.md) | Teorie detaliată pentru Lab 09 |
