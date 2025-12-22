-- Lab 1

--Lab 2
--1.A)F
--  B)A
--  C)F - GRUP NU INCULDE NULL(CU EXCEPTIA LUI COUNT)
--2.A)F (DEZACTIVARE PK CU ALTER TABLE)
--  B)A
--  C)F
--  D)A
--3.A)A
--  B)A
--  C)F(ON DELETE CASCADE)
--  D)A
--4.D)
--5.C)O VIZULAIZARE SIMPLA POATE MODIFICA TABELUL
--6.A)
--7.A)
--8.C)
--9.C)
--10.D)


-- 11.Adăugaţi un comentariu tabelei emp_***.
CREATE TABLE EMP_CAF
AS SELECT *
FROM EMPLOYEES;

COMMENT ON TABLE EMP_CAF IS 'Informatii despre angajati';

-- 12. Folosind vizualizarea user_tab_comments afişaţi comentariul adăugat tabelului emp_***.
SELECT *
FROM USER_TAB_COMMENTS;

-- 13.Modificaţi formatul datei calendaristice setat la nivel de sesiune astfel încât datele calendaristice să
-- respecte următoarea formă 01.10.2011 16:10:05.
ALTER SESSION SET NLS_DATE_FORMAT = 'DD.MM.YYYY';
SELECT SYSDATE FROM dual;

-- 14.Rulaţi următoarea cerere SQL
SELECT EXTRACT(YEAR FROM SYSDATE)
FROM dual;

-- 15.Modificaţi cererea anterioară astfel încât să obţineţi ziua, respectiv luna datei curente.
SELECT
    EXTRACT(DAY FROM SYSDATE)   AS ziua,
    EXTRACT(MONTH FROM SYSDATE) AS luna,
    EXTRACT(YEAR FROM SYSDATE)  AS anul
FROM DUAL;


-- 16.. Afişaţi numele tuturor tabelelor personale create (nume_tabel_***).
SELECT *
FROM USER_TABLES
WHERE TABLE_NAME LIKE 'EMP_%';





-- TEMA : 17, 23

--17.Generaţi automat un script SQL care să conţină comenzi de ştergere a tuturor tabelelor personale create.
--Indicaţie: Folosiţi comenzile SPOOL …/sterg_tabele.sql şi SPOOL OFF.

--     --in sqlPlus
-- SPOOL sterg_tabele.sql
-- SET HEADING OFF
-- SET FEEDBACK OFF
-- SET PAGESIZE 0
--
-- SELECT 'DROP TABLE ' || table_name || ', '
-- FROM user_tables;
-- WHERE table_name LIKE 'EMP_%'
--
-- SPOOL OFF
-- SET HEADING ON
-- SET FEEDBACK ON
-- SET PAGESIZE 14


--18.Verificaţi informaţiile din fişierul generat.
-- HOST type sterg_tabele.sql
--! type sterg_tabele.sql


--19. Ce informaţii suplimentare sunt incluse în acest fişier dacă folosim SQL*Plus?

--     Fără setarea SET HEADING OFF, scriptul ar include antetul coloanei ('DROP TABLE '||TABLE_NAME||'CASCADE CONSTRAINTS;').
-- Fără SET FEEDBACK OFF, ar include mesajul de feedback de la SQL*Plus/SQLcl (N rows selected). Fără SET PAGESIZE 0, ar putea include spațiu și o linie de separare.


--20.Verificaţi ce efect are utilizarea comenzii SET FEEDBACK OFF.

--     Comanda suprimă afișarea mesajului care indică numărul de rânduri (N rows selected) returnate de o interogare sau
-- afectate de o comandă DML (INSERT, UPDATE, DELETE).


--21.Asiguraţi-vă că antetul tabelului rezultat nu se multiplică.
--Indicaţie: Utilizaţi comanda SET PAGESIZE 0

--     SET PAGESIZE 0 (pentru a elimina antetul de tot) sau SET PAGESIZE n cu o valoare mare, de ex. SET PAGESIZE 50000
-- (dacă se dorește antetul doar la începutul output-ului).



--22.Fără să rulaţi scriptul creat daţi exemplu de un caz în care execuţia acestui script va determina erori.
--Indicaţi o metodă de rezolvare a acestui caz.

--     Caz de eroare: Dacă una dintre tabelele personale (nume_tabel_***) nu există sau dacă utilizatorul nu are permisiunile
-- necesare pentru a o șterge. Deși user_tables ar trebui să listeze doar tabelele proprii, o eroare ar putea apărea și dacă scriptul încearcă să șteargă o vizualizare sau o altă structură.
--
-- Metoda de rezolvare: Se poate folosi un bloc BEGIN...END PL/SQL cu tratarea excepțiilor (EXCEPTION WHEN OTHERS THEN NULL;)
-- sau, în unele SGBD-uri, comanda DROP TABLE IF EXISTS table_name (deși aceasta nu este disponibilă în Oracle SQL*Plus standard). În Oracle, soluția cea mai elegantă pentru scripturi automate este un bloc PL/SQL:
--
--
--     BEGIN
--     EXECUTE IMMEDIATE 'DROP TABLE ' || table_name || ' CASCADE CONSTRAINTS';
-- EXCEPTION
--     WHEN OTHERS THEN
--         NULL; -- Ignoră eroarea
-- END;

--23. Folosind tabelul departments generaţi automat script-ul SQL de inserare a înregistrărilor în acest tabel.

-- SPOOL insert_departments.sql
-- SET HEADING OFF
-- SET FEEDBACK OFF
-- SET PAGESIZE 0
--
SELECT 'Insert into departments (department_name,department_id) VALUES (' || department_name || ', ' || department_id || ');'
FROM departments;
--
-- SPOOL OFF
-- SET HEADING ON
-- SET FEEDBACK ON
-- SET PAGESIZE 14



--LAB 3
--4.Câte filme (titluri, respectiv exemplare) au fost împrumutate din cea mai cerută categorie?

SELECT T.category, COUNT(DISTINCT T.title_id), COUNT(*)
FROM TITLE T
JOIN RENTAL R ON R.title_id=T.title_id
GROUP BY T.category
HAVING COUNT(*)=(
    SELECT MAX(NumarImprumuturi)
    FROM(
        SELECT COUNT(*) AS NumarImprumuturi
        FROM TITLE T2
        JOIN RENTAL R2 ON R2.title_id=T2.title_id
        GROUP BY T2.category
    )X
)
ORDER BY T.category;

--5. Câte exemplare din fiecare film sunt disponibile în prezent (considerați că statusul unui exemplar nu
--este setat, deci nu poate fi utilizat)?
SELECT T.TITLE, COUNT(R.TITLE_ID)
FROM TITLE T
JOIN RENTAL R ON R.TITLE_ID=T.TITLE_ID
WHERE R.EXP_RET_DATE<SYSDATE
GROUP BY T.TITLE;

--6.

SELECT T.title, C.copy_id, C.status,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM RENTAL R
            WHERE R.title_id = C.title_id
              AND R.copy_id = C.copy_id
              AND R.act_ret_date IS NULL
        ) THEN 'RENTED'
        ELSE 'AVAILABLE'
    END AS "Status Corect"
FROM TITLE T
JOIN TITLE_COPY C ON C.title_id = T.title_id
ORDER BY T.title, C.copy_id;

--7. a. Câte exemplare au statusul eronat?


-- 8.Toate filmele rezervate au fost împrumutate la data rezervării? Afișați textul “Da” sau ”Nu” în
-- funcție de situație.

SELECT
CASE
    WHEN NOT EXISTS(
        SELECT 1
        FROM RESERVATION REZ
        LEFT JOIN RENTAL REN ON REZ.MEMBER_ID=REN.MEMBER_ID
        WHERE REZ.TITLE_ID IS NOT NULL
    )
    THEN 'DA'
    ELSE 'NU'
END AS TOATE_IMPRUMUTURILE_LA_DATA_REZERVARII
FROM DUAL;

