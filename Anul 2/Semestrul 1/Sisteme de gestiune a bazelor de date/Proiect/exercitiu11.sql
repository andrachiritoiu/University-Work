--ex11.trigger LMD la nivel de linie
INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20011, 'Eroare la actualizarea stocului in triggerul de gestiune a facturilor.', 'STOC/FACTURA'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20011
);

INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20012, 'Factura pentru comanda de farmacie (furnizor) nu poate fi stearsa (operatie interzisa).', 'FACTURA/COMANDA_FARMACIE'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20012
);

INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20013, 'Comanda de farmacie nu contine medicamente (INCLUDE).', 'COMANDA_FARMACIE/INCLUDE'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20013
);

COMMIT;


CREATE OR REPLACE TRIGGER trg_ex11_actualizare_stoc
FOR INSERT OR DELETE ON FACTURA

--pentru a evita muttating table
COMPOUND TRIGGER
    --variabila globala
    v_incasari NUMBER(12,2) := 0;
    
    AFTER EACH ROW IS
    --variabile locale
        v_nr_produse_comanda NUMBER;
        v_probleme NUMBER;
        v_user VARCHAR2(30);
        v_msg VARCHAR2(300);
        v_id_comanda COMANDA.id_comanda%TYPE;
        v_tip VARCHAR2(20);
        
    BEGIN
         v_user := SYS_CONTEXT('USERENV','SESSION_USER');
         
         v_id_comanda := CASE
                            WHEN INSERTING THEN :NEW.id_comanda
                            WHEN DELETING THEN :OLD.id_comanda
                         END;
                         
         SELECT CASE
         WHEN EXISTS(
            SELECT 1
            FROM COMANDA_CLIENT cc
            WHERE cc.id_comanda = v_id_comanda)
            THEN 'CLIENT'
         WHEN EXISTS(
            SELECT 1
            FROM COMANDA_FARMACIE cf
            WHERE cf.id_comanda = v_id_comanda)
            THEN 'FARMACIE'    
         ELSE 'NECUNOSCUT'
         END
         INTO v_tip
         FROM DUAL;
         
         IF v_tip = 'NECUNOSCUT' THEN
            v_msg := 'Factura are id_comanda invalid (nu exista in COMANDA_CLIENT/COMANDA_FARMACIE): '
                     || v_id_comanda || '. User=' || v_user;
            insereaza_eroare(-20010, v_msg);
            RAISE_APPLICATION_ERROR(-20010, v_msg);
         END IF;
        
        --COMANDA CLIENT
         IF v_tip = 'CLIENT' THEN
         
             IF INSERTING THEN
                --comanda are produse
                SELECT COUNT(*)
                INTO v_nr_produse_comanda 
                FROM ARE
                WHERE id_comanda = :NEW.id_comanda;
             
                IF v_nr_produse_comanda = 0 THEN
                    v_msg := 'Factura nu poate fi emisa: comanda ' || :NEW.id_comanda ||
                        ' nu contine produse (ARE). User=' || v_user;
                    insereaza_eroare(-20006, v_msg);
                    RAISE_APPLICATION_ERROR(-20006, v_msg);
                END IF;
                
                --verificare stoc
                SELECT COUNT(*)
                INTO v_probleme
                FROM ARE a 
                JOIN STOC s ON s.id_stoc = a.id_stoc
                WHERE a.id_comanda = :NEW.id_comanda 
                    AND a.cantitate > s.nr_bucati_ramase;
                    
                IF v_probleme > 0 THEN
                    v_msg := 'Stoc insuficient la emiterea facturii pentru comanda ' ||
                        :NEW.id_comanda || '. User=' || v_user;
                    insereaza_eroare(-20005, v_msg);
                    RAISE_APPLICATION_ERROR(-20005, v_msg);
                END IF;    
                    
                --scadere stoc
                UPDATE STOC s
                SET s.nr_bucati_ramase = s.nr_bucati_ramase - (
                    SELECT SUM(a.cantitate)
                    FROM ARE a
                    WHERE a.id_comanda = :NEW.id_comanda
                        AND a.id_stoc = s.id_stoc
                )
                --actualizeza doar stocurile care exista in comanda facturata
                WHERE EXISTS(
                    SELECT 1
                    FROM ARE a
                    WHERE a.id_comanda = :NEW.id_comanda
                        AND a.id_stoc = s.id_stoc
                );
                
                v_incasari := v_incasari + :NEW.suma;
            
             
            ELSIF DELETING THEN
                UPDATE STOC s
                SET s.nr_bucati_ramase = s.nr_bucati_ramase + (
                    SELECT SUM(a.cantitate)
                    FROM ARE a
                    WHERE a.id_comanda = :OLD.id_comanda
                        AND a.id_stoc = s.id_stoc
                )
                WHERE EXISTS(
                    SELECT 1
                    FROM ARE a
                    WHERE a.id_comanda = :OLD.id_comanda
                        AND a.id_stoc = s.id_stoc
                );
                
                v_incasari := v_incasari - :OLD.suma;
        
            END IF;
     
     --COMANDA FARMACIE       
     ELSIF v_tip = 'FARMACIE' THEN
     
           IF DELETING THEN
                v_msg := 'Factura pentru comanda de farmacie (furnizor) nu poate fi stearsa. id_comanda='
                         || :OLD.id_comanda || '. User=' || v_user;
                insereaza_eroare(-20012, v_msg);
                RAISE_APPLICATION_ERROR(-20012, v_msg);
           END IF;
           
           SELECT COUNT(*)
           INTO v_nr_produse_comanda
           FROM INCLUDE 
           WHERE id_comanda = :NEW.id_comanda;
           
           IF v_nr_produse_comanda = 0 THEN
                v_msg := 'Factura furnizor nu poate fi emisa: comanda '
                         || :NEW.id_comanda || ' nu contine medicamente (INCLUDE). User=' || v_user;
                insereaza_eroare(-20013, v_msg);
                RAISE_APPLICATION_ERROR(-20013, v_msg);
            END IF;
     
            INSERT INTO STOC(
                id_stoc,
                data_aprovizionare,
                data_expirare,
                nr_bucati_primite,
                nr_bucati_ramase,
                pret_achizitie,
                pret_vanzare_curent,
                id_medicament
            )
            SELECT 
                seq_stoc.NEXTVAL,
                :NEW.data_emitere,
                ADD_MONTHS(:NEW.data_emitere, 12),
                i.cantitate,
                i.cantitate,
                v.pret_furnizor,
                ROUND(v.pret_furnizor * 1.30, 2),
                i.id_medicament
            FROM INCLUDE i
            JOIN COMANDA_FARMACIE cf ON cf.id_comanda = i.id_comanda
            JOIN VINDE v ON v.id_furnizor = cf.id_furnizor AND v.id_medicament = i.id_medicament
            WHERE i.id_comanda = :NEW.id_comanda;     
     END IF;
        
     EXCEPTION
        WHEN OTHERS THEN
            v_msg := 'Eroare in trigger EX11 (actualizare stoc). ' || SQLERRM;
            insereaza_eroare(-20011, v_msg);
            RAISE;   
    END AFTER EACH ROW;
    
    AFTER STATEMENT IS
        BEGIN
            DBMS_OUTPUT.PUT_LINE('Delta incasari pentru statementul curent pe FACTURA = ' ||
                                NVL(v_incasari, 0) || ' RON'
                                );
  END AFTER STATEMENT;

