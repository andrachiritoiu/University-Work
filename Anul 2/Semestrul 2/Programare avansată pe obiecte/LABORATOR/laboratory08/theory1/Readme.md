# Teorie avansată I/O pentru Laboratory 09

> **Scop:** Această secțiune oferă teoria detaliată pentru exercițiul bonus din Lab 08 și pregătește terenul pentru Laboratory 09.
> 
> Dacă nu ai timp să rezolvi exercițiul bonus acum, citește totuși această teorie — vei avea nevoie de ea săptămâna viitoare.

---

## Interfața `Serializable` — serializarea obiectelor

### Ce este serializarea?

**Serializarea** este procesul de conversie a unui obiect Java într-un flux de octeți (byte stream), care poate fi salvat într-un fișier binar sau transmis prin rețea. **Deserializarea** este procesul invers — reconstruirea obiectului din fluxul de octeți.

### Interfața marker `java.io.Serializable`

Pentru ca o clasă să poată fi serializată, trebuie să implementeze interfața marker `Serializable`:

```java
import java.io.Serializable;

public class Student implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nume;
    private int varsta;
    private transient String parola; // NU va fi serializat
    
    // constructor, getteri, setteri
}
```

### Câmpul `serialVersionUID`

Este un identificator de versiune al clasei. JVM-ul îl folosește pentru a verifica dacă obiectul deserializat este compatibil cu versiunea actuală a clasei.

- Dacă lipseşte, JVM-ul îl generează automat (poate fi instabil între compilări)
- **Best practice:** declară-l întotdeauna explicit:

```java
private static final long serialVersionUID = 1L;
```

Când modifici structura clasei (adaugi/ștergi câmpuri), incrementează valoarea pentru a indica incompatibilitate.

### Câmpuri `transient`

Marchează câmpurile care **nu** trebuie serializate:

```java
private transient String parola;           // date sensibile
private transient Socket conexiune;        // resurse care nu pot fi serializate
private transient int counterTemporar;     // date temporare
```

La deserializare, câmpurile `transient` primesc valori implicite (`null`, `0`, `false`).

---

## Scriere și citire obiecte serializate

### `ObjectOutputStream` — scriere

```java
try (FileOutputStream fout = new FileOutputStream("studenti.ser");
     ObjectOutputStream out = new ObjectOutputStream(fout)) {
    
    Student s = new Student("Ana", 20);
    out.writeObject(s);  // serializează obiectul
    
} catch (IOException e) {
    e.printStackTrace();
}
```

### `ObjectInputStream` — citire

```java
try (FileInputStream fin = new FileInputStream("studenti.ser");
     ObjectInputStream in = new ObjectInputStream(fin)) {
    
    Student s = (Student) in.readObject();  // deserializează
    System.out.println(s.getNume());        // "Ana"
    
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

### Serializarea agregării/compoziției

Dacă clasa `Student` conține un câmp `Adresa`, atunci și `Adresa` trebuie să fie `Serializable`:

```java
public class Adresa implements Serializable {
    private static final long serialVersionUID = 1L;
    private String oras;
    private String strada;
}