--tema:7(a,b),8/11,12(a,b)-zile pot fi hardcodate




-- TEMA

-- 7.Obs. Pentru rezolvare creați tabela title_copy_***, preluând structura și datele din tabela
-- title_copy.

CREATE TABLE TITLE_COPY_CAF AS
SELECT *
FROM TITLE_COPY;

-- SELECT *
-- FROM TITLE_COPY_CAF



-- A)Câte exemplare au statusul eronat?

SELECT COUNT(T.TITLE_ID)
FROM TITLE_COPY_CAF T
LEFT JOIN RENTAL R ON R.COPY_ID=T.COPY_ID AND R.TITLE_ID=T.TITLE_ID
WHERE (T.STATUS = 'RENTED' AND R.ACT_RET_DATE IS NOT NULL)
    OR (T.STATUS = 'AVAILABE' AND R.ACT_RET_DATE IS NULL);



-- B)Setați statusul corect pentru toate exemplarele care au statusul eronat. Salvați actualizările
-- realizate.

UPDATE TITLE_COPY_CAF T
SET STATUS = 'AVAILABLE'
WHERE EXISTS(
    SELECT 1
    FROM RENTAL R
    WHERE T.STATUS = 'RENTED' AND R.ACT_RET_DATE IS NOT NULL
    AND R.COPY_ID=T.COPY_ID AND R.TITLE_ID=T.TITLE_ID
);

UPDATE TITLE_COPY_CAF T
SET STATUS = 'RENTED'
WHERE EXISTS(
    SELECT 1
    FROM RENTAL R
    WHERE T.STATUS = 'AVAILABLE' AND R.ACT_RET_DATE IS NULL
    AND R.COPY_ID=T.COPY_ID AND R.TITLE_ID=T.TITLE_ID
);

COMMIT;

-- SELECT *
-- FROM TITLE_COPY_CAF;




-- 8.Toate filmele rezervate au fost împrumutate la data rezervării? Afișați textul “Da” sau ”Nu” în
-- funcție de situație.

-- DACA NU GASESTE NICIO EXCEPTIE E DA
-- CAUTA SA GASESCA O REVERVARE PENTRU CARE NU S-A FACUT IMPRUMUT

SELECT
    CASE
        WHEN COUNT(*)=0 THEN 'DA'
        ELSE 'NU'
    END AS "TOATE_FILMELE_LA_DATA_REZERVARII"
FROM RESERVATION REZ
WHERE
    NOT EXISTS(
        SELECT 1
        FROM RENTAL RT
        WHERE RT.MEMBER_ID=REZ.MEMBER_ID AND RT.TITLE_ID=REZ.TITLE_ID AND RT.BOOK_DATE=REZ.RES_DATE
    );




-- 12. Pentru anumite zile specificate din luna curentă, obțineți numărul de împrumuturi efectuate.
--A)Se iau în considerare doar primele 2 zile din lună.

SELECT CAST(R.BOOK_DATE AS DATE) AS ZI,
    COUNT(*) AS NUMAR_IMPRUMUTURI
FROM RENTAL R
WHERE EXTRACT(MONTH FROM R.BOOK_DATE) = EXTRACT(MONTH FROM CURRENT_DATE) AND
    EXTRACT(YEAR FROM R.BOOK_DATE) = EXTRACT(YEAR FROM CURRENT_DATE) AND
    EXTRACT(DAY FROM R.BOOK_DATE) IN (1,2)
GROUP BY (CAST(R.BOOK_DATE AS DATE));



--B)Se iau în considerare doar zilele din lună în care au fost efectuate împrumuturi.

SELECT CAST(R.BOOK_DATE AS DATE) AS ZI,
    COUNT(*) AS NUMAR_IMPRUMUTURI
FROM RENTAL R
WHERE EXTRACT(MONTH FROM R.BOOK_DATE) = EXTRACT(MONTH FROM CURRENT_DATE) AND
    EXTRACT(YEAR FROM R.BOOK_DATE) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY (CAST(R.BOOK_DATE AS DATE));



-- LAB continuare
-- A)

SELECT
    TRUNC(SYSDATE,'MONTH')
FROM DUAL;

-- C)
-- QUERRY ERARHIC

-- START WITH
-- CONNECTED BY

SELECT EMPLOYEE_ID
FROM EMPLOYEES
START WITH
    EMPLOYEE_ID=101
CONNECT BY EMPLOYEE_ID=EMPLOYEES.MANAGER_ID;


SELECT ZI , COUNT(*)
FROM(
SELECT
    TRUNC(SYSDATE,'MONTH') + LEVEL -1 AS ZI
FROM DUAL
CONNECT BY
    LEVEL < EXTRACT(DAY FROM SYSDATE)) Z
JOIN RENTAL R ON Z.ZI=R.BOOK_DATE
GROUP BY ZI;


-- lab 4

-- 4. Definiți un bloc anonim în care să se afle numele departamentului cu cei mai mulți angajați.
-- Comentați cazul în care există cel puțin două departamente cu număr maxim de angajați.

DECLARE
  v_dep departments.department_name%TYPE;
BEGIN
  SELECT department_name
  INTO   v_dep
  FROM   employees e, departments d
  WHERE  e.department_id=d.department_id
  GROUP BY department_name
  HAVING COUNT(*) = (SELECT MAX(COUNT(*))
                     FROM   employees
                     GROUP BY department_id);
  DBMS_OUTPUT.PUT_LINE('Departamentul '|| v_dep);
END;

-- adaugare count
DECLARE
  v_dep departments.department_name%TYPE;
  v_count NUMBER;
BEGIN
  SELECT department_name, COUNT(e.employee_id)
  INTO   v_dep , v_count
  FROM   employees e, departments d
  JOIN   departments d ON e.department_id = d.department_id
  WHERE  e.department_id=d.department_id
  GROUP BY department_name
  HAVING COUNT(*) = (SELECT MAX(COUNT(*))
                     FROM   employees
                     GROUP BY department_id);
  DBMS_OUTPUT.PUT_LINE('Departamentul '|| v_dep);
   DBMS_OUTPUT.PUT_LINE('Departamentul '|| v_dep||'Nr'||v_count);
END;




-- lab 5

--Tema: E1. Se dă următorul bloc:
--Tema 3
--E1.

-- SET SERVEROUTPUT ON

DECLARE
 numar number(3):=100;
 mesaj1 varchar2(255):='text 1';
 mesaj2 varchar2(255):='text 2';
BEGIN
  DECLARE
   numar number(3):=1;
   mesaj1 varchar2(255):='text 2';
   mesaj2 varchar2(255):='text 3';
BEGIN
numar:=numar+1;
mesaj2:=mesaj2||' adaugat in sub-bloc';

DBMS_OUTPUT.PUT_LINE('numar in subbloc: ' || numar);
DBMS_OUTPUT.PUT_LINE('mesaj1 in subbloc: ' || mesaj1);
DBMS_OUTPUT.PUT_LINE('mesaj2 in subbloc: ' || mesaj2);

END;
numar:=numar+1;
mesaj1:=mesaj1||' adaugat un blocul principal';
mesaj2:=mesaj2||' adaugat in blocul principal';

DBMS_OUTPUT.PUT_LINE('numar in bloc: ' || numar);
DBMS_OUTPUT.PUT_LINE('mesaj1 in bloc: ' || mesaj1);
DBMS_OUTPUT.PUT_LINE('mesaj2 in bloc: ' || mesaj2);

END;


--E3.

DECLARE
    v_nume_membru VARCHAR(100) := '&nume_membru';
    v_id_membru MEMBER.MEMBER_ID%TYPE;
    v_numar_filme NUMBER:=0;

BEGIN
    SELECT member_id
    INTO v_id_membru
    FROM MEMBER
    WHERE last_name = v_nume_membru;

    SELECT COUNT(DISTINCT title_id)
    INTO v_numar_filme
    FROM RENTAL R
    WHERE R.member_id = v_id_membru;

    DBMS_OUTPUT.PUT_LINE('Membrul cu numele ' || v_nume_membru ||
                             ' a împrumutat ' || NVL(v_numar_filme,0) || ' filme.');
