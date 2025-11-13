SET SERVEROUTPUT ON;

--1.Record VS Object
--record
DECLARE
  TYPE R_TIP_CLIENT IS RECORD (
      client_id     CLASIFIC_CLIENTI_CAF.ID_CLIENT%TYPE,
      id_categorie  CLASIFIC_CLIENTI_CAF.ID_CATEGORIE%TYPE,
      nr_produse    CLASIFIC_CLIENTI_CAF.NR_PRODUSE%TYPE
  );
  rec_client R_TIP_CLIENT;

  v_id_cautat CONSTANT NUMBER := 209;
  v_discount NUMBER;

BEGIN
   SELECT ID_CLIENT, ID_CATEGORIE, NR_PRODUSE
   INTO rec_client.client_id, rec_client.id_categorie, rec_client.nr_produse
   FROM CLASIFIC_CLIENTI_CAF
   WHERE ID_CLIENT = v_id_cautat;

   DBMS_OUTPUT.PUT_LINE('Client ID: ' || rec_client.client_id);
   DBMS_OUTPUT.PUT_LINE('Numar Produse: ' || rec_client.nr_produse);

   -- logica de prelucrare trebuie să fie scrisă SEPARAT
   IF rec_client.nr_produse >= 1  THEN
        v_discount := 0.10;
   ELSE
        v_discount := 0.00;
   END IF;

   DBMS_OUTPUT.PUT_LINE('Discount calculat: ' || (v_discount * 100) || '%');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Clientul cu ID ' || v_id_cautat || ' nu a fost gasit.');
END;
/



--obj
--tipul de obiect (Structura + Semnatura Metodei)
CREATE TYPE T_CLIENT_OBJ AS OBJECT (
    client_id    NUMBER(4),
    nr_produse   NUMBER,

    -- metoda inclusa in obiect
    MEMBER FUNCTION calculeaza_discount RETURN NUMBER
);
/

--implementare
CREATE TYPE BODY T_CLIENT_OBJ AS
    MEMBER FUNCTION calculeaza_discount RETURN NUMBER IS
    BEGIN
        IF SELF.nr_produse > 2 THEN
            RETURN 0.10;
        ELSE
            RETURN 0.00;
        END IF;
    END;
END;
/



--implementare

DECLARE
    --record-ul
    TYPE R_TIP_CLIENT IS RECORD (
        client_id    CLASIFIC_CLIENTI_CAF.ID_CLIENT%TYPE,
        nr_produse   CLASIFIC_CLIENTI_CAF.NR_PRODUSE%TYPE
    );
    rec_client R_TIP_CLIENT;

    --obiectul
    obj_client T_CLIENT_OBJ;

    v_id_cautat CONSTANT NUMBER := 209;
    v_discount_record NUMBER;

BEGIN
    SELECT ID_CLIENT, NR_PRODUSE
    INTO rec_client.client_id, rec_client.nr_produse
    FROM CLASIFIC_CLIENTI_CAF
    WHERE ID_CLIENT = v_id_cautat;

    IF rec_client.nr_produse >= 1 THEN
        v_discount_record := 0.10;
    ELSE
        v_discount_record := 0.00;
    END IF;

    DBMS_OUTPUT.PUT_LINE('RECORD');
    DBMS_OUTPUT.PUT_LINE('Nr. Produse (R): ' || rec_client.nr_produse);
    DBMS_OUTPUT.PUT_LINE('Discount calculat procedural: ' || (v_discount_record * 100) || '%');


    -- initializare obj cu aceleasi date
    obj_client := T_CLIENT_OBJ(
        client_id  => rec_client.client_id,
        nr_produse => rec_client.nr_produse
    );

    DBMS_OUTPUT.PUT_LINE('OBIECT');
    DBMS_OUTPUT.PUT_LINE('Nr. Produse (O): ' || obj_client.nr_produse);

    DBMS_OUTPUT.PUT_LINE('Discount apelat prin METODA: ' || obj_client.calculeaza_discount() * 100 || '%');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Clientul cu ID ' || v_id_cautat || ' nu a fost gasit.');
END;
/

--2.
 CREATE TYPE T_NESTED_TABLE_TYPE AS TABLE OF NUMBER;
 /
 CREATE TYPE T_VARRAY_TYPE AS VARRAY(50000) OF NUMBER;
 /