public class Student implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nume;
    private Adresa adresa;  // OK — Adresa e Serializable
}
```

Dacă `Adresa` nu este `Serializable`, se aruncă `NotSerializableException` la runtime.

---

## `DataInputStream` / `DataOutputStream` — citire/scriere date primitive

Acestea permit citirea/scrierea **formatată** a tipurilor primitive (`int`, `double`, `String`) din/în fișiere binare, fără a serializa obiecte întregi.

### Scriere

```java
try (DataOutputStream out = new DataOutputStream(
        new FileOutputStream("date.bin"))) {
    
    out.writeInt(42);
    out.writeDouble(3.14);
    out.writeUTF("Ana");      // String în format UTF-8
    out.writeBoolean(true);
    
} catch (IOException e) {
    e.printStackTrace();
}
```

### Citire

**⚠️ Important:** Trebuie să citești **în aceeași ordine** în care ai scris!

```java
try (DataInputStream in = new DataInputStream(
        new FileInputStream("date.bin"))) {
    
    int nr = in.readInt();         // 42
    double d = in.readDouble();    // 3.14
    String nume = in.readUTF();    // "Ana"
    boolean b = in.readBoolean();  // true
    
} catch (IOException e) {
    e.printStackTrace();
}
```

### Metode disponibile

| Tip | Scriere | Citire |
|-----|---------|--------|
| `int` | `writeInt(int v)` | `int readInt()` |
| `long` | `writeLong(long v)` | `long readLong()` |
| `double` | `writeDouble(double v)` | `double readDouble()` |
| `float` | `writeFloat(float v)` | `float readFloat()` |
| `boolean` | `writeBoolean(boolean v)` | `boolean readBoolean()` |
| `char` | `writeChar(int v)` | `char readChar()` |
| `String` | `writeUTF(String s)` | `String readUTF()` |

---

## `BufferedInputStream` / `BufferedOutputStream` — buffering pentru octeți

Similar cu `BufferedReader`/`BufferedWriter`, dar pentru fluxuri de octeți (nu caractere).

```java
// Scriere cu buffer — mult mai rapid decât FileOutputStream direct
try (BufferedOutputStream out = new BufferedOutputStream(
        new FileOutputStream("mare.bin"))) {
    
    for (int i = 0; i < 1_000_000; i++) {
        out.write(i % 256);  // se scriu în buffer, nu direct pe disc
    }
    
} // flush automat la închidere

// Citire cu buffer
try (BufferedInputStream in = new BufferedInputStream(
        new FileInputStream("mare.bin"))) {
    
    int b;
    while ((b = in.read()) != -1) {
        // procesează octetul
    }
}
```

**Când să folosești:**
- Fișiere binare mari
- Multe operații mici de citire/scriere
- Performanță critică

---

## `RandomAccessFile` — acces aleatoriu

Permite citirea și scrierea **la orice poziție** dintr-un fișier, nu doar secvențial.

### Deschidere

```java
// "r" — doar citire
// "rw" — citire și scriere
RandomAccessFile raf = new RandomAccessFile("date.bin", "rw");
```

### Cursor (`file pointer`)

Fișierul e privit ca un tablou de octeți. Cursorul indică poziția curentă (indexul octetului).

```java
long pos = raf.getFilePointer();  // poziția curentă (0 la început)
raf.seek(100);                     // mută cursorul la octetul 100
raf.skipBytes(20);                 // sare peste 20 de octeți
```

### Citire/scriere

`RandomAccessFile` implementează `DataInput` și `DataOutput`, deci are toate metodele `read*()` și `write*()`:

```java
RandomAccessFile raf = new RandomAccessFile("student.bin", "rw");

// Scriere la poziția 0
raf.writeUTF("Ana");
raf.writeInt(20);

// Citire de la început
raf.seek(0);
String nume = raf.readUTF();
int varsta = raf.readInt();

raf.close();
```

### Exemplu practic — imagine BMP

Lățimea unei imagini BMP este stocată pe 4 octeți, începând cu octetul 18:

```java
RandomAccessFile img = new RandomAccessFile("photo.bmp", "r");
img.seek(18);                    // mută cursorul la octetul 18
int width = img.readInt();       // citește lățimea (4 octeți)
width = Integer.reverseBytes(width);  // BMP e little-endian
System.out.println("Lățime: " + width + " pixeli");
img.close();
```

---

## `ByteBuffer` și endianness

### Big-endian vs. little-endian

Când un număr întreg (`int` = 4 octeți) este scris într-un fișier binar, ordinea octeților poate varia:

| Valoare | Big-endian (Java implicit) | Little-endian (Windows, BMP) |
|---------|----------------------------|------------------------------|
| `720` (decimal) | `00 00 02 D0` | `D0 02 00 00` |

**Java scrie/citește implicit în big-endian.** Fișierele Windows (BMP, executabile) folosesc little-endian.

### `ByteBuffer` — conversie

```java
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

