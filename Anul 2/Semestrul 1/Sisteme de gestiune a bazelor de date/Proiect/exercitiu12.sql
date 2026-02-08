--ex12.trigger LDD 
INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20014, 'DROP interzis pe tabele critice (protectie schema farmacie).', 'LDD / AUDIT_OPERATII_LDD'
FROM dual
WHERE NOT EXISTS (
    SELECT 1
    FROM CODURI_EROARE
    WHERE cod_eroare = -20014
);

COMMIT;


CREATE OR REPLACE TRIGGER trg_ex12_audit_ldd
BEFORE DDL ON SCHEMA
DECLARE
    PRAGMA AUTONOMOUS_TRANSACTION; 
   
    v_sql CLOB := EMPTY_CLOB(); --textul comenzii SQL care a decalnsat triggerul
    v_vector ORA_NAME_LIST_T; --bucati din SQL
    v_n PLS_INTEGER; --cate bucati mi-a dat din SQL
    
    v_tip_operatie VARCHAR2(30) := ORA_SYSEVENT;
    v_tip_obiect VARCHAR2(30) := ORA_DICT_OBJ_TYPE;
    v_nume_obiect VARCHAR2(100) := ORA_DICT_OBJ_NAME;
    v_utilizator VARCHAR2(30) := SYS_CONTEXT('USERENV','SESSION_USER');
    
    FUNCTION este_tabel_critic(p_nume VARCHAR2) 
    RETURN BOOLEAN 
    IS
    BEGIN
        RETURN UPPER(p_nume) IN ('STOC','FACTURA','COMANDA','ARE','MEDICAMENT','CLIENT','FURNIZOR');
    END;
  
BEGIN
    --SQL-ul care a declansat trigger-ul
    v_n := ORA_SQL_TXT(v_vector);
    
    IF v_n > 0 THEN
        FOR i IN 1..v_n LOOP 
            v_sql := v_sql || v_vector(i); 
        END LOOP;
    ELSE v_sql := 'SQL indisponibil (ORA_SQL_TXT=0).'; 
    END IF;
    
    
    INSERT INTO AUDIT_OPERATII_LDD(tip_operatie, tip_obiect, nume_obiect, utilizator, data_ora, sql_text) 
    VALUES (v_tip_operatie, v_tip_obiect, v_nume_obiect, v_utilizator, SYSTIMESTAMP, v_sql);

    COMMIT;
    
    --DROP intrezis pe table critice
    IF v_tip_operatie = 'DROP' AND v_tip_obiect = 'TABLE' AND este_tabel_critic(v_nume_obiect) THEN
        RAISE_APPLICATION_ERROR(-20014, 'DROP interzis pe tabel critic: ' || v_nume_obiect);
    END IF;

EXCEPTION
     WHEN OTHERS THEN
        IF SQLCODE = -20014 THEN
            RAISE;
        END IF;

        ROLLBACK;
END;
/

--APEL
--1)creare tabel nou
CREATE TABLE TEST_LDD (
  id_test NUMBER PRIMARY KEY
);

SELECT id_audit_ldd, tip_operatie, tip_obiect, nume_obiect, utilizator, data_ora
FROM audit_operatii_ldd;

--2)alter
ALTER TABLE TEST_LDD ADD descriere VARCHAR2(30);

SELECT id_audit_ldd, tip_operatie, tip_obiect, nume_obiect, data_ora
FROM audit_operatii_ldd;

--3)delete
DROP TABLE TEST_LDD;

SELECT id_audit_ldd, tip_operatie, tip_obiect, nume_obiect, data_ora
FROM audit_operatii_ldd;

--4)drop tabel critic
DROP TABLE STOC;
