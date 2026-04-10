# Laboratory 03 — Moștenire, Clase abstracte, Interfețe, Colecții

## Demo-uri (citește și rulează)

| Pachet | Ce demonstrează |
|--------|-----------------|
| [abstractclasses/](src/com/pao/laboratory03/abstractclasses) | Clasă abstractă, moștenire, polimorfism, upcasting |
| [equalshashcode/](src/com/pao/laboratory03/equalshashcode) | `==` vs `.equals()`, `hashCode`, comportament `HashSet` |
| [immutable/](src/com/pao/laboratory03/immutable) | Clasă imutabilă: `final class`, `final` fields, fără setteri |
| [strings/](src/com/pao/laboratory03/strings) | `String` vs `StringBuilder` vs `StringBuffer` + benchmark |
| [collections/](src/com/pao/laboratory03/collections) | `ArrayList`, `HashSet`, `TreeSet` — operații și parcurgere |

---

## Exerciții

| # | Exercițiu | Timp estimat | Fișiere de completat |
|---|-----------|--------------|----------------------|
| 1 | Forme geometrice | ~20 min | [Circle.java](src/com/pao/laboratory03/exercise1/Circle.java), [Rectangle.java](src/com/pao/laboratory03/exercise1/Rectangle.java) |
| 2 | equals/hashCode Student | ~15 min | [Student.java](src/com/pao/laboratory03/exercise2/Student.java) |
| 3 | Angajați + ArrayList | ~25 min | [Programator.java](src/com/pao/laboratory03/exercise3/model/Programator.java), [Manager.java](src/com/pao/laboratory03/exercise3/model/Manager.java), [AngajatService.java](src/com/pao/laboratory03/exercise3/service/AngajatService.java) |
| 4 | Zoo (bonus) | ~30 min | [Dog.java](src/com/pao/laboratory03/exercise4/model/Dog.java), [Cat.java](src/com/pao/laboratory03/exercise4/model/Cat.java), [Parrot.java](src/com/pao/laboratory03/exercise4/model/Parrot.java), [ZooService.java](src/com/pao/laboratory03/exercise4/service/ZooService.java) |

---

### Exercițiul 1 — Forme geometrice

Implementează `Circle` și `Rectangle` care extind `Shape`.

**Fișiere:** [Circle.java](src/com/pao/laboratory03/exercise1/Circle.java), [Rectangle.java](src/com/pao/laboratory03/exercise1/Rectangle.java)  
**Model:** [Shape.java](src/com/pao/laboratory03/exercise1/Shape.java) (dat)  
**Test:** [Main.java](src/com/pao/laboratory03/exercise1/Main.java) (nu modifica)

<details>
<summary><b>Output așteptat</b></summary>

```
=== Forme geometrice ===
Circle [area=78.54, perimeter=31.42]
Rectangle [area=24.00, perimeter=20.00]
Circle [area=12.57, perimeter=12.57]
Rectangle [area=25.00, perimeter=20.00]

=== Polimorfism — aceeași metodă, comportament diferit ===
Circle     → aria = 78.54
Rectangle  → aria = 24.00
Circle     → aria = 12.57
Rectangle  → aria = 25.00

=== Suma ariilor tuturor formelor ===
Total arii: 140.10
```

</details>

---

### Exercițiul 2 — equals/hashCode Student

Adaugă `equals(Object o)` și `hashCode()` în `Student` — doi studenți sunt egali dacă au **același id**.

**Fișier:** [Student.java](src/com/pao/laboratory03/exercise2/Student.java)  
**Model:** [Book.java](src/com/pao/laboratory03/equalshashcode/Book.java) (dat)  
**Test:** [Main.java](src/com/pao/laboratory03/exercise2/Main.java) (nu modifica)

<details>
<summary><b>Output așteptat</b></summary>

```
=== VERIFICARE ===
Test 1 (equals):   PASSED ✓
Test 2 (hashCode):  PASSED ✓
Test 3 (HashSet):   PASSED ✓
```

</details>

---

### Exercițiul 3 — Angajați + ArrayList