END;






-- lab 6
--e2. Se dă următorul enunț: Pentru fiecare zi a lunii octombrie (se vor lua în considerare și zilele din
-- lună în care nu au fost realizate împrumuturi) obțineți numărul de împrumuturi efectuate.
-- a. Încercați să rezolvați problema în SQL fără a folosi structuri ajutătoare.
-- b. Definiți tabelul octombrie_*** (id, data). Folosind PL/SQL populați cu date acest tabel.
-- Rezolvați în SQL problema dată.

CREATE TABLE octombrie_caf(
    id NUMBER(6),
    data DATE
);

DECLARE
    v_data_inceput DATE := DATE '2025-10-01';
    v_data_sfarsit DATE := DATE '2025-10-31';
    v_cnt NUMBER :=1;

BEGIN
    WHILE v_data_inceput <= v_data_sfarsit LOOP
        INSERT INTO octombrie_caf(id, data)
        VALUES (v_cnt, v_data_inceput);

        v_data_inceput := v_data_inceput + 1;
        v_cnt := v_cnt + 1;
     END LOOP;

END;



-- e4.Modificați problema anterioară astfel încât să afișați și următorul text: - Categoria 1 (a împrumutat mai mult de 
-- 75% din titlurile existente) - Categoria 2 (a împrumutat mai mult de 50% din titlurile existente) - Categoria 3 (a împrumutat mai
-- mult de 25% din titlurile existente) - Categoria 4 (altfel) 

DECLARE
    v_nume_membru VARCHAR(100) := '&nume_membru';
    v_id_membru MEMBER.MEMBER_ID%TYPE;
    v_numar_filme NUMBER:=0;
    v_total_titluri NUMBER;
    v_procent NUMBER;
    v_categorie VARCHAR2(20);

BEGIN
    SELECT member_id
    INTO v_id_membru
    FROM MEMBER
    WHERE last_name = v_nume_membru;

    SELECT COUNT(DISTINCT title_id)
    INTO v_numar_filme
    FROM RENTAL R
    WHERE R.member_id = v_id_membru;

    SELECT COUNT(*) INTO v_total_titluri FROM title;

     v_procent := (v_numar_filme / v_total_titluri) * 100;

    IF v_procent > 75 THEN
        v_categorie := 'Categoria 1';
    ELSIF v_procent > 50 THEN
        v_categorie := 'Categoria 2';
    ELSIF v_procent > 25 THEN
        v_categorie := 'Categoria 3';
    ELSE
        v_categorie := 'Categoria 4';
    END IF;

        DBMS_OUTPUT.PUT_LINE('Membrul cu numele ' || v_nume_membru ||
                         ' a împrumutat ' || v_numar_filme || ' filme (' || v_categorie || ').');
END;


--Tema :e6(4/5, 7/8, 9)

-- Tema lab - pe proeictul de anul trecut de la BD
    
-- 4.Definiți un bloc anonim în care să se afle numele și prenumele Clientului care deține cel mai mare număr de Animale înregistrate.
--
-- DECLARE
--   v_client_nume CLIENT.nume%TYPE;
--   v_client_prenume CLIENT.prenume%TYPE;
-- BEGIN
--   SELECT c.nume, c.prenume
--   INTO   v_client_nume, v_client_prenume
--   FROM   CLIENT c
--   JOIN   ANIMAL a ON c.id_client = a.id_client
--   GROUP BY c.nume, c.prenume
--   HAVING COUNT(a.id_animal) = (
--     SELECT MAX(COUNT(*))
--     FROM   ANIMAL
--     GROUP BY id_client
--   );
--   DBMS_OUTPUT.PUT_LINE('Clientul cu cele mai multe animale inregistrate este: ' || v_client_nume || ' ' || v_client_prenume);
-- EXCEPTION
--   WHEN NO_DATA_FOUND THEN
--     DBMS_OUTPUT.PUT_LINE('Nu exista clienti cu animale inregistrate in baza de date.');
--   WHEN TOO_MANY_ROWS THEN
--     DBMS_OUTPUT.PUT_LINE('ATENTIE: Exista mai multi clienti cu acelasi numar maxim de animale. Unul dintre ei este: ' || v_client_nume || ' ' || v_client_prenume);
-- END;
-- /
--
--
--
-- -- 7.Determinați valoarea Comisionului pe care îl primește un Medic Veterinar al cărui cod (id_personal_medical) este dat de la tastatură, pe baza numărului de Consultații efectuate, folosind instrucțiunea IF.
--
-- DECLARE
--    v_cod_client CLIENT.id_client%TYPE := &p_cod_client;
--    v_nr_comenzi NUMBER;
--    v_bonus      NUMBER(8);
--
-- BEGIN
--    SELECT COUNT(c.id_comanda) INTO v_nr_comenzi
--    FROM   COMANDA c
--    JOIN   COMANDA_CLIENT cc ON c.id_comanda = cc.id_comanda
--    WHERE  cc.id_client = v_cod_client;
--
--    IF v_nr_comenzi >= 10 THEN
--       v_bonus := 500;
--    ELSIF v_nr_comenzi >= 5 AND v_nr_comenzi < 10 THEN
--       v_bonus := 200;
--    ELSIF v_nr_comenzi > 0 AND v_nr_comenzi < 5 THEN
--       v_bonus := 50;
--    ELSE
--       v_bonus := 0;
--    END IF;
--
--    DBMS_OUTPUT.PUT_LINE('Clientul ' || v_cod_client || ' are ' || v_nr_comenzi || ' comenzi plasate.');
--    DBMS_OUTPUT.PUT_LINE('Bonusul acordat este: ' || v_bonus || ' RON.');
--
-- EXCEPTION
--   WHEN NO_DATA_FOUND THEN
--     DBMS_OUTPUT.PUT_LINE('Eroare: Nu exista un client cu ID-ul ' || v_cod_client);
-- END;
-- /
--
--
-- -- 9.Scrieți un bloc PL/SQL în care stocați prin variabile de substituție un Cod de Stoc (id_stoc), un Procent de creșterea
-- -- prețului și un număr de luni pentru extinderea datei de expirare. Măriți prețul unitar și extindeți data de expirare a produsului din stocul respectiv. Afișați mesajul de succes/eșec folosind SQL%ROWCOUNT. Anulați modificările realizate (ROLLBACK).
--
-- -- DEFINE p_id_stoc = 15
-- -- DEFINE p_procent_crestere = 10
-- -- DEFINE p_luni_adaugate = 6
--
-- DECLARE
--   v_id_stoc STOC.id_stoc%TYPE := &p_id_stoc;
--   v_procent NUMBER(5,2)       := &p_procent_crestere;
--   v_luni    NUMBER            := &p_luni_adaugate;
-- BEGIN
--   UPDATE STOC
--   SET    pret_unitar = pret_unitar * (1 + v_procent/100),
--          data_expirare = ADD_MONTHS(data_expirare, v_luni)
--   WHERE  id_stoc = v_id_stoc;
--
--   IF SQL%ROWCOUNT = 0 THEN
--      DBMS_OUTPUT.PUT_LINE('Nu exista o inregistrare de stoc cu ID-ul ' || v_id_stoc || '. Nicio actualizare realizata.');
--   ELSE
--      DBMS_OUTPUT.PUT_LINE('Actualizare realizata: ' || SQL%ROWCOUNT || ' rand(uri) afectate in STOC.');
--      DBMS_OUTPUT.PUT_LINE('Pretul a crescut cu ' || v_procent || '%, iar expirarea a fost prelungita cu ' || v_luni || ' luni.');
--   END IF;
--
--   ROLLBACK;
--   DBMS_OUTPUT.PUT_LINE('ATENTIE: Modificarile DML au fost anulate (ROLLBACK) pentru a pastra integritatea datelor de stoc.');
-- END;
-- /





