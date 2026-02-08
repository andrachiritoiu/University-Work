--ex.6.un subprogram cu 3 colectii

SET SERVEROUTPUT ON;

INSERT INTO CODURI_EROARE(cod_eroare, descriere, entitate_afectata)
SELECT -20001,
       'Nu exista campanii de tipul cerut sau nu exista interventii.',
       'CAMPANIE/INTERVINE'
FROM DUAL
WHERE NOT EXISTS(
    SELECT 1
    FROM CODURI_EROARE
    WHERE cod_eroare = -20001
);
COMMIT;

CREATE OR REPLACE PROCEDURE ex6_tip_campanie(
    prm_tip IN  CAMPANIE.tip%TYPE
)
IS
    --record
    TYPE rec_interventie IS RECORD(
        data_int INTERVINE.data_interventiei%TYPE,
        medic VARCHAR2(120),
        obs INTERVINE.observatii%TYPE,
        zi NUMBER(2)
    );
    
    --nested table
    TYPE t_interventii IS TABLE OF rec_interventie;
    v_interventii t_interventii;
    
    --index by table
    TYPE t_animale IS TABLE OF t_interventii 
    INDEX BY VARCHAR2(200);
    
    v_animale t_animale;
    
    
    TYPE t_campanii IS TABLE OF t_animale 
    INDEX BY VARCHAR2(200);
    
    v_campanii t_campanii;
    
    --varray
    TYPE v_zile IS VARRAY(31) OF NUMBER;
    contor_zile v_zile := v_zile();
    
    gasit BOOLEAN := FALSE;
    k_campanie VARCHAR2(200);
    k_animal   VARCHAR2(200);
    
BEGIN
    FOR i IN 1..31 LOOP
        contor_zile.EXTEND;
        contor_zile(i) := 0;
    END LOOP;
    
    --campaniile de tipul cerut care au interventii
    FOR camp IN(
        SELECT DISTINCT c.id_campanie, c.nume, c.tip, c.data_start, c.data_sfarsit
        FROM CAMPANIE c
        JOIN INTERVINE i ON i.id_campanie=c.id_campanie
        WHERE LOWER(c.tip) = LOWER(prm_tip)
        ORDER BY c.id_campanie
    )LOOP
        gasit := TRUE;
        
        --cheie campanie
        k_campanie := camp.nume || ' [' || camp.tip || '] (' ||
                  TO_CHAR(camp.data_start,'YYYY-MM-DD') || ' - ' ||
                  TO_CHAR(camp.data_sfarsit,'YYYY-MM-DD') || ')';
              
        v_animale.DELETE; 
        
        FOR animl IN(
            SELECT DISTINCT a.id_animal, a.nume, a.specie, a.rasa
            FROM ANIMAL a
            JOIN INTERVINE i ON i.id_animal = a.id_animal
            WHERE i.id_campanie = camp.id_campanie
            ORDER BY a.id_animal 
        )LOOP
        
            k_animal := animl.nume || ' (' || animl.specie || ', ' || animl.rasa || ', ID=' || animl.id_animal || ')';
    
            --interventiile fiecarui animal
            SELECT i.data_interventiei, pm.prenume || ' ' || pm.nume, i.observatii, EXTRACT(DAY FROM i.data_interventiei)
            BULK COLLECT INTO v_interventii
            FROM INTERVINE i
            JOIN PERSONAL_MEDICAL pm ON pm.id_personal_medical = i.id_personal_medical
            WHERE i.id_campanie = camp.id_campanie AND i.id_animal = animl.id_animal
            ORDER BY i.data_interventiei;
    
            v_animale(k_animal) := v_interventii;
            
            --actualizam controul de zile
            FOR j IN 1..v_interventii.COUNT LOOP
                IF v_interventii(j).zi BETWEEN 1 AND 31 THEN
                    contor_zile(v_interventii(j).zi) := contor_zile(v_interventii(j).zi)+1;
                END IF;
            END LOOP;
        
        END LOOP;
        
        v_campanii(k_campanie) := v_animale;
    END LOOP; 
    
    IF NOT gasit THEN
        RAISE_APPLICATION_ERROR(
        -20001,
        'Nu exista campanii de tipul: ' || prm_tip || ' sau nu exista interventii pentru acestea.'
        );
    END IF;
    
    
    --afisare
    k_campanie := v_campanii.FIRST;
    
    WHILE k_campanie IS NOT NULL LOOP
        DBMS_OUTPUT.PUT_LINE('Campanie: ' || k_campanie);
        
        v_animale := v_campanii(k_campanie);
        k_animal := v_animale.FIRST;
        
        WHILE k_animal IS NOT NULL LOOP
            DBMS_OUTPUT.PUT_LINE('  Animal: ' || k_animal);
            
            v_interventii := v_animale(k_animal);
            
            FOR j IN 1..v_interventii.COUNT LOOP
                DBMS_OUTPUT.PUT_LINE(
                    '    - ' || TO_CHAR(v_interventii(j).data_int,'YYYY-MM-DD') ||
                    ' | ' || v_interventii(j).medic ||
                    ' | ' || NVL(v_interventii(j).obs,'(fara observatii)')
                );
            END LOOP;
            
        k_animal := v_animale.NEXT(k_animal);
        END LOOP;
        
        DBMS_OUTPUT.NEW_LINE;
        k_campanie := v_campanii.NEXT(k_campanie);
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('- Total interventii pe zile (1..31) -');
    FOR i IN 1..31 LOOP
        IF contor_zile(i)=1 THEN
             DBMS_OUTPUT.PUT_LINE('Ziua ' || i || ': o interventie.');
        ELSIF contor_zile(i)>1 THEN
             DBMS_OUTPUT.PUT_LINE('Ziua ' || i || ': ' || contor_zile(i) || ' interventii.');
        END IF;      
    END LOOP;
    
EXCEPTION
  WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Eroare: ' || SQLERRM);
        RAISE;

END ex6_tip_campanie;
/


--APEL
BEGIN
  ex6_tip_campanie('Vaccinare');
  DBMS_OUTPUT.NEW_LINE;
  ex6_tip_campanie('Adoptie');
END;
/