Implementează `Programator` și `Manager` (extind `Angajat`) + completează `AngajatService`.

**Fișiere:** [Programator.java](src/com/pao/laboratory03/exercise3/model/Programator.java), [Manager.java](src/com/pao/laboratory03/exercise3/model/Manager.java), [AngajatService.java](src/com/pao/laboratory03/exercise3/service/AngajatService.java)  
**Model:** [Angajat.java](src/com/pao/laboratory03/exercise3/model/Angajat.java) (dat)  
**Test:** [Main.java](src/com/pao/laboratory03/exercise3/Main.java) (nu modifica)

**Formule:**
- `Programator.salariuTotal()` = `getSalariuBaza() * 1.5`
- `Manager.salariuTotal()` = `getSalariuBaza() * 2 + nrSubordonati * 100`

<details>
<summary><b>Output așteptat</b></summary>

```
=== Adăugare angajați ===
Angajat adăugat: Ana
Angajat adăugat: Mihai
Angajat adăugat: Ion
Angajat adăugat: Elena

=== Lista angajaților ===
1. Programator{name='Ana', salariuBaza=5000.0, salariuTotal=7500.00}
2. Programator{name='Mihai', salariuBaza=4500.0, salariuTotal=6750.00}
3. Manager{name='Ion', salariuBaza=6000.0, salariuTotal=13000.00}
4. Manager{name='Elena', salariuBaza=7000.0, salariuTotal=14500.00}

=== Total salarii ===
Suma salariilor: 41750.00 RON

=== VERIFICARE ===
Test 1 (Programator): PASSED ✓
Test 2 (Manager):     PASSED ✓
Test 3 (Total):       PASSED ✓
```

</details>

---

### Exercițiul 4 — Grădina Zoologică (bonus)

Implementează `Dog`, `Cat`, `Parrot` (extind `Animal`) + completează `ZooService` (Singleton cu 4 metode).

**Fișiere:** [Dog.java](src/com/pao/laboratory03/exercise4/model/Dog.java), [Cat.java](src/com/pao/laboratory03/exercise4/model/Cat.java), [Parrot.java](src/com/pao/laboratory03/exercise4/model/Parrot.java), [ZooService.java](src/com/pao/laboratory03/exercise4/service/ZooService.java)  
**Model:** [Animal.java](src/com/pao/laboratory03/exercise4/model/Animal.java), [Describable.java](src/com/pao/laboratory03/exercise4/model/Describable.java) (date)  
**Test:** [Main.java](src/com/pao/laboratory03/exercise4/Main.java) — meniu interactiv (nu modifica)

<details>
<summary><b>Exemplu interacțiune</b></summary>

```
Alege opțiunea: 2
Nume: Rex
Vârsta: 5
Adăugat: Dog{name='Rex', age=5}

Alege opțiunea: 1
  1. Rex (varsta: 5 ani) face: Ham!
```

</details>

---

<details open>
<summary><h2>Cheat Sheet</h2></summary>

| Concept | Reține |
|---------|--------|
| `abstract class` | Nu se instanțiază; metode abstracte + concrete |
| `interface` | Contract pur; o clasă poate implementa mai multe |
| `extends` + `super` | Moștenire de la 1 clasă; `super(args)` = constructor părinte |
| `@Override` | Subclasa redefinește comportamentul |
| Polimorfism | Variabilă tip-părinte → comportament tip-real |
| `equals`/`hashCode` | Suprascrie ambele; obligatoriu pt `HashSet`/`HashMap` |
| Clasă imutabilă | `final class`, `final` fields, fără setteri |
| `StringBuilder` | Folosește-l pt concatenări repetate |
| `ArrayList` | Listă dinamică cu index — înlocuiește array-uri |
| `HashSet` | Fără duplicate — necesită `equals`/`hashCode` |
| `TreeSet` | Fără duplicate + sortat automat |

</details>

---

## Ce urmează la Laboratory 04?
- `Map` (`HashMap`, `TreeMap`)
- `Comparable` cu `Collections.sort`
- Enum-uri
- Introducere excepții


## FAQ (Întrebări Frecvente)

