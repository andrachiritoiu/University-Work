--ex8.functie cu 3 tabele intr-o singura comanda SQL care trateaza toate exceptiile - nume si prenume acelasi timp de metoda de plata

INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20003, 'Client inexistent sau fara comenzi.', 'CLIENT/COMANDA_CLIENT/COMANDA'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20003);

INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20004, 'Clientul are comenzi cu metode de plata diferite.', 'COMANDA_CLIENT'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20004);

COMMIT;


CREATE OR REPLACE FUNCTION ex8_metoda_plata(
    p_nume IN CLIENT.nume%TYPE,
    p_prenume IN CLIENT.prenume%TYPE
)
RETURN VARCHAR2
IS
    v_metoda COMANDA_CLIENT.metoda_plata%type;
    v_nr_comenzi NUMBER;
    v_ultima_data DATE;

BEGIN
    SELECT cc.metoda_plata,
           COUNT(DISTINCT co.id_comanda) AS nr_comenzi,
           MAX(co.data_comanda) AS ultima_data
    INTO v_metoda, v_nr_comenzi, v_ultima_data
    FROM CLIENT c
    JOIN COMANDA_CLIENT cc ON cc.id_client = c.id_client
    JOIN COMANDA co ON co.id_comanda = cc.id_comanda
    WHERE LOWER(c.nume) = LOWER(p_nume) AND 
          LOWER(c.prenume) = LOWER(p_prenume)
    GROUP BY cc.metoda_plata;
          
    RETURN 'Metoda=' || v_metoda
           || ', comenzi=' || v_nr_comenzi
           || ', ultima=' || TO_CHAR(v_ultima_data, 'YYYY-MM-DD');  
   
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20003, 'Client inexistent sau fara comenzi.');

    WHEN TOO_MANY_ROWS THEN
        RAISE_APPLICATION_ERROR(-20004, 'Clientul are comenzi cu metode de plata diferite.');

    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20099, 'Alta eroare: ' || SQLERRM);
END;
/

--APEL
BEGIN
  --caz normal
  BEGIN
    DBMS_OUTPUT.PUT_LINE('Caz normal: ' || ex8_metoda_plata('Popescu', 'Ana'));
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Eroare (nu trebuia aici): ' || SQLERRM);
  END;

  DBMS_OUTPUT.NEW_LINE;

  --caz NO_DATA_FOUND (client inexistent / fara comenzi)
  BEGIN
    DBMS_OUTPUT.PUT_LINE('Caz NO_DATA_FOUND: ' || ex8_metoda_plata('Nume', 'Inexistent'));
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Caz NO_DATA_FOUND OK: ' || SQLERRM);
  END;

  DBMS_OUTPUT.NEW_LINE;

  --caz TOO_MANY_ROWS (metode plata diferite)
  BEGIN
    DBMS_OUTPUT.PUT_LINE('Caz TOO_MANY_ROWS: ' || ex8_metoda_plata('Ionescu', 'Vlad'));
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Caz TOO_MANY_ROWS OK: ' || SQLERRM);
  END;
END;
/