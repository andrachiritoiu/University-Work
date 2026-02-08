--ex13.pachet
INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20015,
       'Prag de reaprovizionare invalid (trebuie >= 0).',
       'PRAG_REAPROVIZIONARE'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20015
);

COMMIT;


--OBJECT(o recomandare de aprovizionare)
CREATE OR REPLACE TYPE rec_reaprov_t AS OBJECT (
  id_medicament         NUMBER,
  denumire_medicament   VARCHAR2(200),
  stoc_total            NUMBER,
  prag_minim            NUMBER,
  zile_pana_la_exp_min  NUMBER,
  consum_ultimele_zile  NUMBER,
  cantitate_recomandata NUMBER
);
/

--NESTED TABLE
CREATE OR REPLACE TYPE tab_reaprov_t AS TABLE OF rec_reaprov_t;
/


--tabele
CREATE SEQUENCE seq_raport_reaprov START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_log_prag_reaprov START WITH 1 INCREMENT BY 1;

--prag minim configurabil per medicament
CREATE TABLE PRAG_REAPROVIZIONARE (
  id_medicament NUMBER PRIMARY KEY,
  prag_minim    NUMBER NOT NULL CHECK (prag_minim >= 0),
  data_setare   DATE DEFAULT SYSDATE NOT NULL,
  CONSTRAINT fk_prag_med FOREIGN KEY (id_medicament) REFERENCES MEDICAMENT(id_medicament)
);
/

--raport (nested table in coloana)
CREATE TABLE RAPORT_REAPROVIZIONARE (
  id_raport   INT DEFAULT seq_raport_reaprov.NEXTVAL PRIMARY KEY,
  data_raport TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  criterii    VARCHAR2(500),
  recomandari tab_reaprov_t
)
NESTED TABLE recomandari STORE AS nt_raport_reaprov; --tabel separat care va stoca elementele colectiei
/

--istoric modificari prag 
CREATE TABLE ISTORIC_PRAG_REAPROV (
  id_log       INT DEFAULT seq_log_prag_reaprov.NEXTVAL PRIMARY KEY,
  id_medicament NUMBER NOT NULL,
  prag_vechi    NUMBER,
  prag_nou      NUMBER,
  data_log      TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT fk_istoric_prag_med FOREIGN KEY (id_medicament) REFERENCES MEDICAMENT(id_medicament)
);
/


--SPECIFICATIA PACHETULUI
CREATE OR REPLACE PACKAGE pachet_ex13_reaprov AS
    TYPE rc_dyn IS REF CURSOR;
    
    --functii
    FUNCTION consum_medicament_ultimele_zile(
        p_id_medicament IN MEDICAMENT.id_medicament%TYPE,
        p_zile IN NUMBER DEFAULT 30
    )RETURN NUMBER;
        
     FUNCTION selecteaza_medicamente_critice(
        p_prag_default IN NUMBER DEFAULT 10,
        p_zile_expirare_max IN NUMBER DEFAULT 30,
        p_incl_expirate IN CHAR DEFAULT 'N',
        p_zile_consum IN NUMBER DEFAULT 30
     )RETURN tab_reaprov_t;
        
    
    --proceduri
    PROCEDURE genereaza_raport_reaprov(
        p_prag_default IN NUMBER DEFAULT 10,
        p_zile_expirare_max IN NUMBER DEFAULT 30,
        p_incl_expirate IN CHAR DEFAULT 'N',
        p_zile_consum IN NUMBER DEFAULT 30
     );
     
    PROCEDURE seteaza_prag_medicament(
        p_id_medicament IN NUMBER,
        p_prag_nou IN NUMBER
      );

    PROCEDURE afiseaza_raport(p_id_raport IN NUMBER);
  
END pachet_ex13_reaprov;
/




