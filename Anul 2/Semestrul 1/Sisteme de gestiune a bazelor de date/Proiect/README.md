# 🐾 Farmacie Veterinară – Sistem de Gestiune a Bazelor de Date (Oracle)

Baza de date modelează fidel activitatea reală a unei farmacii veterinare, integrând:
- **componenta medicală** (animale, consultații, rețete, campanii veterinare);
- **componenta comercială** (gestiunea stocurilor pe loturi, vânzări, comenzi către furnizori, facturi).

Proiectul pune accent pe **consistența datelor**, **reguli de business**, **automatizarea proceselor** și utilizarea avansată a mecanismelor **PL/SQL** oferite de Oracle.

---

## Obiectivele proiectului
- proiectarea unui model relațional normalizat (FN3);
- implementarea completă în **Oracle Database 19c**;
- utilizarea avansată a limbajului **SQL și PL/SQL**;
- implementarea mecanismelor de:
  - audit;
  - tratare a erorilor;
  - automatizare prin trigger-e;
  - rapoarte complexe prin pachete PL/SQL.

---

## Tehnologii utilizate
- **SGBD:** Oracle Database 19c  
- **Limbaj:** SQL, PL/SQL  
- **Mediu de dezvoltare:** Oracle SQL Developer  
- **Sistem de operare:** Windows 11 x64  

---

## Structura bazei de date


### 🔹 Entități principale
- `CLIENT`, `ANIMAL`
- `PERSONAL_MEDICAL`, `MEDIC_VETERINAR`, `FARMACIST`
- `MEDICAMENT`, `STOC`
- `COMANDA`, `FACTURA`
- `FURNIZOR`, `CAMPANIE`

### 🔹 Tabele asociative
- `ARE` – produse vândute în comenzi clienți
- `INCLUDE` – produse comandate de farmacie
- `CONTINE` – medicamente prescrise în rețete
- `INTERVINE` – participări în campanii veterinare
- `VINDE` – relația furnizor–medicament

---

## Modelare
### Diagramă Entitate–Relație (ERD)
<p align="center">
  <img src="diagrama ER.png" alt="Diagramă Entitate–Relație" width="700"/>
</p>
📄 [Versiune PDF](Diagrama farmacie SGBD.pdf)

---

### Diagramă conceptuală
<p align="center">
  <img src="diagrama conceptuala.jpg" alt="Diagramă conceptuală" width="700"/>
</p>
📄 [Versiune PDF](Diagrama conceptuala.pdf)  

---

## Funcționalități implementate

### 🔸 Subprograme PL/SQL
- procedură care utilizează **toate cele 3 tipuri de colecții**:
  - VARRAY
  - Nested Table
  - Associative Array
- procedură cu **două tipuri de cursoare**, dintre care unul parametrizat și dependent;
- funcție ce utilizează **3 tabele într-o singură instrucțiune SQL**, cu tratarea tuturor excepțiilor;
- procedură complexă ce utilizează **5 tabele** și implementează **excepții personalizate**.

---

### 🔸 Trigger-e
- **Trigger LMD la nivel de comandă**
  - restricționează operațiile pe facturi în afara programului;
  - interzice modificările în zilele nelucrătoare;
  - loghează tentativele nepermise.
- **Trigger LMD la nivel de linie (compound trigger)**
  - actualizează automat stocul la emiterea/ștergerea facturilor;
  - gestionează diferențiat comenzile clienților și comenzile de farmacie;
  - previne erori de tip *mutating table*.
- **Trigger LDD**
  - auditează toate operațiile DDL (CREATE, ALTER, DROP);
  - interzice ștergerea tabelelor critice ale aplicației.

---

## Audit & tratare erori
- `CODURI_EROARE` – catalog centralizat de erori personalizate;
- `LOG_EROARE` – logarea execuțiilor eșuate, folosind **tranzacții autonome**;
- `AUDIT_OPERATII_LDD` – audit complet pentru operații DDL asupra schemei.

---

## Pachet PL/SQL – Reaprovizionare Farmacie 
Proiectul include un **pachet PL/SQL complex** care gestionează procesul de reaprovizionare:

### Funcționalități:
- identificarea medicamentelor cu **stoc critic** și/sau **loturi care expiră**;
- estimarea **consumului recent** pe baza comenzilor clienților;
- generarea și salvarea permanentă a unui **raport de reaprovizionare**;
- configurarea pragurilor minime per medicament, cu **istoric al modificărilor**.

### Tehnici utilizate:
- tipuri de date complexe (`OBJECT`, `NESTED TABLE`);
- cursor dinamic;
- funcții și proceduri integrate într-un flux complet de business.

---

## Rulare proiect
1. Creează un utilizator dedicat în Oracle.
2. Rulează scripturile în următoarea ordine:
   - creare tabele & secvențe;
   - inserare date;
   - subprograme PL/SQL;
   - trigger-e;
   - pachetul PL/SQL.
3. Activează afișarea mesajelor:
   ```sql
   SET SERVEROUTPUT ON;
   ```