END;
/
   
   
ALTER TRIGGER trg_ex10_factura_program DISABLE;    

--rezolvare bd
ALTER TRIGGER trg_ex11_actualizare_stoc DISABLE;


--comanda client
MERGE INTO STOC s
USING (
  SELECT a.id_stoc, SUM(a.cantitate) cant_facturata
  FROM FACTURA f
  JOIN COMANDA_CLIENT cc ON cc.id_comanda = f.id_comanda
  JOIN ARE a ON a.id_comanda = f.id_comanda
  GROUP BY a.id_stoc
) c
ON (c.id_stoc = s.id_stoc)
WHEN MATCHED THEN
  UPDATE SET s.nr_bucati_ramase =
    GREATEST(0, s.nr_bucati_primite - c.cant_facturata);

COMMIT;




--APEL      
ALTER TRIGGER trg_ex11_actualizare_stoc ENABLE;

--1)insert
--comanda noua
INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (SYSDATE, 3);
COMMIT;

--comanda client noua
INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (44, 'card', 1);
COMMIT;

INSERT INTO ARE (id_comanda, id_stoc, cantitate, pret_vanzare_final)
VALUES (44, 1, 15, 25);
COMMIT;


--STOC INITIAL
SELECT id_stoc, nr_bucati_primite, nr_bucati_ramase
FROM STOC
WHERE id_stoc = 1;

--inserare factura
INSERT INTO FACTURA (id_comanda, data_emitere, suma)
VALUES (44, SYSDATE, 100);

COMMIT;


--stoc dupa
SELECT id_stoc, nr_bucati_primite, nr_bucati_ramase
FROM STOC
WHERE id_stoc = 1;


--2)delete
--stoc initial
SELECT id_stoc, nr_bucati_primite, nr_bucati_ramase
FROM STOC
WHERE id_stoc = 1;

--stergere
DELETE FROM FACTURA
WHERE id_comanda = 44;

COMMIT;

--stoc final
SELECT id_stoc, nr_bucati_primite, nr_bucati_ramase
FROM STOC
WHERE id_stoc = 1;

--3)stoc insuficient
SELECT a.id_stoc, a.cantitate, s.nr_bucati_primite, s.nr_bucati_ramase
FROM ARE a
JOIN STOC s ON s.id_stoc = a.id_stoc
WHERE a.id_comanda = 22;


INSERT INTO FACTURA (id_comanda, data_emitere, suma)
VALUES (22, SYSDATE, 150);

COMMIT;


--4)INSERT FARMACIE
--COMANDA NOUA
INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (SYSDATE, 4);
COMMIT;

INSERT INTO COMANDA_FARMACIE (id_comanda, termen_livrare, id_furnizor)
VALUES (85, SYSDATE + 3, 5);
COMMIT;


INSERT INTO VINDE (id_furnizor, id_medicament, pret_furnizor)
SELECT 5, 1, 25
FROM dual
WHERE NOT EXISTS (
  SELECT 1
  FROM VINDE v
  WHERE v.id_furnizor = 5
    AND v.id_medicament = 1
);
COMMIT;


INSERT INTO INCLUDE (id_comanda, id_medicament, cantitate)
VALUES (85, 1, 7);
COMMIT;

--stoc initial
SELECT id_stoc, nr_bucati_primite, nr_bucati_ramase
FROM STOC;



INSERT INTO FACTURA (id_comanda, data_emitere, suma)
VALUES (85, SYSDATE, 200);


--stoc final
SELECT id_stoc, id_medicament, data_aprovizionare, data_expirare,
       nr_bucati_primite, nr_bucati_ramase
FROM STOC
WHERE data_aprovizionare >= TRUNC(SYSDATE)
ORDER BY id_stoc DESC;


--5)DELETE FARMACIE
DELETE FROM FACTURA
WHERE id_factura = (
  SELECT MAX(id_factura)
  FROM FACTURA
  WHERE id_comanda = 85
);

ROLLBACK;