--ex9.procedura cu 5 tabele si 2 exceptii personalizate - inserare factura
INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20005, 'Stoc insuficient pentru cel putin un produs din comanda.', 'ARE/STOC'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20005);

INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20006, 'Comanda nu exista sau nu contine produse (ARE).', 'COMANDA/ARE'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20006);

INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20007, 'Exista cel putin un lot expirat in comanda.', 'STOC'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20007);

INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20008, 'Factura exista deja pentru comanda data.', 'FACTURA'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20008);

COMMIT;



CREATE OR REPLACE PROCEDURE ex9_emitere_factura(
    p_id_comanda IN COMANDA.id_comanda%TYPE,
    p_data_emitere IN DATE
)
IS
    v_suma_total NUMBER(12,2);
    v_nr_produse NUMBER;
    v_insuficiente NUMBER;
    v_expirate NUMBER;
    v_metoda_de_plata COMANDA_CLIENT.metoda_plata%TYPE;
    v_facturi_exist NUMBER;
    v_client VARCHAR2(120);
    
    ex_comanda_fara_produse EXCEPTION;
    
BEGIN
    SELECT COUNT(*)
    INTO v_facturi_exist
    FROM FACTURA
    WHERE id_comanda = p_id_comanda;
    
    IF v_facturi_exist>0 THEN
        RAISE_APPLICATION_ERROR(-20008, 'Factura exista deja pentru comanda ' || p_id_comanda || '.');
    END IF;
    
    SELECT  cl.prenume || ' ' || cl.nume AS client,
            cc.metoda_plata,
            NVL(SUM(a.pret_vanzare_final * a.cantitate),0) AS total,
            COUNT(*) AS nr_produse,
            SUM(CASE WHEN a.cantitate > s.nr_bucati_ramase THEN 1 ELSE 0 END) AS insuficiente,
            SUM(CASE WHEN s.data_expirare < p_data_emitere THEN 1 ELSE 0 END) AS expirate
    INTO v_client, v_metoda_de_plata, v_suma_total, v_nr_produse, v_insuficiente, v_expirate
    FROM CLIENT cl
    JOIN COMANDA_CLIENT cc ON cc.id_client = cl.id_client
    JOIN COMANDA c ON c.id_comanda = cc.id_comanda
    JOIN ARE a ON a.id_comanda = c.id_comanda
    JOIN STOC s ON s.id_stoc = a.id_stoc
    WHERE c.id_comanda = p_id_comanda
    GROUP BY cl.prenume, cl.nume, cc.metoda_plata;
    
    IF v_nr_produse = 0 THEN
        RAISE ex_comanda_fara_produse;
    END IF;
    
     IF v_insuficiente > 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Stoc insuficient pentru comanda ' || p_id_comanda || '.');
    END IF;

    IF v_expirate > 0 THEN
        RAISE_APPLICATION_ERROR(-20007, 'Comanda ' || p_id_comanda || ' contine loturi expirate.');
    END IF;
    
    --emitere factura
    INSERT INTO FACTURA(data_emitere, suma, id_comanda)
    VALUES (p_data_emitere, v_suma_total, p_id_comanda);
    
    DBMS_OUTPUT.PUT_LINE('Factura emisa cu succes pentru comanda ' || p_id_comanda || '.');
    DBMS_OUTPUT.PUT_LINE('Client: ' || v_client || ', metoda plata: ' || v_metoda_de_plata || ', suma: ' || v_suma_total);

EXCEPTION
     WHEN ex_comanda_fara_produse THEN
        RAISE_APPLICATION_ERROR(-20006,'Comanda ' || p_id_comanda || ' nu contine produse.');
     WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20006, 'Comanda ' || p_id_comanda || ' nu exista sau nu contine produse.');

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Eroare: ' || SQLERRM);
        RAISE;

END ex9_emitere_factura;
/

--APEL
--1)emitere factura
SELECT id_stoc, data_expirare, nr_bucati_ramase
FROM STOC
ORDER BY id_stoc;

SELECT id_stoc, nr_bucati_ramase
FROM STOC
WHERE id_stoc = 21;

--creare comanda 
DECLARE
  v_id_comanda NUMBER;
BEGIN
  INSERT INTO COMANDA (data_comanda, id_personal_medical)
  VALUES (SYSDATE, 3)
  RETURNING id_comanda INTO v_id_comanda;

  INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
  VALUES (v_id_comanda, 'cash', 1);

  INSERT INTO ARE (id_comanda, id_stoc, cantitate, pret_vanzare_final, discount)
  VALUES (v_id_comanda, 21, 2, 50, 0);

  COMMIT;

  DBMS_OUTPUT.PUT_LINE('COMANDA NORMALA = ' || v_id_comanda);

  ex9_emitere_factura(v_id_comanda, SYSDATE);
END;


--2)factura exista deja
BEGIN
  ex9_emitere_factura(21, SYSDATE);
END;
/

--3)stoc insuficient
SELECT id_stoc, nr_bucati_ramase
FROM STOC
WHERE id_stoc = 23;


DECLARE
  v_id_comanda NUMBER;
BEGIN
  INSERT INTO COMANDA (data_comanda, id_personal_medical)
  VALUES (SYSDATE, 4)
  RETURNING id_comanda INTO v_id_comanda;

  INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
  VALUES (v_id_comanda, 'card', 2);

  INSERT INTO ARE (id_comanda, id_stoc, cantitate, pret_vanzare_final, discount)
  VALUES (v_id_comanda, 23, 10, 60, 0);

  COMMIT;

  DBMS_OUTPUT.PUT_LINE('COMANDA STOC INSUFICIENT = ' || v_id_comanda);

  ex9_emitere_factura(v_id_comanda, SYSDATE);
END;
/

--4)lot expirat
SELECT id_stoc, data_expirare
FROM STOC
WHERE id_stoc = 22;

DECLARE
  v_id_comanda NUMBER;
BEGIN
  INSERT INTO COMANDA (data_comanda, id_personal_medical)
  VALUES (SYSDATE, 6)
  RETURNING id_comanda INTO v_id_comanda;

  INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
  VALUES (v_id_comanda, 'cash', 3);

  INSERT INTO ARE (id_comanda, id_stoc, cantitate, pret_vanzare_final, discount)
  VALUES (v_id_comanda, 22, 1, 40, 0);

  COMMIT;

  DBMS_OUTPUT.PUT_LINE('COMANDA LOT EXPIRAT = ' || v_id_comanda);

  ex9_emitere_factura(v_id_comanda, SYSDATE);
END;
/

--5)comanda nu exista
BEGIN
  ex9_emitere_factura(9999, SYSDATE);
END;
/
ss