<details>
<summary><b>1. Ce este <code>super</code>? Când poate fi folosit?</b></summary>

`super` este un keyword folosit pentru a accesa membri (constructor, metode, câmpuri) din clasa părinte. Are trei utilizări principale:

**a) Apelarea constructorului părinte** — `super(args)` **trebuie să fie prima instrucțiune** în constructor:
```java
// Exemplu din Circle.java
public Circle(double radius) {
    super("Circle");  // apelează Shape(String name)
    this.radius = radius;
}
```

Alte exemple din laborator:
- [MySqlConnection.java](src/com/pao/laboratory03/abstractclasses/MySqlConnection.java) — `super(url)` pentru [DBConnection](src/com/pao/laboratory03/abstractclasses/DBConnection.java)
- [Programator.java](src/com/pao/laboratory03/exercise3/model/Programator.java) — `super(name, salariuBaza)` pentru [Angajat](src/com/pao/laboratory03/exercise3/model/Angajat.java)
- [Manager.java](src/com/pao/laboratory03/exercise3/model/Manager.java) — `super(name, salariuBaza)` pentru [Angajat](src/com/pao/laboratory03/exercise3/model/Angajat.java)
- [Dog.java](src/com/pao/laboratory03/exercise4/model/Dog.java), [Cat.java](src/com/pao/laboratory03/exercise4/model/Cat.java), [Parrot.java](src/com/pao/laboratory03/exercise4/model/Parrot.java) — `super(name, age)` pentru [Animal](src/com/pao/laboratory03/exercise4/model/Animal.java)

**b) Apelarea unei metode din părinte** — când vrei să extinzi (nu să înlocuiești) comportamentul:
```java
@Override
public void someMethod() {
    super.someMethod();  // comportament părinte
    // + comportament suplimentar
}
```

**c) Accesarea unui câmp din părinte** — `super.field` (rar necesar, de obicei folosești getteri):
```java
String parentName = super.name;  // dacă subclasa are și ea un câmp 'name'
```

**Regulă de aur:** Dacă subclasa are constructor, **trebuie** să apelezi `super(...)` sau `this(...)` (implicit Java adaugă `super()` dacă nu specifici nimic, dar constructorul fără parametri trebuie să existe în părinte).

</details>

<details>
<summary><b>2. Care este diferența între clasă abstractă și interfață?</b></summary>

| | Clasă abstractă | Interfață |
|---|----------------|-----------|
| **Instanțiere** | ❌ Nu se instanțiază direct | ❌ Nu se instanțiază direct |
| **Metode abstracte** | ✅ Da (fără corp) | ✅ Da (implicit abstract) |
| **Metode concrete** | ✅ Da (cu implementare) | ✅ Da (din Java 8: `default`, `static`) |
| **Câmpuri** | ✅ Orice tip (instance, static) | ⚠️ Doar `public static final` (constante) |
| **Constructor** | ✅ Da (apelat cu `super`) | ❌ Nu |
| **Moștenire** | 🔢 1 singură clasă (`extends`) | ♾️ Multiple (`implements`) |
| **Când folosești** | Relație **IS-A** cu cod comun | Contract / capabilitate (**CAN-DO**) |

**Exemplu din laborator:**
- Clasă abstractă: [Angajat](src/com/pao/laboratory03/exercise3/model/Angajat.java) — cod comun + metodă abstractă `salariuTotal()`
- Interfață: [Describable](src/com/pao/laboratory03/exercise4/model/Describable.java) — contract simplu `String describe()`

**Caz special:** [Animal](src/com/pao/laboratory03/exercise4/model/Animal.java) este clasă abstractă care **implementează** interfața `Describable` → combină ambele concepte.

</details>

<details>
<summary><b>3. Când și de ce folosesc <code>@Override</code>?</b></summary>

`@Override` este o **adnotare opțională** dar **recomandată** care marchează că metoda suprascrie o metodă din părinte sau interfață. Beneficii:

1. **Detectează erori la compilare** — dacă greșești semnătura (nume, parametri, tip returnat), compilatorul semnalează eroarea
2. **Documentare** — arată clar intenția că metoda nu este nouă, ci suprascrie comportamentul
3. **Refactorizări sigure** — dacă metoda din părinte se schimbă, primești eroare de compilare

