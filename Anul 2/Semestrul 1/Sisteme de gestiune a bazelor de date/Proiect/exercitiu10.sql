--ex10.trigger LMD la nivel de comanda
INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20009,
       'Operatiile asupra FACTURA sunt permise doar intre orele 09:00 si 17:00.',
       'FACTURA'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20009);


INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20010,
       'Operatiile asupra FACTURA sunt interzise in ziua de duminica.',
       'FACTURA'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20010);

COMMIT;


CREATE OR REPLACE TRIGGER trg_ex10_factura_program
BEFORE INSERT OR UPDATE OR DELETE ON FACTURA
DECLARE
    v_now DATE := SYSDATE;
    v_hhmi NUMBER;
    v_zi VARCHAR2(20);
    v_op VARCHAR2(10);
    v_user VARCHAR2(30);
    v_msg VARCHAR2(300);
BEGIN
     v_user := SYS_CONTEXT('USERENV','SESSION_USER');
     v_hhmi := TO_NUMBER(TO_CHAR(v_now, 'HH24MI'));
     
      v_zi := UPPER(TO_CHAR(v_now, 'DAY', 'NLS_DATE_LANGUAGE=ROMANIAN'));
      v_zi := RTRIM(v_zi);
      v_zi := REPLACE(v_zi, 'Ă', 'A');
      
      IF INSERTING THEN
            v_op := 'INSERT';
      ELSIF UPDATING THEN
            v_op := 'UPDATE';
      ELSE
            v_op := 'DELETE';
      END IF;
      
      IF v_zi = 'DUMINICA' THEN
        v_msg := 'Operatie ' || v_op || ' interzisa duminica, user=' || v_user ||
             ', moment=' || TO_CHAR(v_now,'YYYY-MM-DD HH24:MI');
         insereaza_eroare(-20010, v_msg);
         RAISE_APPLICATION_ERROR(-20010, v_msg);
      END IF;
      
       IF v_hhmi < 900 OR v_hhmi >= 1700 THEN
            v_msg := 'Operatie ' || v_op ||
                ' interzisa in afara programului (09:00-17:00), user=' || v_user ||
                ', ora curenta=' || TO_CHAR(v_now,'HH24:MI');
            insereaza_eroare(-20009, v_msg);
            RAISE_APPLICATION_ERROR(-20009, v_msg);
  END IF;

END;
/


--APEL
--1)UPDATE
UPDATE FACTURA
SET suma = 1000
WHERE id_factura = (SELECT MIN(id_factura) FROM FACTURA);


--2)INSERT
INSERT INTO FACTURA (id_comanda, data_emitere, suma)
VALUES ( 
    (SELECT MIN(id_comanda) FROM COMANDA),SYSDATE, 0
);


--3)DELETE
DELETE FROM FACTURA
WHERE id_factura = 10;