DECLARE
    --Tablou Indexat (Associative Array)
    TYPE t_assoc_array_type IS TABLE OF NUMBER INDEX BY PLS_INTEGER;
    assoc_array t_assoc_array_type;

    --Tabela Imbricata (Nested Table)
    nested_table T_NESTED_TABLE_TYPE := T_NESTED_TABLE_TYPE();

    --Varray (Vector)
    varray_collection T_VARRAY_TYPE := T_VARRAY_TYPE();

    start_time PLS_INTEGER;
    end_time PLS_INTEGER;

    NUM_RECORDS CONSTANT PLS_INTEGER := 50000;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Comparatie Performanta Colectii (' || NUM_RECORDS || ' Inregistrari)');

    --Tablou Indexat (Associative Array)
    start_time := DBMS_UTILITY.GET_TIME;
    FOR i IN 1..NUM_RECORDS LOOP
        assoc_array(i) := i;
    END LOOP;
    end_time := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('1. Tablou Indexat Timp: ' || (end_time - start_time) || ' centisecunde');

    --Tabela Imbricata (Nested Table)
    nested_table.EXTEND(NUM_RECORDS);
    start_time := DBMS_UTILITY.GET_TIME;
    FOR i IN 1..NUM_RECORDS LOOP
        nested_table(i) := i;
    END LOOP;
    end_time := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('2. Tabela Imbricata Timp: ' || (end_time - start_time) || ' centisecunde');

    --Varray (Vector)
    varray_collection.EXTEND(NUM_RECORDS);
    start_time := DBMS_UTILITY.GET_TIME;
    FOR i IN 1..NUM_RECORDS LOOP
        varray_collection(i) := i;
    END LOOP;
    end_time := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('3. Vector (Varray) Timp: ' || (end_time - start_time) || ' centisecunde');

END;
/

--3.
CREATE TYPE tip_orase_CAF AS TABLE OF VARCHAR2(50);
/

CREATE TABLE excursie_CAF (
    cod_excursie NUMBER(4) PRIMARY KEY,
    denumire VARCHAR2(50),
    orase tip_orase_CAF, -- tabela Imbricată
    status VARCHAR2(20) DEFAULT 'disponibilă'
)

NESTED TABLE orase STORE AS orase_nt_tab;
/

--a
BEGIN
    INSERT INTO excursie_CAF VALUES (101, 'Circuit Capital Europene', tip_orase_CAF('Paris', 'Berlin', 'Roma', 'Viena'), 'disponibilă');
    INSERT INTO excursie_CAF VALUES (102, 'Riviera Italiana', tip_orase_CAF('Milano', 'Genova'), 'disponibilă');
    INSERT INTO excursie_CAF VALUES (103, 'Suedia & Norvegia', tip_orase_CAF('Stockholm', 'Oslo', 'Bergen'), 'disponibilă');
    INSERT INTO excursie_CAF VALUES (104, 'Excursie Anulata', tip_orase_CAF('Dublin', 'Cork'), 'anulată');
    INSERT INTO excursie_CAF VALUES (105, 'Turul Spaniei', tip_orase_CAF('Madrid', 'Barcelona', 'Sevilla'), 'disponibilă');

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('a. Inserare 5 înregistrări finalizată.');
END;
/

--b
DECLARE
    v_cod_excursie CONSTANT NUMBER := 101;
    v_orase tip_orase_CAF;

    v_oras_final VARCHAR2(50) := 'Lisabona';
    v_oras_al_doilea VARCHAR2(50) := 'Barcelona';
    v_oras_schimb1 VARCHAR2(50) := 'Roma';
    v_oras_schimb2 VARCHAR2(50) := 'Viena';
    v_oras_de_sters VARCHAR2(50) := 'Berlin';
    i_schimb NUMBER;
    j_schimb NUMBER;