**Exemplu:**
```java
@Override
public double area() {  // suprascrie Shape.area()
    return Math.PI * radius * radius;
}
```

Găsești `@Override` în toate exercițiile: [Circle.java](src/com/pao/laboratory03/exercise1/Circle.java), [Rectangle.java](src/com/pao/laboratory03/exercise1/Rectangle.java), [Book.java](src/com/pao/laboratory03/equalshashcode/Book.java), [Dog.java](src/com/pao/laboratory03/exercise4/model/Dog.java), etc.

**Regulă:** Folosește **întotdeauna** `@Override` când suprascrii `toString()`, `equals()`, `hashCode()`, sau orice metodă din părinte/interfață.

</details>

<details>
<summary><b>4. De ce trebuie să suprascriu <code>equals()</code> ȘI <code>hashCode()</code> împreună?</b></summary>

**Contract Java:** Dacă `a.equals(b) == true`, atunci **obligatoriu** `a.hashCode() == b.hashCode()`.

**Consecințe dacă nu respecți contractul:**
- `HashSet` / `HashMap` nu vor funcționa corect — duplicate "invizibile", căutări eșuate
- Obiecte considerate egale de `equals()` ajung în bucket-uri diferite

**Exemplu din [Book.java](src/com/pao/laboratory03/equalshashcode/Book.java):**
```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Book book = (Book) o;
    return Objects.equals(name, book.name);  // egalitate pe 'name'
}

@Override
public int hashCode() {
    return Objects.hash(name);  // ACELAȘI câmp ca în equals
}
```

**Regulă de aur:** Folosește **aceleași câmpuri** în ambele metode. IntelliJ poate genera automat (`Alt+Insert` → `equals() and hashCode()`).

Vezi demo în [equalshashcode/Main.java](src/com/pao/laboratory03/equalshashcode/Main.java) — ce se întâmplă cu `HashSet` când override-ul lipsește.

</details>

<details>
<summary><b>5. Care este diferența între <code>==</code> și <code>.equals()</code>?</b></summary>

| Operator | Ce compară | Exemplu |
|----------|------------|---------|
| `==` | **Referințe în memorie** | `book1 == book2` → `true` doar dacă sunt **exact același obiect** |
| `.equals()` | **Conținut logic** | `book1.equals(book2)` → `true` dacă au **aceleași valori** (după criteriul din `equals()`) |

**Demo din [equalshashcode/Main.java](src/com/pao/laboratory03/equalshashcode/Main.java):**
```java
Book book1 = new Book("Java", 500);
Book book2 = new Book("Java", 300);
Book book3 = book1;

book1 == book2  // false (obiecte diferite în memorie)
book1 == book3  // true  (aceeași referință)
book1.equals(book2)  // true (același name → vezi Book.equals)
```

**Reguli:**
- Pentru **primitive** (`int`, `double`) → folosește doar `==`
- Pentru **obiecte** → folosește `.equals()` pentru compararea conținutului
- **Excepție:** `String` se poate compara cu `==` doar pentru literale identice (evită!)

</details>

<details>
<summary><b>6. Ce înseamnă că o clasă este imutabilă? De ce este utilă?</b></summary>

O clasă **imutabilă** = obiectele create **nu se mai pot modifica** după instanțiere.

**Reguli pentru a crea o clasă imutabilă** (vezi [ImmutableDog.java](src/com/pao/laboratory03/immutable/ImmutableDog.java)):
1. Declară clasa `final` — previne extinderea (subclasele ar putea adăuga mutabilitate)
2. Toate câmpurile `private final`
3. **Fără setteri** — doar getteri
4. Inițializare doar prin constructor
5. Dacă ai câmpuri **mutable** (liste, date) → returnează **copii defensive** în getteri

```java
public final class ImmutableDog {
    private final String name;
    private final int age;
    
    public ImmutableDog(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() { return name; }  // doar getteri, fără setteri
    public int getAge() { return age; }
}
```