--CORPUL PACHETULUI
CREATE OR REPLACE PACKAGE BODY pachet_ex13_reaprov AS

    --functii
    FUNCTION consum_medicament_ultimele_zile(
        p_id_medicament IN MEDICAMENT.id_medicament%TYPE,
        p_zile IN NUMBER DEFAULT 30
    )RETURN NUMBER
    IS
    v_consum NUMBER;
    BEGIN
        SELECT NVL(SUM(a.cantitate), 0)
        INTO v_consum
        FROM ARE a
        JOIN COMANDA c ON c.id_comanda = a.id_comanda
        JOIN COMANDA_CLIENT cc ON cc.id_comanda = c.id_comanda
        JOIN STOC s ON s.id_stoc = a.id_stoc
        WHERE s.id_medicament = p_id_medicament 
            AND c.data_comanda >= TRUNC(SYSDATE) - NVL(p_zile, 30);
            
        RETURN v_consum;    
    END consum_medicament_ultimele_zile;
    
    
    
    FUNCTION selecteaza_medicamente_critice(
        p_prag_default IN NUMBER DEFAULT 10,
        p_zile_expirare_max IN NUMBER DEFAULT 30,
        p_incl_expirate IN CHAR DEFAULT 'N',
        p_zile_consum IN NUMBER DEFAULT 30
     )RETURN tab_reaprov_t
     IS
        v_sql VARCHAR2(4000);  --comanda SQL
        v_rc rc_dyn; --cursorul dinamic care va executa comanda din v_sql

        v_id NUMBER;
        v_den VARCHAR2(200);
        v_stoc NUMBER;
        v_prag NUMBER;
        v_zile_min NUMBER;
    
        v_out tab_reaprov_t := tab_reaprov_t();
        v_cons NUMBER; --consumul recent
        v_recom NUMBER; --cantitattea recomandata pentru reaprovizionare
     
     BEGIN   
        --SQL dinamic
         v_sql :=
              'SELECT m.id_medicament, m.denumire, '||
              '       NVL(SUM(s.nr_bucati_ramase),0) stoc_total, '||
              '       NVL(pr.prag_minim, :b_prag_default) prag_minim, '||
              '       MIN(TRUNC(s.data_expirare) - TRUNC(SYSDATE)) zile_pana_exp_min '||
              'FROM MEDICAMENT m '||
              'JOIN STOC s ON s.id_medicament = m.id_medicament '||
              'LEFT JOIN PRAG_REAPROVIZIONARE pr ON pr.id_medicament = m.id_medicament ';
     
         --include sau nu medicamentele expirate
         IF UPPER(p_incl_expirate) = 'N' THEN
            v_sql := v_sql || 'WHERE s.data_expirare >= TRUNC(SYSDATE) ';
         ELSE
            v_sql := v_sql || 'WHERE 1=1 ';
         END IF;
         
         v_sql := v_sql ||
              'GROUP BY m.id_medicament, m.denumire, NVL(pr.prag_minim, :b_prag_default) '||
              'HAVING (NVL(SUM(s.nr_bucati_ramase),0) <= NVL(pr.prag_minim, :b_prag_default)) '||
              '   OR (MIN(TRUNC(s.data_expirare) - TRUNC(SYSDATE)) <= :b_zile_exp) '||
              'ORDER BY zile_pana_exp_min ASC, stoc_total ASC';
              
         --cursorul dinamic
         OPEN v_rc FOR v_sql
            USING p_prag_default, p_prag_default, p_prag_default, p_zile_expirare_max;
         
         LOOP 
            FETCH v_rc INTO v_id, v_den, v_stoc, v_prag, v_zile_min;
            EXIT WHEN v_rc%NOTFOUND;
            
            v_cons := consum_medicament_ultimele_zile(v_id, p_zile_consum);
    
            -- Recomandare: completam pana la prag + jumatate din consumul recent
            v_recom := GREATEST(0, (v_prag - v_stoc) + CEIL(v_cons/2));
         
            v_out.EXTEND;
            --construiesc obiectul si il adaug in nested_table
            v_out(v_out.LAST) := rec_reaprov_t(
                v_id, v_den, v_stoc, v_prag, v_zile_min, v_cons, v_recom
            );
            
        END LOOP;
        
        CLOSE v_rc;
        RETURN v_out;
         
    END selecteaza_medicamente_critice;
    

    --proceduri
    PROCEDURE genereaza_raport_reaprov(
        p_prag_default IN NUMBER DEFAULT 10,
        p_zile_expirare_max IN NUMBER DEFAULT 30,
        p_incl_expirate IN CHAR DEFAULT 'N',
        p_zile_consum IN NUMBER DEFAULT 30
    )
    IS
        v_list tab_reaprov_t; --lista de recomandari
        v_criterii VARCHAR2(500);
    
    BEGIN
        v_list := selecteaza_medicamente_critice(
            p_prag_default, p_zile_expirare_max, p_incl_expirate, p_zile_consum
        );
        
        v_criterii :=
          'prag_default='||p_prag_default||
          ', zile_expirare_max='||p_zile_expirare_max||
          ', incl_expirate='||p_incl_expirate||
          ', zile_consum='||p_zile_consum;
          
        INSERT INTO RAPORT_REAPROVIZIONARE(criterii, recomandari)
        VALUES (v_criterii, v_list);

        COMMIT;
        
    EXCEPTION
      WHEN OTHERS THEN
        insereaza_eroare(SQLCODE, 'EX13 genereaza_raport_reaprov: '||SQLERRM);
        RAISE;

    END genereaza_raport_reaprov;
    
    
    
    
    PROCEDURE seteaza_prag_medicament(
        p_id_medicament IN NUMBER,
        p_prag_nou IN NUMBER
    )
    IS
        v_old NUMBER;
        v_msg VARCHAR2(500);
    BEGIN
        IF p_prag_nou < 0 THEN
            v_msg := 'Prag de reaprovizionare invalid (trebuie >= 0). id_medicament='||
                   p_id_medicament||', prag='||p_prag_nou||
                   '. User='||SYS_CONTEXT('USERENV','SESSION_USER');
      insereaza_eroare(-20015, v_msg);
      RAISE_APPLICATION_ERROR(-20015, v_msg);
    END IF;
    
    --daca nu exista prag vechi eroare este prinsa aici
    BEGIN
        SELECT prag_minim
        INTO v_old
        FROM PRAG_REAPROVIZIONARE
        WHERE id_medicament = p_id_medicament;
        
     EXCEPTION
        WHEN NO_DATA_FOUND THEN v_old := NULL;
     END;
     
    INSERT INTO ISTORIC_PRAG_REAPROV(id_medicament, prag_vechi, prag_nou)
    VALUES (p_id_medicament, v_old, p_prag_nou);
    
     MERGE INTO PRAG_REAPROVIZIONARE pr
     USING (SELECT p_id_medicament id_medicament FROM dual) src
     ON (pr.id_medicament = src.id_medicament)
     WHEN MATCHED THEN
        UPDATE SET prag_minim = p_prag_nou, data_setare = SYSDATE
     WHEN NOT MATCHED THEN
        INSERT (id_medicament, prag_minim, data_setare)
        VALUES (p_id_medicament, p_prag_nou, SYSDATE);

    COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
          insereaza_eroare(SQLCODE, 'EX13 seteaza_prag_medicament: '||SQLERRM);
          RAISE;
     
    END seteaza_prag_medicament;


    

    PROCEDURE afiseaza_raport(p_id_raport IN NUMBER)
    IS
        v_crit VARCHAR2(500);
        v_list tab_reaprov_t;
    BEGIN
        SELECT criterii, recomandari
        INTO v_crit, v_list
        FROM RAPORT_REAPROVIZIONARE
        WHERE id_raport = p_id_raport;
        
        DBMS_OUTPUT.PUT_LINE('Raport #'||p_id_raport||' criterii: '||v_crit);

         IF v_list.COUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Nu exista recomandari.');
            RETURN;
         END IF;

        FOR i IN 1..v_list.COUNT LOOP
          DBMS_OUTPUT.PUT_LINE(
            '- '||v_list(i).denumire_medicament||
            ' [ID='||v_list(i).id_medicament||'] stoc='||v_list(i).stoc_total||
            ', prag='||v_list(i).prag_minim||
            ', exp_min_zile='||v_list(i).zile_pana_la_exp_min||
            ', consum='||v_list(i).consum_ultimele_zile||
            ', recom='||v_list(i).cantitate_recomandata
          );
        END LOOP;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
          DBMS_OUTPUT.PUT_LINE('Raport inexistent.');
    
    END afiseaza_raport;
    
    