-- lab 7
--2.
DECLARE
  TYPE emp_record IS RECORD
        (id departments.department_id%TYPE,
         nume departments.department_name%TYPE,
         nr_ang NUMBER(6,2));
  v_ang emp_record;
BEGIN
    SELECT d.department_id, d.department_name, COUNT(e.employee_id)
  INTO v_ang
  FROM DEPARTMENTS d
  LEFT JOIN EMPLOYEES e ON d.department_id = e.department_id
  WHERE d.department_id = 50
  GROUP BY d.department_id, d.department_name;

  DBMS_OUTPUT.PUT_LINE(
      'Departamentul ' || v_ang.id || ' (' || v_ang.nume ||
      ') are ' || v_ang.nr_ang || ' angajati.');
END;


--3.Detalii despre Seattle
DECLARE
  v_locatie LOCATIONS%ROWTYPE;
BEGIN
  SELECT *
  INTO   v_locatie
  FROM   locations
  WHERE  city = 'Seattle';

  DBMS_OUTPUT.PUT_LINE('ID Locatie: ' || v_locatie.location_id);
  DBMS_OUTPUT.PUT_LINE('Adresa: ' || v_locatie.street_address);
  DBMS_OUTPUT.PUT_LINE('Cod Postal: ' || v_locatie.postal_code);
  DBMS_OUTPUT.PUT_LINE('Oras: ' || v_locatie.city);
  DBMS_OUTPUT.PUT_LINE('Stat/Provincie: ' || v_locatie.state_province);
  DBMS_OUTPUT.PUT_LINE('ID Tara: ' || v_locatie.country_id);

END;
/

-- 3.O lista de departamente si pentru fiecare departament numele lui cu un tabel indexat
DECLARE
  TYPE t_tabel_dept IS TABLE OF departments.department_name%TYPE
       INDEX BY PLS_INTEGER;
  v_departamente t_tabel_dept;
  v_idx departments.department_id%TYPE;

BEGIN
  FOR dept_rec IN (SELECT department_id, department_name
                   FROM DEPARTMENTS)
  LOOP
    v_departamente(dept_rec.department_id) := dept_rec.department_name;
  END LOOP;

  v_idx := v_departamente.FIRST;

  WHILE v_idx IS NOT NULL LOOP
    DBMS_OUTPUT.PUT_LINE('ID: ' || v_idx || ' -Nume: ' || v_departamente(v_idx));
    v_idx := v_departamente.NEXT(v_idx);
  END LOOP;

END;
/

--Tema: e1(cu ambele tipuri de colectii)

-- lab rec
-- 1.
CREATE OR REPLACE TYPE adrese_email_CAF AS VARRAY(10) OF VARCHAR2(50);

CREATE TABLE client (
    id_client    INTEGER,
    nume_client  VARCHAR2(100),
    adrese_email adrese_email_CAF
);

BEGIN
    INSERT INTO client (id_client, nume_client, adrese_email)
    VALUES (1,'Popescu Ion',adrese_email_CAF('ion.popescu@email.com', 'ion.work@companie.ro'));

    INSERT INTO client (id_client, nume_client, adrese_email)
    VALUES (2,'Ionescu Ana',adrese_email_CAF('ana.ionescu@gmail.com'));

    INSERT INTO client (id_client, nume_client, adrese_email)
    VALUES (3,'Vasilescu Vasile',NULL);

    COMMIT;
END;
/

--E2.
-- a
CREATE OR REPLACE TYPE tip_orase_CAF AS TABLE OF VARCHAR2(50);

CREATE TABLE excursie_CAF (
    cod_excursie NUMBER(4) PRIMARY KEY,
    denumire VARCHAR2(20),
    orase tip_orase_CAF,
    status VARCHAR2(20)
)

NESTED TABLE orase STORE AS orase_ntab_CAF;

BEGIN
    INSERT INTO excursie_CAF (cod_excursie, denumire, orase, status)
    VALUES (1, 'Italia', tip_orase_CAF('Roma', 'Florenta', 'Venetia'), 'disponibilă');
    INSERT INTO excursie_CAF (cod_excursie, denumire, orase, status)
    VALUES (2, 'Turul Frantei', tip_orase_CAF('Paris', 'Lyon', 'Nisa'), 'disponibilă');
    INSERT INTO excursie_CAF (cod_excursie, denumire, orase, status)
    VALUES (3, 'Spania', tip_orase_CAF('Madrid', 'Barcelona'),'disponibilă');
    INSERT INTO excursie_CAF (cod_excursie, denumire, orase, status)
    VALUES (4, 'City Break Berlin', tip_orase_CAF('Berlin'),'disponibilă');
    INSERT INTO excursie_CAF (cod_excursie, denumire, orase, status)
    VALUES (5, 'Grecia (plan)', tip_orase_CAF('Atena'),'disponibilă');
    COMMIT;
END;
/

-- b
DECLARE
    v_orase tip_orase_CAF;
    v_cod_excursie NUMBER := 2;
BEGIN
    SELECT orase
    INTO v_orase
    FROM excursie_CAF
    WHERE cod_excursie = v_cod_excursie
    FOR UPDATE;

    IF v_orase IS NULL THEN
        v_orase := tip_orase_CAF();
    END IF;

    v_orase.EXTEND;
    v_orase(v_orase.LAST) := 'Marsilia';

    UPDATE excursie_CAF
    SET orase = v_orase
    WHERE cod_excursie = v_cod_excursie;

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Adăugat Marsilia la final. Total: ' || v_orase.COUNT);
END;
/
-- tema : E4
--lab 9
--e1

--a
DECLARE
    CURSOR c_jobs IS
        SELECT job_id, job_title FROM jobs ORDER BY job_title;

    CURSOR c_emps (p_job_id VARCHAR2) IS
        SELECT last_name, salary
        FROM employees
        WHERE job_id = p_job_id;

    v_job_id    jobs.job_id%TYPE;
    v_job_title jobs.job_title%TYPE;
    v_name      employees.last_name%TYPE;
    v_salary    employees.salary%TYPE;

BEGIN
    OPEN c_jobs;
    LOOP
        FETCH c_jobs INTO v_job_id, v_job_title;
        EXIT WHEN c_jobs%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('--------------------------------');
        DBMS_OUTPUT.PUT_LINE('JOB: ' || v_job_title);

        OPEN c_emps(v_job_id);
        LOOP
            FETCH c_emps INTO v_name, v_salary;
            EXIT WHEN c_emps%NOTFOUND;

            DBMS_OUTPUT.PUT_LINE('   -> Angajat: ' || v_name || ' | Salariu: ' || v_salary);
        END LOOP;

        IF c_emps%ROWCOUNT = 0 THEN
             DBMS_OUTPUT.PUT_LINE('   -> (Niciun angajat pe acest post)');
        END IF;

        CLOSE c_emps;
    END LOOP;
    CLOSE c_jobs;
END;
/


--b
    DECLARE
    CURSOR c_jobs IS
        SELECT job_id, job_title FROM jobs ORDER BY job_title;

    CURSOR c_emps (p_job_id VARCHAR2) IS
        SELECT last_name, salary
        FROM employees
        WHERE job_id = p_job_id;
BEGIN
    FOR r_job IN c_jobs LOOP
        DBMS_OUTPUT.PUT_LINE('--------------------------------');
        DBMS_OUTPUT.PUT_LINE('JOB: ' || r_job.job_title);

        FOR r_emp IN c_emps(r_job.job_id) LOOP
            DBMS_OUTPUT.PUT_LINE('   -> Angajat: ' || r_emp.last_name || ' | Salariu: ' || r_emp.salary);
        END LOOP;

    END LOOP;
END;
/

