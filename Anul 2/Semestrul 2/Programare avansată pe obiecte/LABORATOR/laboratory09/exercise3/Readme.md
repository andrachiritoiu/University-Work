# Exercițiul 3 (BONUS) — Procesator asincron de tranzacții bancare

> **Pachet:** `com.pao.laboratory09.exercise3`
> **Timp estimat:** ~30 min · **Fără teste automate** — demonstrație în `Main.java`

---

## Scop

Trei ATM-uri trimit tranzacții în paralel pe o bandă partajată de capacitate fixă 5. Un fir „Processor" le consumă și generează confirmări de factură. Vei implementa pattern-ul **Producător–Consumator** cu `synchronized`, `wait()` și `notifyAll()`.

---

## Noțiuni demonstrate

- `Thread` și `Runnable` — două moduri de creare a firelor
- `synchronized` pe metodele benzii — excludere reciprocă
- `wait()` — producătorul suspendă când banda e plină; consumatorul suspendă când e goală
- `notifyAll()` — trezește toți firele care asteaptă după fiecare operație
- `volatile boolean activ` — oprire gracioasă a consumatorului
- `join()` — firul principal așteaptă terminarea tuturor producătorilor

---

## Clase de creat

**`CoadaTranzactii`** — bandă partajată, capacitate maximă 5:
- Metodele `adauga(Tranzactie t)` și `extrage()` sunt `synchronized`
- `adauga` face `wait()` cât timp banda e plină, `notifyAll()` după adăugare
- `extrage` face `wait()` cât timp banda e goală, `notifyAll()` după extragere

**`ATMThread extends Thread`** — producător:
- Primește un id (1, 2, 3) și produce 4 tranzacții
- `Thread.sleep(50)` între tranzacții consecutive
- Afișează `[ATM-N] trimite: Tranzactie #id suma RON` la fiecare trimitere
- Opțional: `[ATM-N] astept loc...` înainte de `wait()` în `adauga`

**`ProcessorThread implements Runnable`** — consumator:
- `volatile boolean activ` — bucla rulează cât timp `activ == true`
- `Thread.sleep(80)` între procesări
- Afișează `[Processor] Factura #id - suma RON | data` la fiecare procesare

---

## Cerințe minime pentru `Main.java`

1. Creează 3 instanțe `ATMThread` și un `ProcessorThread` pe un fir separat
2. Pornește toți producătorii cu `start()`
3. Pornește consumatorul cu `new Thread(processorThread).start()`
4. Fă `join()` pe toți cei 3 ATM-uri (firul principal așteaptă terminarea lor)
5. Setează `processorThread.activ = false` și `notifyAll()` pe bandă (pentru a trezi consumatorul din eventual `wait()`)
6. Fă `join()` pe firul consumatorului
7. Afișează `Toate tranzactiile procesate. Total: 12`

**Outputul demonstrează:**
- 12 linii `[ATM-N] trimite:` (3 ATM × 4 tranzacții)
- 12 linii `[Processor] Factura #...`
- Cel puțin o linie `[ATM-N] astept loc...` (banda se umple la un moment dat)
- Linia finală `Toate tranzactiile procesate. Total: 12`

---

## Libertate de implementare

Datele de test sunt hardcodate sau generate (id secvențial, sume aleatoare, date fixe). Ordinea liniilor de output poate varia (fire concurente). Important: toate cele 12 tranzacții apar în output și consumatorul generează factură pentru fiecare.

---

## Hint-uri

- `start()` vs `run()` — apelul `run()` direct nu creează fir nou; tot codul rulează pe firul curent
- `synchronized` pe metodă nestatică → lock pe **obiect** (pe instanța `CoadaTranzactii`)
- `wait()` și `notify()` se apelează **numai în bloc `synchronized`**, altfel `IllegalMonitorStateException`
- `notifyAll()` preferabil față de `notify()` — trezește toți firele, nu unul aleator
- `volatile boolean activ` — fără `volatile`, firul consumatorului poate lucra cu o copie locală a variabilei (din cache CPU) și nu vede modificarea din firul principal
