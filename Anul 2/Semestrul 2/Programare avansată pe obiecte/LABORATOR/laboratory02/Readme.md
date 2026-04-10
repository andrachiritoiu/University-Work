# Laboratory 02 — Clase, Încapsulare, Comparatori, Array-uri

---

## Exerciții

### Exercițiul 1 — Comparatori: `Podcast.java`
📄 **Pachet:** [comparators/](comparators/)

Studiază [AudioBook.java](comparators/AudioBook.java) și [Book.java](comparators/Book.java) — ambele demonstrează:
- `toString()` — reprezentare text a obiectului (se apelează automat la `println`)
- `Comparable<T>` + `compareTo` — sortare naturală (după titlu)
- `Comparator<T>` — clasă externă cu `compare()` pentru sortare alternativă (după lungime / pagini)

**Ce trebuie să faci:** implementează [Podcast.java](comparators/Podcast.java) după modelul celor două clase. Cerințele sunt scrise in comentarii la inceputul fișierului.

---

### Exercițiul 2 — Aplicație CRUD cu Singleton: `exercise/`
📄 **Pachet:** [exercise/](exercise/)

Un sistem de gestionare mașini cu meniu interactiv — **model similar cu ce veți construi în proiectul individual**.

Înainte de a rezolva, studiază aceste exemple:
- [arrays/ArrayDemo.java](arrays/ArrayDemo.java) — parcurgere, redimensionare dinamică, sortare (pattern-ul de care ai nevoie)
- [exercise/CarService.java](exercise/CarService.java) — **Singleton Pattern** (o singură instanță, constructor `private`, acces prin `getInstance()`)
- [exercise/Main.java](exercise/Main.java) — aplicație din linia de comandă cu `Scanner` + `while(true)` + `switch`

**Ce trebuie să faci:**
1. ✏️ Completează metoda `addReview` din [exercise/CarService.java](exercise/CarService.java) — pattern-ul de redimensionare este identic cu `addCar`.
2. ✏️ Completează cazul 3 din switch-ul din [exercise/Main.java](exercise/Main.java) — citește date de la tastatură și apelează `addReview`.

> **De ce contează?** Structura Singleton + meniu interactiv + operații CRUD este exact ce veți folosi în proiectul vostru individual.

---

## Fișiere din acest laborator

| Fișier | Rol |
|--------|-----|
| [Main.java](Main.java) | **Demo** — instanțiere obiecte, import din model/ |
| [model/Dog.java](model/Dog.java) | **Demo** — clasă cu încapsulare (private, getteri, setteri, toString) |
| [model/Cat.java](model/Cat.java) | **Demo** — structură identică cu Dog |
| [arrays/ArrayDemo.java](arrays/ArrayDemo.java) | **Demo** — parcurgere, redimensionare, sortare array-uri |
| [utils/DogComparator.java](utils/DogComparator.java) | **Demo** — Comparator extern |
| [comparators/AudioBook.java](comparators/AudioBook.java) | **Demo** — Comparable + Comparator complet |
| [comparators/Book.java](comparators/Book.java) | **Demo** — Comparable + Comparator complet |
| [comparators/Podcast.java](comparators/Podcast.java) | **Exercițiu 1** — de implementat |
| [exercise/Car.java](exercise/Car.java) | **Exercițiu 2** — model (dat, citește-l) |
| [exercise/CarService.java](exercise/CarService.java) | **Exercițiu 2** — Singleton cu TODO |
| [exercise/Main.java](exercise/Main.java) | **Exercițiu 2** — meniu interactiv cu TODO |

---

## Cum rulez?
- **Demo-uri** — deschide orice fișier cu `main` → click dreapta → **Run**
- **Exercițiul 2** — deschide `exercise/Main.java` → **Run** → interacționează cu meniul din consolă

---

## Recapitulare rapidă

| Concept | Ce trebuie să rețin |
|---------|---------------------|
| `toString` | Suprascriere cu `@Override` — oferă reprezentare text |
| `Comparable<T>` | Interfață implementată de clasă — definește `compareTo` (sortare naturală) |
| `Comparator<T>` | Clasă externă cu `compare()` — sortare alternativă, folosită de `Arrays.sort` |
| Array redimensionare | `new T[length+1]` + `System.arraycopy` + element nou pe ultima poziție |
| Singleton | Constructor `private`, acces prin `getInstance()`, o singură instanță |
| Meniu interactiv | `Scanner` + `while(true)` + `switch` — baza pentru proiectul individual |

---

## Ce urmează la Laboratory 03?
- Moștenire (`extends`, `super`)
- Clase abstracte și interfețe
- `equals` / `hashCode`
- Clase imutabile (`final`)
- `String` vs `StringBuilder` vs `StringBuffer`
- Colecții (`List`, `Set`)