--c
BEGIN
    FOR r_job IN (SELECT job_id, job_title FROM jobs ORDER BY job_title) LOOP

        DBMS_OUTPUT.PUT_LINE('--------------------------------');
        DBMS_OUTPUT.PUT_LINE('JOB: ' || r_job.job_title);

        FOR r_emp IN (SELECT last_name, salary
                      FROM employees
                      WHERE job_id = r_job.job_id) LOOP

            DBMS_OUTPUT.PUT_LINE('   -> Angajat: ' || r_emp.last_name || ' | Salariu: ' || r_emp.salary);
        END LOOP;

    END LOOP;
END;
/


--d
DECLARE
    CURSOR c_complex IS
        SELECT j.job_title,
               CURSOR(SELECT e.last_name, e.salary
                      FROM employees e
                      WHERE e.job_id = j.job_id) as angajati_cursor
        FROM jobs j
        ORDER BY j.job_title;

    v_job_title  jobs.job_title%TYPE;
    v_emps_ref   SYS_REFCURSOR;
    v_name       employees.last_name%TYPE;
    v_salary     employees.salary%TYPE;
BEGIN
    OPEN c_complex;
    LOOP
        FETCH c_complex INTO v_job_title, v_emps_ref;
        EXIT WHEN c_complex%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('JOB: ' || v_job_title);

        LOOP
            FETCH v_emps_ref INTO v_name, v_salary;
            EXIT WHEN v_emps_ref%NOTFOUND;

            DBMS_OUTPUT.PUT_LINE(' - Angajat: ' || v_name || ' | Salariu: ' || v_salary);
        END LOOP;

        IF v_emps_ref%ROWCOUNT = 0 THEN
             DBMS_OUTPUT.PUT_LINE(' - Niciun angajat');
        END IF;

    END LOOP;
    CLOSE c_complex;
END;
/

--ex 12
DECLARE
    TYPE empref IS REF CURSOR;
    v_emp empref;
    v_nr  INTEGER := &n;

    v_id   employees.employee_id%TYPE;
    v_nume employees.last_name%TYPE;
    v_sal  employees.salary%TYPE;
    v_comm employees.commission_pct%TYPE;
BEGIN
    OPEN v_emp FOR
    'SELECT employee_id, last_name, salary, commission_pct ' ||
    'FROM employees WHERE salary > :bind_var'
    USING v_nr;

    LOOP
        FETCH v_emp INTO v_id, v_nume, v_sal, v_comm;
        EXIT WHEN v_emp%NOTFOUND;

        IF v_comm IS NULL THEN
            DBMS_OUTPUT.PUT_LINE('Angajat: ' || v_nume || ' | Salariu: ' || v_sal);
        ELSE
            DBMS_OUTPUT.PUT_LINE('Angajat: ' || v_nume || ' | Salariu: ' || v_sal || ' | Comision: ' || v_comm);
        END IF;

    END LOOP;
    CLOSE v_emp;

END;
/


--pl/sql4
CREATE OR REPLACE FUNCTION salariu_mediu_caf (p_job_id IN emp_caf.job_id%TYPE)
   RETURN NUMBER IS
   v_medie NUMBER;
BEGIN

   SELECT AVG(salary)
   INTO v_medie
   FROM emp_caf
   WHERE job_id = p_job_id;

   IF v_medie IS NULL THEN
       RAISE NO_DATA_FOUND;
   END IF;

   RETURN v_medie;

EXCEPTION
   WHEN NO_DATA_FOUND THEN
       DBMS_OUTPUT.PUT_LINE('Nu exista date pentru jobul: ' || p_job_id);
       RETURN 0;
END;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE('Rezultat: ' || salariu_mediu_caf('JOB_INEXISTENT'));
END;
/

--tema e3 si ceva similar cu e3/e4
--tema
--E2. Modificați exercițiul anterior astfel încât să obțineți și următoarele informații:
--un număr de ordine pentru fiecare angajat care va fi resetat pentru fiecare job
-- pentru fiecare job
--  o numărul de angajați
--  o valoarea lunară a veniturilor angajaților
--  o valoarea medie a veniturilor angajaților
-- indiferent job
--  o numărul total de angajați
--  o valoarea totală lunară a veniturilor angajaților
--  o valoarea medie a veniturilor angajaților


DECLARE
  CURSOR c_jobs IS
    SELECT job_id, job_title
    FROM JOBS;

  CURSOR c_emp(p_job_id VARCHAR2) IS
    SELECT last_name, salary
    FROM EMP_CAF
    WHERE p_job_id=job_id;

    v_nr_crt  NUMBER := 0;
    v_nr_emp NUMBER := 0;
    v_suma NUMBER := 0;
    v_medie NUMBER := 0;

    v_total_emp NUMBER := 0;
    v_total_suma NUMBER := 0;
    v_total_medie NUMBER := 0;

BEGIN
    FOR i IN c_jobs LOOP
        v_nr_crt :=0;
        v_nr_emp := 0;
        v_suma := 0;

        DBMS_OUTPUT.PUT_LINE('--------');
        DBMS_OUTPUT.PUT_LINE('JOB: ' || i.job_title);

        FOR j in c_emp(i.job_id) LOOP
            v_nr_crt := v_nr_crt + 1;
            v_nr_emp := v_nr_emp + 1;
            v_suma := v_suma + j.salary;

            DBMS_OUTPUT.PUT_LINE(v_nr_crt || '. ' || j.last_name || ', Salariu: ' || j.salary);

            EXIT WHEN c_emp%NOTFOUND;
        END LOOP;

        v_total_emp := v_total_emp + v_nr_emp;
        v_total_suma := v_total_suma + v_suma;

        IF v_nr_emp >0 THEN
             v_medie := ROUND(v_suma/v_nr_emp, 2);
        DBMS_OUTPUT.PUT_LINE('Statistici Job:');
        DBMS_OUTPUT.PUT_LINE('Nr. Angajati: ' || v_nr_emp);
        DBMS_OUTPUT.PUT_LINE('Total Salarii: ' || v_suma);
        DBMS_OUTPUT.PUT_LINE('Medie Salarii: ' || v_medie);

        ELSE
            DBMS_OUTPUT.PUT_LINE('Nu exista angajati');
        END IF;

        EXIT WHEN c_jobs%NOTFOUND;
    END LOOP;

     IF v_total_emp >0 THEN
             v_total_medie := ROUND(v_total_suma/v_total_emp, 2);
        DBMS_OUTPUT.PUT_LINE('--------:');
        DBMS_OUTPUT.PUT_LINE('Statistici GLOBALE:');
        DBMS_OUTPUT.PUT_LINE('Nr. Angajati TOTAL: ' || v_total_emp);
        DBMS_OUTPUT.PUT_LINE('Total Salarii: ' || v_total_suma);
        DBMS_OUTPUT.PUT_LINE('Medie Salarii TOTAL: ' || v_total_medie);

     ELSE
            DBMS_OUTPUT.PUT_LINE('Nu exista angajati');
    END IF;

END;

--E3. Modificați exercițiul anterior astfel încât să obțineți suma totală alocată lunar pentru plata
-- salariilor și a comisioanelor tuturor angajaților, iar pentru fiecare angajat cât la sută din această
-- sumă câștigă lunar.(pe ex 10)

--a)cele trei tipuri de cursoare studiate;
--cursor clasic
DECLARE
    CURSOR c_dep IS
        SELECT department_id, department_name
        FROM   departments
        WHERE department_id IN (10,20,30,40);

    CURSOR c_emp(p_dep_id VARCHAR2) IS
        SELECT last_name, salary, commission_pct
        FROM EMP_CAF
        WHERE  department_id = p_dep_id;

    v_dep_id EMP_CAF.department_id%TYPE;
    v_dep_name  DEPARTMENTS.department_name%TYPE;

    v_emp_name EMP_CAF.last_name%TYPE;
    v_emp_sal  EMP_CAF.salary%TYPE;
    v_emp_comm  EMP_CAF.commission_pct%TYPE;

    v_total NUMBER := 0;
    v_angajat NUMBER := 0;
    v_procent NUMBER := 0;