**Beneficii:**
- ✅ **Thread-safe** — folosit în aplicații concurente fără sincronizare
- ✅ **Sigur** — nu se modifică accidental
- ✅ **HashSet/HashMap key** — hash-ul rămâne constant

**Exemple din Java:** `String`, `Integer`, `LocalDate`, `BigDecimal` — toate sunt imutabile!

</details>

<details>
<summary><b>7. Când folosesc <code>ArrayList</code> vs <code>HashSet</code> vs <code>TreeSet</code>?</b></summary>

| Colecție | Caracteristici | Când folosești |
|----------|---------------|----------------|
| **ArrayList** | • Ordine de inserare<br>• Permite duplicate<br>• Acces prin index `get(i)`<br>• Performanță: O(1) acces, O(n) căutare | Liste cu ordine importantă, acces frecvent la poziții specifice |
| **HashSet** | • Ordine imprevizibilă<br>• **Fără duplicate**<br>• Necesită `equals`/`hashCode`<br>• Performanță: O(1) add/contains | Verificare rapidă apartenență, eliminare duplicate |
| **TreeSet** | • **Sortat automat** (alfabetic, numeric)<br>• Fără duplicate<br>• Necesită `Comparable` sau `Comparator`<br>• Performanță: O(log n) | Când ai nevoie de colecție sortată automat |

**Demo:** Vezi [collections/Main.java](src/com/pao/laboratory03/collections/Main.java) pentru exemple practice.

**Alegere rapidă:**
- Trebuie să păstrezi **ordine**? → `ArrayList`
- Trebuie să elimini **duplicate**? → `HashSet` / `TreeSet`
- Trebuie **sortat**? → `TreeSet`

</details>

<details>
<summary><b>8. Ce este polimorfismul? Cum funcționează în practică?</b></summary>

**Polimorfism** = o variabilă de tip **părinte** poate stoca un obiect de tip **copil**, iar la rulare se apelează implementarea **reală** (a copilului), nu cea din părinte.

**Exemplu din [abstractclasses/Main.java](src/com/pao/laboratory03/abstractclasses/Main.java):**
```java
DBConnection conn1 = new MySqlConnection("jdbc:mysql://...");  // upcasting
DBConnection conn2 = new OracleConnection("jdbc:oracle://...");

conn1.connectToDb();  // apelează MySqlConnection.connectToDb()
conn2.connectToDb();  // apelează OracleConnection.connectToDb()

// Array polimorfic:
DBConnection[] connections = {conn1, conn2};
for (DBConnection conn : connections) {
    conn.connectToDb();  // comportament specific fiecărui tip real
}
```

**De ce este util?**
- ✅ **Cod generic** — lucrezi cu tipul abstract, nu trebuie să știi tipul concret
- ✅ **Extensibilitate** — adaugi noi subclase fără a modifica codul existent
- ✅ **Design patterns** — Strategy, Factory, Template Method se bazează pe polimorfism

Vezi și [exercise1/Main.java](src/com/pao/laboratory03/exercise1/Main.java) — calculează suma ariilor pentru orice `Shape[]` fără să știe tipul exact (Circle/Rectangle).

</details>

<details>
<summary><b>9. Ce înseamnă "constructor chaining" și care sunt regulile?</b></summary>

**Constructor chaining** = apelarea unui constructor din alt constructor (din aceeași clasă sau din părinte).

**Reguli obligatorii:**
1. `super(...)` sau `this(...)` **TREBUIE să fie prima instrucțiune** în constructor
2. Nu poți apela ambele în același constructor — fie `super`, fie `this`
3. Dacă nu specifici `super(...)`, Java adaugă automat `super()` (constructor fără parametri)
4. Dacă părinte **nu are** constructor fără parametri → **eroare de compilare** (trebuie apel explicit `super(args)`)