BEGIN
    SELECT orase INTO v_orase
    FROM excursie_CAF
    WHERE cod_excursie = v_cod_excursie
    FOR UPDATE;

    -- Op 1: oraș nou în listă (ULTIMUL vizitat)
    v_orase.EXTEND;
    v_orase(v_orase.LAST) := v_oras_final;
    DBMS_OUTPUT.PUT_LINE('1. Adaugat la final: ' || v_oras_final);

    -- Op 2: oraș nou în listă (AL DOILEA oraș vizitat)
    v_orase.EXTEND;
    FOR i IN REVERSE 2..v_orase.COUNT - 1 LOOP
        v_orase(i + 1) := v_orase(i);
    END LOOP;
    v_orase(2) := v_oras_al_doilea;
    DBMS_OUTPUT.PUT_LINE('2. Adaugat pe pozitia 2: ' || v_oras_al_doilea);

    -- Op 3: invers
    i_schimb := v_orase.FIRST;
    j_schimb := v_orase.LAST;

    WHILE i_schimb IS NOT NULL LOOP
        IF v_orase(i_schimb) = v_oras_schimb1 THEN
            WHILE j_schimb IS NOT NULL LOOP
                IF v_orase(j_schimb) = v_oras_schimb2 THEN
                    v_orase(i_schimb) := v_oras_schimb2;
                    v_orase(j_schimb) := v_oras_schimb1;
                    EXIT;
                END IF;
                j_schimb := v_orase.PRIOR(j_schimb);
            END LOOP;
            EXIT;
        END IF;
        i_schimb := v_orase.NEXT(i_schimb);
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('3. Inversat ' || v_oras_schimb1 || ' cu ' || v_oras_schimb2);

    -- Op 4: eliminare
    i_schimb := v_orase.FIRST;
    WHILE i_schimb IS NOT NULL LOOP
        IF v_orase(i_schimb) = v_oras_de_sters THEN
            v_orase.DELETE(i_schimb);
            DBMS_OUTPUT.PUT_LINE('4. Eliminat orașul: ' || v_oras_de_sters);
            EXIT;
        END IF;
        i_schimb := v_orase.NEXT(i_schimb);
    END LOOP;

    UPDATE excursie_CAF
    SET orase = v_orase
    WHERE cod_excursie = v_cod_excursie;

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('b. Actualizări finalizate pentru excursia 101.');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Eroare: Excursia ' || v_cod_excursie || ' nu a fost găsită.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Eroare necunoscuta: ' || SQLERRM);
        ROLLBACK;
END;
/

--c
DECLARE
    v_cod_excursie CONSTANT NUMBER := 105;
    v_numar_orase NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('c. Afisare detalii excursie specificata (' || v_cod_excursie || ')');

    SELECT COUNT(*)
    INTO v_numar_orase
    FROM TABLE(SELECT orase FROM excursie_CAF WHERE cod_excursie = v_cod_excursie);

    DBMS_OUTPUT.PUT_LINE('Numar orase vizitate: ' || v_numar_orase);
    DBMS_OUTPUT.PUT_LINE('Lista oraselor (in ordinea vizitarii):');

    FOR r IN (
        SELECT COLUMN_VALUE AS oras_vizitat
        FROM TABLE(SELECT orase FROM excursie_CAF WHERE cod_excursie = v_cod_excursie)
        ORDER BY ROWNUM
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('- ' || r.oras_vizitat);
    END LOOP;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Eroare: Excursia ' || v_cod_excursie || ' nu a fost găsită.');
END;
/

--d
DECLARE
    CURSOR c_excursii IS
        SELECT cod_excursie, denumire, orase
        FROM excursie_CAF;
BEGIN
    DBMS_OUTPUT.PUT_LINE('d. Afisare lista orase pentru fiecare excursie');

    FOR r_excursie IN c_excursii LOOP
        DBMS_OUTPUT.PUT_LINE('Excursia ' || r_excursie.cod_excursie || ' (' || r_excursie.denumire || '):');

        IF r_excursie.orase IS NOT NULL THEN
            FOR i IN 1..r_excursie.orase.COUNT LOOP
                IF r_excursie.orase.EXISTS(i) THEN
                    DBMS_OUTPUT.PUT_LINE('  ' || i || '. ' || r_excursie.orase(i));
                END IF;
            END LOOP;
        END IF;
    END LOOP;
END;
/




--e
DECLARE
    v_min_orase NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('e. Anulare Excursii cu Numar Minim de Orase');

    SELECT MIN(COUNT(t.cod_excursie))
    INTO v_min_orase
    FROM excursie_CAF t, TABLE(t.orase)
    WHERE t.status = 'disponibilă'
    GROUP BY t.cod_excursie;

    IF v_min_orase IS NULL THEN
        DBMS_OUTPUT.PUT_LINE('Nu exista excursii disponibile.');
        RETURN;
    END IF;

    DBMS_OUTPUT.PUT_LINE('Numarul minim de orase gasit: ' || v_min_orase);

    UPDATE excursie_CAF t1
    SET status = 'anulată'
    WHERE t1.status = 'disponibilă'
    AND v_min_orase = (
        SELECT COUNT(*)
        FROM TABLE(t1.orase)
    );

    DBMS_OUTPUT.PUT_LINE('Numar excursii anulate: ' || SQL%ROWCOUNT);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Eroare la anulare: ' || SQLERRM);
        ROLLBACK;
END;
/