BEGIN
    SELECT SUM(salary + (salary * NVL(commission_pct, 0)))
    INTO v_total
    FROM EMP_CAF;

    DBMS_OUTPUT.PUT_LINE('Total Salarii + Comisioane in Firma: ' || v_total);

    OPEN c_dep;
    LOOP
        FETCH c_dep INTO v_dep_id, v_dep_name;
        EXIT WHEN c_dep%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('-------------------------------------');
        DBMS_OUTPUT.PUT_LINE ('DEPARTAMENT '|| v_dep_name);
        DBMS_OUTPUT.PUT_LINE('-------------------------------------');

        OPEN c_emp(v_dep_id);
        LOOP
            FETCH c_emp INTO v_emp_name, v_emp_sal, v_emp_comm;
            EXIT WHEN c_emp%NOTFOUND;

            v_angajat := v_emp_sal + (v_emp_sal * NVL(v_emp_comm, 0)) ;

            IF v_total > 0 THEN
                v_procent := (v_angajat / v_total) * 100;
            ELSE
                v_procent := 0;
            END IF;

            DBMS_OUTPUT.PUT_LINE('Angajat: ' || v_emp_name ||
                                 ' | Venit: ' || v_angajat ||
                                 ' | % din Total: ' || ROUND(v_procent, 4) || '%');
        END LOOP;
        CLOSE c_emp;

    END LOOP;
    CLOSE c_dep;

    END;
/


--ciclu cursor
    DECLARE
    CURSOR c_dep IS
        SELECT department_id, department_name
        FROM   departments
        WHERE department_id IN (10,20,30,40);

    CURSOR c_emp(p_dep_id VARCHAR2) IS
        SELECT last_name, salary, commission_pct
        FROM EMP_CAF
        WHERE  department_id = p_dep_id;

    v_total NUMBER := 0;
    v_angajat NUMBER := 0;
    v_procent NUMBER := 0;


BEGIN
    SELECT SUM(salary + (salary * NVL(commission_pct, 0)))
    INTO v_total
    FROM EMP_CAF;

    DBMS_OUTPUT.PUT_LINE('Total Salarii + Comisioane in Firma: ' || v_total);


  FOR i in c_dep LOOP
        EXIT WHEN c_dep%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('-------------------------------------');
        DBMS_OUTPUT.PUT_LINE ('DEPARTAMENT '|| i.department_id);
        DBMS_OUTPUT.PUT_LINE('-------------------------------------');


        FOR j IN c_emp(i.department_id) LOOP
            EXIT WHEN c_emp%NOTFOUND;

            v_angajat := j.salary + (j.salary * NVL(j.commission_pct, 0)) ;

            IF v_total > 0 THEN
                v_procent := (v_angajat / v_total) * 100;
            ELSE
                v_procent := 0;
            END IF;

            DBMS_OUTPUT.PUT_LINE('Angajat: ' || j.last_name ||
                                 ' | Venit: ' || v_angajat ||
                                 ' | % din Total: ' || ROUND(v_procent, 4) || '%');
        END LOOP;

    END LOOP;

    END;
/



-- ciclu cursor cu subcereri
DECLARE
    v_total_global NUMBER := 0;
    v_venit_emp    NUMBER := 0;
    v_procent      NUMBER(5, 2);
BEGIN
    SELECT SUM(salary + (salary * NVL(commission_pct, 0))) INTO v_total_global FROM EMP_CAF;
    DBMS_OUTPUT.PUT_LINE('TOTAL VENITURI FIRMA: ' || v_total_global);

    FOR r_job IN (SELECT job_id, job_title FROM JOBS ORDER BY job_title) LOOP

        DBMS_OUTPUT.PUT_LINE('JOB: ' || r_job.job_title);
        DBMS_OUTPUT.PUT_LINE('------------------------------------');


        FOR r_emp IN (SELECT last_name, salary, commission_pct
                      FROM EMP_CAF
                      WHERE job_id = r_job.job_id
                      ORDER BY salary DESC) LOOP

            v_venit_emp := r_emp.salary + (r_emp.salary * NVL(r_emp.commission_pct, 0));
            v_procent := (v_venit_emp / v_total_global) * 100;

            DBMS_OUTPUT.PUT_LINE('   -> ' || RPAD(r_emp.last_name, 15) ||
                                 ' | Venit: ' || v_venit_emp ||
                                 ' | Procent: ' || v_procent || '%');
        END LOOP;
        DBMS_OUTPUT.PUT_LINE('');
    END LOOP;
END;
/

-- --tema 8
-- --e1
CREATE TABLE info_CAF(
    utilizator VARCHAR2(50),
    data DATE,
    comanda VARCHAR2(50),
    nr_linii NUMBER,
    eroare VARCHAR(255)
);


--e3
SELECT *
FROM EMPLOYEES;

CREATE OR REPLACE FUNCTION fe3_CAF
    (v_oras VARCHAR2)
RETURN NUMBER
IS
    v_numar_angajati NUMBER := 0;
    v_numar_locatii NUMBER := 0;
    v_numar_joburi NUMBER := 0;

BEGIN
    SELECT COUNT(*)
    INTO v_numar_locatii
    FROM LOCATIONS
    WHERE UPPER(city) = UPPER(v_oras);

    IF v_numar_locatii = 0 THEN
        INSERT INTO info_CAF (utilizator, data, comanda, nr_linii, eroare)
        VALUES (USER, SYSDATE, 'fe3_CAF', 0, 'EROARE: Orasul ' || v_oras || ' nu exista in baza de date.');
        COMMIT;
        RETURN 0;

    END IF ;

    SELECT COUNT(DISTINCT e.employee_id)
    INTO v_numar_angajati
    FROM EMPLOYEES e
    JOIN DEPARTMENTS d ON d.department_id=e.department_id
    JOIN LOCATIONS L ON l.location_id=d.location_id
    WHERE UPPER(l.city) = UPPER(v_oras) AND
          e.employee_id IN (
                SELECT employee_id
                FROM JOB_HISTORY
                GROUP BY employee_id
                HAVING COUNT(DISTINCT job_id) >= 2
              );

    IF v_numar_angajati = 0 THEN
        INSERT INTO info_CAF (utilizator, data, comanda, nr_linii, eroare)
        VALUES (USER, SYSDATE, 'fe3_CAF', 0, 'ZERO: Orasul exista, dar niciun angajat nu indeplineste criteriile.');
    ELSE
        INSERT INTO info_CAF (utilizator, data, comanda, nr_linii, eroare)
        VALUES (USER, SYSDATE, 'fe3_CAF', v_numar_angajati , 'Au fost gasiti ' || v_numar_angajati  || ' angajati.');
    END IF;

    COMMIT;
    RETURN v_numar_angajati;

END fe3_CAF;

DECLARE
    v_rezultat NUMBER;
    v_oras_cautat VARCHAR2(50) := 'Seattle';
BEGIN
    v_rezultat := fe3_CAF(v_oras_cautat);

    DBMS_OUTPUT.PUT_LINE('Oras cautat: ' || v_oras_cautat);
    DBMS_OUTPUT.PUT_LINE('Numar angajati gasiti: ' || v_rezultat);

END;

SELECT *
FROM info_CAF;


--e4
CREATE OR REPLACE PROCEDURE fe4_CAF
    (v_id_manager EMPLOYEES.manager_id%TYPE)
IS
    v_nr_manageri NUMBER := 0;
    v_randuri_modif NUMBER := 0;