**Exemplu `this(...)` chaining:**
```java
public class Dog {
    private String name;
    private int age;
    
    public Dog(String name) {
        this(name, 0);  // apelează constructorul cu 2 parametri
    }
    
    public Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

**Exemplu `super(...)` chaining:**
Vezi [Circle.java](src/com/pao/laboratory03/exercise1/Circle.java), [Programator.java](src/com/pao/laboratory03/exercise3/model/Programator.java) — toate apelează `super(...)` pentru a inițializa câmpurile din părinte.

</details>

<details>
<summary><b>10. Pot modifica un obiect dintr-un <code>HashSet</code> după ce l-am adăugat?</b></summary>

**NU!** Modificarea unui obiect după inserare în `HashSet`/`HashMap` **corupe** structura internă.

**De ce?** `HashSet` folosește `hashCode()` pentru a determina bucket-ul unde se stochează obiectul. Dacă modifici câmpurile folosite în `hashCode()`, obiectul va fi în bucket-ul greșit → nu mai poate fi găsit cu `contains()`, `remove()` va eșua.

**Exemplu problematic:**
```java
Book book = new Book("Java", 500);
Set<Book> set = new HashSet<>();
set.add(book);

book.setName("Python");  // ⚠️ PERICOL! Hash-ul s-a schimbat!
set.contains(book);  // poate returna false (bucket greșit)
```

**Soluții:**
1. **Folosește clase imutabile** ca keys — vezi [ImmutableDog.java](src/com/pao/laboratory03/immutable/ImmutableDog.java)
2. **Nu modifica** obiectele după inserare în `HashSet`/`HashMap`
3. Dacă trebuie modificat → **remove()** → modifică → **add()** înapoi

</details>

<details>
<summary><b>11. De ce <code>String</code> este imutabil? Cum folosesc <code>StringBuilder</code>?</b></summary>

`String` este **imutabil** pentru siguranță (thread-safe, hash stabil pentru `HashMap` keys) și optimizare (string pool).

**Problemă:** Concatenări repetate creează obiecte noi la fiecare operație:
```java
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;  // ⚠️ INEFICIENT — 1000 obiecte temporare
}
```

**Soluție:** Folosește `StringBuilder` (mutable, eficient):
```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // ✅ EFICIENT — modifică același obiect
}
String result = sb.toString();
```

Vezi benchmark în [strings/Main.java](src/com/pao/laboratory03/strings/Main.java) — diferența poate fi de **100x** viteza pentru concatenări masive!

**Regulă:** Concatenări în **buclă** sau **multe operații** → `StringBuilder`. Concatenare simplă (2-3 stringuri) → `+` este OK.

</details>

<details>
<summary><b>12. Cum funcționează <code>toString()</code> și când ar trebui suprascris?</b></summary>

`toString()` convertește un obiect în reprezentare text. Implementarea default din `Object` returnează `ClassName@hashCode` (ex: `Book@5e91993f`) — inutil pentru debugging.

**Când suprascrii `toString()`:**
- ✅ Când vrei să vezi conținutul obiectului în debugging
- ✅ Când afișezi obiecte cu `System.out.println(obj)`
- ✅ Când vrei logging comprehensibil

**Exemplu din [Book.java](src/com/pao/laboratory03/equalshashcode/Book.java):**
```java
@Override
public String toString() {
    return "Book{name='" + name + "', pages=" + pages + "}";
}
```

**Pattern comun** — include clasa și câmpurile importante:
```java
return getClass().getSimpleName() + "{field1=" + field1 + ", field2=" + field2 + "}";
```

Vezi toate clasele model din laborator: [Shape.java](src/com/pao/laboratory03/exercise1/Shape.java), [Angajat.java](src/com/pao/laboratory03/exercise3/model/Angajat.java), [Animal.java](src/com/pao/laboratory03/exercise4/model/Animal.java) — toate au `toString()` suprascris.

</details>

<details>
<summary><b>13. Ce înseamnă "upcasting" și "downcasting"?</b></summary>

**Upcasting** = conversie automată de la subclasă → superclasă (întotdeauna safe):
```java
Circle circle = new Circle(5.0);
Shape shape = circle;  // upcasting implicit — Circle IS-A Shape
```

**Downcasting** = conversie explicită de la superclasă → subclasă (poate eșua la runtime):
```java
Shape shape = new Circle(5.0);
Circle circle = (Circle) shape;  // downcasting explicit — verifică cu instanceof