END pachet_ex13_reaprov;
/



--APEL
--TEST 1
--1)inserare prag
BEGIN 
    pachet_ex13_reaprov.seteaza_prag_medicament(1, 20);
END;
/

SELECT *
FROM PRAG_REAPROVIZIONARE
WHERE id_medicament = 1;

SELECT *
FROM ISTORIC_PRAG_REAPROV
WHERE id_medicament = 1
ORDER BY data_log DESC;




-- 2) prag invalid 
BEGIN
  pachet_ex13_reaprov.seteaza_prag_medicament(1, -5);
END;
/

SELECT *
FROM LOG_EROARE
WHERE cod_eroare = -20015;



-- 3) genereaza raport
BEGIN
  pachet_ex13_reaprov.genereaza_raport_reaprov(10, 30, 'N', 30);
END;
/

SELECT id_raport, data_raport, criterii
FROM RAPORT_REAPROVIZIONARE
ORDER BY id_raport DESC;


-- 4) afiseaza ultimul raport
BEGIN
  pachet_ex13_reaprov.afiseaza_raport(1);
END;
/




--TEST 2
--setare prag
BEGIN
  pachet_ex13_reaprov.seteaza_prag_medicament(7, 40);
  pachet_ex13_reaprov.seteaza_prag_medicament(5, 50);
  pachet_ex13_reaprov.seteaza_prag_medicament(10, 60);
  pachet_ex13_reaprov.seteaza_prag_medicament(9, 70);
  pachet_ex13_reaprov.seteaza_prag_medicament(6, 80);
  pachet_ex13_reaprov.seteaza_prag_medicament(8, 100);
  pachet_ex13_reaprov.seteaza_prag_medicament(2, 130);
  pachet_ex13_reaprov.seteaza_prag_medicament(1, 400);
END;
/

--verificare prag
SELECT *
FROM prag_reaprovizionare
WHERE id_medicament IN (7,5,10,9,6,8,2,1)
ORDER BY id_medicament;

--generare raport
BEGIN
  pachet_ex13_reaprov.genereaza_raport_reaprov(10, 30, 'N', 30);
END;
/


--afisare ultim raport
DECLARE
  v_id NUMBER;
BEGIN
  SELECT MAX(id_raport) INTO v_id FROM raport_reaprovizionare;
  pachet_ex13_reaprov.afiseaza_raport(v_id);
END;
/