BEGIN
    SELECT COUNT(*)
    INTO v_nr_manageri
    FROM EMPLOYEES
    WHERE manager_id = v_id_manager;

    IF v_nr_manageri = 0 THEN
        INSERT INTO info_CAF (utilizator, data, comanda, nr_linii, eroare)
        VALUES (USER, SYSDATE, 'fe4_CAF', 0, 'EROARE: Managerul cu ID ' || v_id_manager || ' nu exista.');
        COMMIT;
    END IF;

    UPDATE EMP_CAF e
    SET e.salary=e.salary+0.10*e.salary
    WHERE e.employee_id IN(
        SELECT employee_id
        FROM EMPLOYEES
        START WITH manager_id = v_id_manager
        CONNECT BY PRIOR employee_id = manager_id
        );

    v_randuri_modif := SQL%ROWCOUNT;

    IF v_randuri_modif = 0 THEN
        INSERT INTO info_CAF (utilizator, data, comanda, nr_linii, eroare)
        VALUES (USER, SYSDATE, 'fe4_CAF', 0, 'ZERO: Managerul ' || v_id_manager || ' nu are subordonati (salariu nemodificat).');
    ELSE
        INSERT INTO info_CAF (utilizator, data, comanda, nr_linii, eroare)
        VALUES (USER, SYSDATE, 'fe4_CAF', v_randuri_modif, 'SUCCES: S-au marit salariile pentru ' || v_randuri_modif || ' subordonati.');
    END IF;

    COMMIT;

END fe4_CAF;



SELECT *
FROM EMP_CAF;



DECLARE
    v_manager EMPLOYEES.manager_id%TYPE := 100;
BEGIN
    FE4_CAF(v_manager);
    DBMS_OUTPUT.PUT_LINE('Procedura executata cu succes pentru managerul: ' || v_manager);
END;

SELECT *
FROM EMP_CAF;




--tema 9
--E1
CREATE OR REPLACE PACKAGE pachet_angajati_CAF AS
    --f
    CURSOR c_angajati_job(p_job JOBS.job_id%TYPE)
        RETURN EMPLOYEES%ROWTYPE IS
    SELECT *
    FROM EMPLOYEES
    WHERE job_id = p_job;

    --g
    CURSOR c_joburi
        RETURN JOBS%ROWTYPE IS
    SELECT *
    FROM JOBS;


    --a
    FUNCTION f_sal_min(v_dep_id  DEPARTMENTS.department_id%TYPE, v_job JOBS.job_id%TYPE)
        RETURN EMPLOYEES.salary%TYPE;

    FUNCTION f_id_manager(v_nume EMPLOYEES.last_name%TYPE, v_prenume EMPLOYEES.first_name%TYPE)
        RETURN EMPLOYEES.employee_id%TYPE;

    FUNCTION f_id_dep(v_nume_dep DEPARTMENTS.department_name%TYPE)
        RETURN DEPARTMENTS.department_id%TYPE;

    FUNCTION f_job_id(v_nume_job JOBS.job_title%TYPE)
        RETURN JOBS.job_id%TYPE;

    PROCEDURE adauga_angajat(
        p_nume EMPLOYEES.last_name%TYPE,
        p_prenume EMPLOYEES.first_name%TYPE,
        p_telefon EMPLOYEES.phone_number%TYPE,
        p_email EMPLOYEES.email%TYPE,
        p_nume_mgr EMPLOYEES.last_name%TYPE,
        p_prenume_mgr EMPLOYEES.first_name%TYPE,
        p_dep_name DEPARTMENTS.department_name%TYPE,
        p_job_name JOBS.job_title%TYPE
    );

    --b
    PROCEDURE muta_angajat(
        p_nume EMPLOYEES.last_name%TYPE,
        p_prenume EMPLOYEES.first_name%TYPE,
        p_dep_nou DEPARTMENTS.department_name%TYPE,
        p_job_nou JOBS.job_title%TYPE,
        p_nume_mgr EMPLOYEES.last_name%TYPE,
        p_prenume_mgr EMPLOYEES.first_name%TYPE
    );


    --e
    PROCEDURE update_salariu(
        p_nume EMPLOYEES.last_name%TYPE,
        p_salariu NUMBER
    );

END pachet_angajati_CAF;
/


CREATE OR REPLACE PACKAGE BODY pachet_angajati_CAF AS
    --a
     FUNCTION f_sal_min(v_dep_id  DEPARTMENTS.department_id%TYPE, v_job JOBS.job_id%TYPE)
     RETURN EMPLOYEES.salary%TYPE IS
         v_sal EMPLOYEES.salary%TYPE;
     BEGIN
         SELECT MIN(salary)
         INTO v_sal
         FROM EMPLOYEES
         WHERE v_dep_id = department_id
            AND v_job = job_id;
         RETURN v_sal;
    END;

    FUNCTION f_id_manager(v_nume EMPLOYEES.last_name%TYPE, v_prenume EMPLOYEES.first_name%TYPE)
    RETURN EMPLOYEES.employee_id%TYPE IS
        v_id EMPLOYEES.employee_id%TYPE;
    BEGIN
        SELECT employee_id
        INTO v_id
        FROM EMPLOYEES
        WHERE last_name = v_nume
        AND first_name = v_prenume;

    RETURN v_id;
    END;

    FUNCTION f_id_dep(v_nume_dep DEPARTMENTS.department_name%TYPE)
    RETURN DEPARTMENTS.department_id%TYPE IS
        v_id DEPARTMENTS.department_id%TYPE;
    BEGIN
        SELECT department_id
        INTO v_id
        FROM DEPARTMENTS
        WHERE department_name = v_nume_dep;

    RETURN v_id;
    END;

    FUNCTION f_job_id(v_nume_job JOBS.job_title%TYPE)
    RETURN JOBS.job_id%TYPE IS
        v_id JOBS.job_id%TYPE;
    BEGIN
        SELECT job_id
        INTO v_id
        FROM JOBS
        WHERE job_title = v_nume_job;

    RETURN v_id;
    END;

    PROCEDURE adauga_angajat(
    p_nume EMPLOYEES.last_name%TYPE,
    p_prenume EMPLOYEES.first_name%TYPE,
    p_telefon EMPLOYEES.phone_number%TYPE,
    p_email EMPLOYEES.email%TYPE,
    p_nume_mgr EMPLOYEES.last_name%TYPE,
    p_prenume_mgr EMPLOYEES.first_name%TYPE,
    p_dep_name DEPARTMENTS.department_name%TYPE,
    p_job_name JOBS.job_title%TYPE
    ) IS
        v_mgr EMPLOYEES.employee_id%TYPE;
        v_dep DEPARTMENTS.department_id%TYPE;
        v_job JOBS.job_id%TYPE;
        v_sal EMPLOYEES.salary%TYPE;
    BEGIN
        v_mgr := f_id_manager(p_nume_mgr, p_prenume_mgr);
        v_dep := f_id_dep(p_dep_name);
        v_job := f_job_id(p_job_name);
        v_sal := f_sal_min(v_dep, v_job);

    INSERT INTO EMPLOYEES
    VALUES (
        employees_seq.NEXTVAL,
        p_prenume,
        p_nume,
        p_email,
        p_telefon,
        SYSDATE,
        v_job,
        v_sal,
        NULL,
        v_mgr,
        v_dep
    );
    END;

    --b
    PROCEDURE muta_angajat(
        p_nume EMPLOYEES.last_name%TYPE,
        p_prenume EMPLOYEES.first_name%TYPE,
        p_dep_nou DEPARTMENTS.department_name%TYPE,
        p_job_nou JOBS.job_title%TYPE,
        p_nume_mgr EMPLOYEES.last_name%TYPE,
        p_prenume_mgr EMPLOYEES.first_name%TYPE
    ) IS
        v_id EMPLOYEES.employee_id%TYPE;
        v_dep DEPARTMENTS.department_id%TYPE;
        v_job JOBS.job_id%TYPE;
        v_mgr EMPLOYEES.employee_id%TYPE;
        v_sal_cur EMPLOYEES.salary%TYPE;
        v_sal_min EMPLOYEES.salary%TYPE;
    BEGIN
        SELECT employee_id, salary
        INTO v_id, v_sal_cur
        FROM EMPLOYEES
        WHERE last_name = p_nume
          AND first_name = p_prenume;

        v_dep := f_id_dep(p_dep_nou);
        v_job := f_job_id(p_job_nou);
        v_mgr := f_id_manager(p_nume_mgr, p_prenume_mgr);
        v_sal_min := f_sal_min(v_dep, v_job);

        INSERT INTO JOB_HISTORY
        VALUES (v_id, SYSDATE, SYSDATE, v_job, v_dep);

        UPDATE EMPLOYEES
        SET department_id = v_dep,
            job_id = v_job,
            manager_id = v_mgr,
            salary = GREATEST(v_sal_cur, v_sal_min),
            hire_date = SYSDATE
        WHERE employee_id = v_id;
    END;

    --e
    PROCEDURE update_salariu(
        p_nume EMPLOYEES.last_name%TYPE,
        p_salariu NUMBER
    ) IS
        v_count NUMBER;
        v_job JOBS.job_id%TYPE;
        v_min JOBS.min_salary%TYPE;
        v_max JOBS.max_salary%TYPE;
    BEGIN
        SELECT COUNT(*)
        INTO v_count
        FROM EMPLOYEES
        WHERE last_name = p_nume;

        IF v_count = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Nu exista angajat cu acest nume');

        ELSIF v_count > 1 THEN
            DBMS_OUTPUT.PUT_LINE('Exista mai multi angajati cu acest nume');
            FOR e IN (SELECT first_name, salary
                      FROM EMPLOYEES
                      WHERE last_name = p_nume) LOOP
                DBMS_OUTPUT.PUT_LINE(e.first_name || ' ' || e.salary);
            END LOOP;

        ELSE
            SELECT job_id
            INTO v_job
            FROM EMPLOYEES
            WHERE last_name = p_nume;

            SELECT min_salary, max_salary
            INTO v_min, v_max
            FROM JOBS
            WHERE job_id = v_job;

            IF p_salariu BETWEEN v_min AND v_max THEN
                UPDATE EMPLOYEES
                SET salary = p_salariu
                WHERE last_name = p_nume;
            ELSE
                DBMS_OUTPUT.PUT_LINE('Salariul nu respecta limitele jobului');
            END IF;
        END IF;
    END;