// ⚠️ PERICOL:
Shape shape2 = new Rectangle(3, 4);
Circle circle2 = (Circle) shape2;  // ❌ ClassCastException la runtime!
```

**Verificare sigură:**
```java
if (shape instanceof Circle) {
    Circle circle = (Circle) shape;  // ✅ sigur
    // folosește metode specifice Circle
}
```

**Exemplu din laborator:** [abstractclasses/Main.java](src/com/pao/laboratory03/abstractclasses/Main.java) — array `DBConnection[]` conține obiecte `MySqlConnection` și `OracleConnection` (upcasting).

</details>

<details>
<summary><b>14. Cum parcurg o colecție? Care este diferența între metodele de iterare?</b></summary>

**4 metode de parcurgere** (vezi [collections/Main.java](src/com/pao/laboratory03/collections/Main.java)):

**a) For clasic** — doar pentru liste cu index (`ArrayList`, array-uri):
```java
for (int i = 0; i < list.size(); i++) {
    String item = list.get(i);
}
```

**b) Enhanced for** (for-each) — pentru orice colecție:
```java
for (String item : list) {
    System.out.println(item);
}
```

**c) forEach + lambda** (Java 8+) — cel mai concis:
```java
list.forEach(item -> System.out.println(item));
// sau method reference:
list.forEach(System.out::println);
```

**d) Iterator** — când vrei să ștergi elemente în timp ce parcurgi:
```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String item = it.next();
    if (condition) it.remove();  // ✅ safe removal
}
```

**Recomandare:** Folosește **enhanced for** sau **forEach** în majoritatea cazurilor — sunt concise și sigure.

</details>

<details>
<summary><b>15. Pot avea o clasă abstractă fără metode abstracte?</b></summary>

**DA!** O clasă poate fi declarată `abstract` chiar dacă toate metodele sunt concrete.

**Scop:** Previi instanțierea directă — vrei ca utilizatorii să folosească doar subclasele concrete.

**Exemplu conceptual:**
```java
public abstract class Vehicle {  // abstract, dar fără metode abstracte
    private String brand;
    
    public Vehicle(String brand) { this.brand = brand; }
    
    public void start() {  // metodă concretă
        System.out.println(brand + " pornește motorul");
    }
}

// ❌ new Vehicle("Toyota");  // eroare — clasă abstractă
// ✅ class Car extends Vehicle { ... }  // OK
```

**Când este util:**
- Design pattern **Template Method** — structură fixă în părinte, detalii în copii
- Când clasa are sens doar ca **bază conceptuală**, nu standalone

În laborator, [DBConnection](src/com/pao/laboratory03/abstractclasses/DBConnection.java), [Angajat](src/com/pao/laboratory03/exercise3/model/Angajat.java), [Animal](src/com/pao/laboratory03/exercise4/model/Animal.java) au **ambele** metode abstracte și concrete.

</details>

<details>
<summary><b>16. Ce este un Singleton și cum îl implementez?</b></summary>

**Singleton** = design pattern care garantează că o clasă are **exact o singură instanță** în întreaga aplicație.

**Implementare clasică:**
```java
public class ZooService {
    private static ZooService instance;  // instanță unică
    
    private ZooService() {  // constructor PRIVAT — nu se poate apela din exterior
        // inițializare
    }
    
    public static ZooService getInstance() {  // punct de acces global
        if (instance == null) {
            instance = new ZooService();
        }
        return instance;
    }
}

// Utilizare:
ZooService service = ZooService.getInstance();  // prima dată creează
ZooService service2 = ZooService.getInstance();  // returnează aceeași instanță
// service == service2 → true
```

**Când folosești:**
- Servicii globale (logging, configurare, conexiuni DB)
- Resurse partajate (cache, pool-uri)

**În laborator:** Implementezi Singleton în [ZooService.java](src/com/pao/laboratory03/exercise4/service/ZooService.java) — o singură instanță gestionează toți animalele din Zoo.

**Alternativă modernă:** În aplicații mari, folosește **Dependency Injection** (Spring) în loc de Singleton manual.

</details>