RandomAccessFile raf = new RandomAccessFile("date.bin", "r");
byte[] bytes = new byte[4];
raf.read(bytes);  // citește 4 octeți

// Convertește la int little-endian
ByteBuffer buffer = ByteBuffer.wrap(bytes);
buffer.order(ByteOrder.LITTLE_ENDIAN);
int value = buffer.getInt();

System.out.println(value);
raf.close();
```

### Alternativă — `Integer.reverseBytes()`

Pentru `int`, `short`, `long`:

```java
int valueBigEndian = raf.readInt();
int valueLittleEndian = Integer.reverseBytes(valueBigEndian);
```

---

## `try-with-resources` — gestionare automată resurse

Introdus în **Java 7**, elimină nevoia de bloc `finally` pentru închiderea resurselor.

### Sintaxă veche (fără try-with-resources)

```java
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("date.txt"));
    String linie = br.readLine();
    // procesare
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (br != null) {
        try {
            br.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### Sintaxă nouă (try-with-resources)

```java
try (BufferedReader br = new BufferedReader(new FileReader("date.txt"))) {
    String linie = br.readLine();
    // procesare
} catch (IOException e) {
    e.printStackTrace();
}
// br.close() e apelat AUTOMAT
```

### Multiple resurse

```java
try (BufferedReader in = new BufferedReader(new FileReader("input.txt"));
     BufferedWriter out = new BufferedWriter(new FileWriter("output.txt"))) {
    
    String linie;
    while ((linie = in.readLine()) != null) {
        out.write(linie.toUpperCase());
        out.newLine();
    }
    
} // ambele se închid automat, în ordine inversă (out, apoi in)
```

### Condiția — interfața `AutoCloseable`

Orice clasă care implementează `AutoCloseable` (sau `Closeable`, care extinde `AutoCloseable`) poate fi folosită:

- `BufferedReader`, `BufferedWriter`
- `FileReader`, `FileWriter`
- `FileInputStream`, `FileOutputStream`
- `RandomAccessFile`
- `ObjectInputStream`, `ObjectOutputStream`
- `DataInputStream`, `DataOutputStream`

---

## Comparație — când folosești fiecare flux

| Flux | Scop | Exemplu de utilizare |
|------|------|---------------------|
| `FileReader` / `FileWriter` | Fișiere text mici, caracter cu caracter | Log-uri simple |
| `BufferedReader` / `BufferedWriter` | Fișiere text, linie cu linie (recomandat) | CSV, configurări, output procesare |
| `FileInputStream` / `FileOutputStream` | Fișiere binare, octet cu octet | Copiere fișiere |
| `BufferedInputStream` / `BufferedOutputStream` | Fișiere binare mari, performanță | Imagini, video, arhive |
| `DataInputStream` / `DataOutputStream` | Date primitive formatate în binar | Structuri de date custom |
| `ObjectInputStream` / `ObjectOutputStream` | Obiecte Java complete | Salvare stare aplicație, cache |
| `RandomAccessFile` | Acces la poziții specifice | BMP headers, baze de date simple |

---

## Ce vei face în Laboratory 09

1. **Exercițiu obligatoriu:** Serializare completă cu `Serializable`, `serialVersionUID`, `transient`
2. **Citire/scriere formatată:** `DataInputStream`/`DataOutputStream` pentru structuri custom
3. **Acces aleatoriu:** `RandomAccessFile` pentru prelucrare imagini BMP sau header-e fișiere
4. **Buffer pentru performanță:** Comparație viteză cu/fără `BufferedInputStream`
5. **`try-with-resources`:** Refactorizare cod vechi cu sintaxa modernă

---

## Resurse suplimentare

- **Oracle Java Tutorials — I/O:** https://docs.oracle.com/javase/tutorial/essential/io/
- **Serialization Guide:** https://docs.oracle.com/javase/8/docs/technotes/guides/serialization/
- **RandomAccessFile JavaDoc:** https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/RandomAccessFile.html