END pachet_angajati_CAF;



--a
BEGIN
  pachet_angajati_CAF.adauga_angajat(
    p_nume        => 'Popescu',
    p_prenume     => 'Ion',
    p_telefon     => '0712345678',
    p_email       => 'IPOPESCU',
    p_nume_mgr    => 'King',
    p_prenume_mgr => 'Steven',
    p_dep_name    => 'Sales',
    p_job_name    => 'Sales Representative'
  );
END;
/

SELECT last_name, department_id, job_id, salary
FROM EMPLOYEES
WHERE last_name = 'Popescu';


--b
BEGIN
  pachet_angajati_CAF.muta_angajat(
    p_nume        => 'Popescu',
    p_prenume     => 'Ion',
    p_dep_nou     => 'IT',
    p_job_nou     => 'Programmer',
    p_nume_mgr    => 'Hunold',
    p_prenume_mgr => 'Alexander'
  );
END;
/
SELECT department_id, job_id, manager_id, salary
FROM EMPLOYEES
WHERE last_name = 'Popescu';


--e
BEGIN
  pachet_angajati_CAF.update_salariu('Popescu', 9000);
END;
/
SELECT last_name, salary
FROM EMPLOYEES
WHERE last_name = 'Popescu';


--f
DECLARE
    v_emp EMPLOYEES%ROWTYPE;
BEGIN
    OPEN pachet_angajati_CAF.c_angajati_job('IT_PROG');

    LOOP
        FETCH pachet_angajati_CAF.c_angajati_job INTO v_emp;
        EXIT WHEN pachet_angajati_CAF.c_angajati_job%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(
            v_emp.last_name || ' ' ||
            v_emp.first_name || ' | Salariu: ' ||
            v_emp.salary
        );
    END LOOP;

    CLOSE pachet_angajati_CAF.c_angajati_job;
END;
/



--g
DECLARE
  v_job JOBS%ROWTYPE;
BEGIN
  OPEN pachet_angajati_CAF.c_joburi;
  LOOP
    FETCH pachet_angajati_CAF.c_joburi INTO v_job;
    EXIT WHEN pachet_angajati_CAF.c_joburi%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE(v_job.job_id || ' - ' || v_job.job_title);
  END LOOP;
  CLOSE pachet_angajati_CAF.c_joburi;
END;
/


--lab10
--1
CREATE OR REPLACE TRIGGER trig_insert_restrict
BEFORE INSERT ON EMP_CAF
DECLARE
BEGIN

    IF TO_CHAR(SYSDATE, 'HH24') > 18 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Inserarea de noi angajati nu este permisa dupa ora 18:00.');
    END IF;
END;
/

--2
CREATE OR REPLACE TRIGGER trig_comm_not_negative
BEFORE UPDATE OF commission_pct ON EMP_CAF
FOR EACH ROW
BEGIN
     IF :NEW.commission_pct < 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Valoarea comisionului (commission_pct) nu poate fi negativa.');
    END IF;
END;
/

--3
CREATE OR REPLACE TRIGGER trig_check_salary_limits
BEFORE INSERT OR UPDATE OF salary ON EMP_cAF
FOR EACH ROW
DECLARE
    v_min_sal jobs.min_salary%TYPE;
    v_max_sal jobs.max_salary%TYPE;
BEGIN
    SELECT min_salary, max_salary
    INTO v_min_sal, v_max_sal
    FROM jobs
    WHERE job_id = :NEW.job_id;

    IF :NEW.salary < v_min_sal THEN
        RAISE_APPLICATION_ERROR(-20007,
            'Salariul (' || :NEW.salary || ') este sub limita minima (' || v_min_sal || ') pentru job-ul ' || :NEW.job_id);
    END IF;

    IF :NEW.salary > v_max_sal THEN
        RAISE_APPLICATION_ERROR(-20008,
            'Salariul (' || :NEW.salary || ') depaseste limita maxima (' || v_max_sal || ') pentru job-ul ' || :NEW.job_id);
    END IF;

END;
/



--tema
--e2,e3, din lab trecut



--lab11
--e4


CREATE OR REPLACE TRIGGER trig_e4_CAF
    AFTER INSERT OR UPDATE OF department_id ON EMP_CAF
DECLARE
    CURSOR c_verificare IS
        SELECT department_id, COUNT(*) as nr_angajati
        FROM EMP_CAF
        GROUP BY department_id
        HAVING COUNT(*) > 45;
BEGIN
    FOR r IN c_verificare LOOP
        RAISE_APPLICATION_ERROR(-20001,
            'Eroare: Departamentul cu ID-ul ' || r.department_id ||
            ' a depășit limita de 45 de angajați. (Total curent: ' || r.nr_angajati || ')');
    END LOOP;
END;
/

UPDATE EMP_CAF
SET department_id = 50
WHERE 1=1;



--E5
create table emp_test_CAF
    as select employee_id, first_name, last_name, department_id from employees;
alter table emp_test_CAF
    add constraint pk_emp_test_ari primary key (employee_id);

create table dept_test_CAF
    as select department_id, department_name from departments;
alter table dept_test_CAF
    add constraint pk_dept_test_ari primary key (department_id);



CREATE OR REPLACE TRIGGER trg_cascada_CAF
    AFTER DELETE OR UPDATE OF department_id ON dept_test_CAF
    FOR EACH ROW
BEGIN
    IF DELETING THEN
        DELETE FROM emp_test_CAF
        WHERE department_id = :OLD.department_id;

    ELSIF UPDATING THEN
        UPDATE emp_test_CAF
        SET department_id = :NEW.department_id
        WHERE department_id = :OLD.department_id;
    END IF;
END;
/

--VERIF
SELECT * FROM emp_test_CAF WHERE department_id = 10;

UPDATE dept_test_CAF
SET department_id = 15
WHERE department_id = 10;

SELECT * FROM emp_test_CAF WHERE department_id = 15;


DELETE FROM dept_test_CAF WHERE department_id = 20;

SELECT * FROM emp_test_CAF WHERE department_id = 20;

