# Laboratory 09 — Serializare, I/O Binar și Fire de Executare

> **Pachet:** `com.pao.laboratory09` · **Cursuri:** 08 + 09
> **Data limită:** miercuri 14 mai 2026, ora 23:59

---

## Noțiuni teoretice

### Serializare Java

Serializarea transformă un obiect Java într-un șir de octeți care poate fi salvat pe disc sau transmis în rețea, și reconstituit ulterior (**deserializare**). O clasă devine serializabilă implementând interfața marker `java.io.Serializable`. Câmpul `static final long serialVersionUID` garantează compatibilitatea versiunilor. Câmpurile marcate `transient` nu participă la serializare și primesc valoarea implicită (`null` / `0`) la deserializare.

### I/O Binar și acces aleatoriu

`DataOutputStream` wrapping `FileOutputStream` permite scrierea tipurilor primitive în format binar (`writeInt`, `writeDouble`, `write(byte[])`). `RandomAccessFile` permite accesul non-secvențial: `seek(position)` mută cursorul la orice octet, fără a rescrie tot fișierul. Java folosește **big-endian** implicit; formatul Windows/x86 este **little-endian** — `ByteBuffer.order(ByteOrder.LITTLE_ENDIAN)` face conversia.

### Fire de executare (Threads)

Un fir de executare are propria stivă și execută codul `run()` concurent cu alte fire. `start()` creează stivă nouă; `run()` direct execută pe firul curent (greșeală comună). Datele partajate trebuie protejate cu `synchronized`. Câmpurile citite din mai multe fire trebuie declarate `volatile`. `wait()` / `notifyAll()` permit cooperarea (Producător–Consumator). `join()` face firul apelant să aștepte terminarea altui fir.

---

<details open>
<summary><h2>Obiective</h2></summary>

1. **Serializare** — `Serializable`, `serialVersionUID`, `transient`, `ObjectOutputStream` / `ObjectInputStream`, `try-with-resources`
2. **I/O binar cu acces aleatoriu** — `DataOutputStream`, `RandomAccessFile`, `ByteBuffer`, endianness
3. **Fire de executare** — `Thread` / `Runnable`, `synchronized`, `volatile`, `wait()` / `notifyAll()`, `join()`, Producător–Consumator

</details>

---

## Exerciții

| # | Pachet | Concept principal | Timp estimat | Teste automate |
|---|--------|-------------------|--------------|----------------|
| 1 | [`exercise1/`](exercise1/Readme.md) | Serializare tranzacții bancare — `Serializable`, `transient`, `ObjectOutputStream`, `try-with-resources` | ~45 min | ✓ (3 părți) |
| 2 | [`exercise2/`](exercise2/Readme.md) | Registru binar cu acces aleatoriu — `DataOutputStream`, `RandomAccessFile`, `ByteBuffer` little-endian | ~40 min | ✓ (flat) |
| 3 *(bonus)* | [`exercise3/`](exercise3/Readme.md) | Procesator asincron — `Thread` / `Runnable`, `synchronized`, `volatile`, `wait()` / `notifyAll()` | ~30 min | manual |

> **Total estimat:** ~1h25 min (fără bonus) · ~1h55 min (cu bonus)

---

## Cum rulezi testele automate

Deschide `exercise1/Checker.java` sau `exercise2/Checker.java` în IntelliJ și apasă **Run**.

Directorul de lucru trebuie să fie **rădăcina proiectului** (`paoj-2026/`):
`Run → Edit Configurations → Working directory → $PROJECT_DIR$`

- **exercise1** — teste organizate pe părți (`partA`, `partB`, `partC`); Checker apelează `IOTest.runParts`.
- **exercise2** — teste flat (fișiere `.in` / `.out` direct în `tests/`); Checker apelează `IOTest.runFlat`.

> **Fișiere intermediare:** exercise1 creează `output/lab09_ex1.ser`, exercise2 creează `output/lab09_ex2.bin`. Directorul `output/` există deja la rădăcina proiectului.

---

## Fișiere din acest laborator

| Fișier | Rol |
|--------|-----|
| `exercise1/Readme.md` | Cerințe exercițiu 1 |
| `exercise1/Main.java` | Implementează cerința (completează TODO-urile) |
| `exercise1/Checker.java` | Rulează testele automate pentru exercițiul 1 |
| `exercise2/Readme.md` | Cerințe exercițiu 2 |
| `exercise2/Main.java` | Implementează cerința (completează TODO-urile) |
| `exercise2/Checker.java` | Rulează testele automate pentru exercițiul 2 |
| `exercise3/Readme.md` | Cerințe exercițiu bonus |
| `exercise3/Main.java` | Demonstrație (completează conform cerințelor din Readme) |
