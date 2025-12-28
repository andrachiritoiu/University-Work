--PL/SQL5
--e2
CREATE OR REPLACE PACKAGE PACHET_ANALIZA_STOC_CAF AS
    CURSOR c_stoc_scump (p_prag NUMBER) RETURN STOC%ROWTYPE;
    FUNCTION f_pret_maxim_oras (v_oras VARCHAR2) RETURN NUMBER;
END PACHET_ANALIZA_STOC_CAF;
/

CREATE OR REPLACE PACKAGE BODY PACHET_ANALIZA_STOC_CAF AS
    CURSOR c_stoc_scump (p_prag NUMBER) RETURN STOC%ROWTYPE IS
        SELECT *
        FROM STOC
        WHERE pret_unitar >= p_prag;

    FUNCTION f_pret_maxim_oras (v_oras VARCHAR2) RETURN NUMBER IS
        v_maxim NUMBER;
    BEGIN
        SELECT MAX(s.pret_unitar)
        INTO v_maxim
        FROM STOC s
        JOIN TIP_MEDICAMENT tm ON s.id_tip = tm.id_tip
        JOIN VINDE v ON tm.id_tip = v.id_tip
        JOIN FURNIZOR f ON v.id_furnizor=f.id_furnizor
        WHERE UPPER(f.adresa) LIKE '%' || UPPER(v_oras) || '%';

        RETURN NVL(v_maxim, 0);
    END f_pret_maxim_oras;
END PACHET_ANALIZA_STOC_CAF;
/


DECLARE
    v_oras_test VARCHAR2(50) := 'București';
    v_prag_maxim NUMBER;
BEGIN
    v_prag_maxim := PACHET_ANALIZA_STOC_CAF.f_pret_maxim_oras(v_oras_test);

    DBMS_OUTPUT.PUT_LINE('Pretul maxim gasit pentru ' || v_oras_test || ' este: ' || v_prag_maxim);
    DBMS_OUTPUT.PUT_LINE('Lista produselor care ating sau depasesc acest pret:');

    FOR r IN PACHET_ANALIZA_STOC_CAF.c_stoc_scump(v_prag_maxim) LOOP
        DBMS_OUTPUT.PUT_LINE('Medicament ID: ' || r.id_stoc || ' | Pret unitar: ' || r.pret_unitar);
    END LOOP;
END;
/

--PL/SQL6
--e2
CREATE OR REPLACE TRIGGER trig_e2_CAF
BEFORE UPDATE OF commission_pct ON EMP_CAF
FOR EACH ROW
BEGIN
    IF :NEW.commission_pct > 0.5 THEN
       RAISE_APPLICATION_ERROR(-20001, 'Eroare: Comisionul nu poate depăși 50% din valoarea salariului!');
    END IF;
END;
/

--TEST
UPDATE emp_CAF
SET commission_pct = 0.6
WHERE employee_id = 100;

--e3
--a
CREATE TABLE info_dept_CAF (
    id NUMBER PRIMARY KEY,
    nume_dept VARCHAR2(50),
    plati NUMBER DEFAULT 0
);

INSERT INTO info_dept_CAF (id, nume_dept)
SELECT department_id, department_name FROM departments;

CREATE TABLE info_emp_CAF (
    id NUMBER PRIMARY KEY,
    nume VARCHAR2(50),
    prenume VARCHAR2(50),
    salariu NUMBER,
    id_dept NUMBER REFERENCES info_dept_CAF(id)
);

INSERT INTO info_emp_CAF (id, nume, prenume, salariu, id_dept)
SELECT employee_id, last_name, first_name, salary, department_id
FROM employees
WHERE department_id IS NOT NULL;

UPDATE info_dept_CAF d
SET plati = (SELECT NVL(SUM(salariu), 0) FROM info_emp_CAF e WHERE e.id_dept = d.id);

COMMIT;




ALTER TABLE info_dept_CAF ADD numar NUMBER DEFAULT 0;

UPDATE info_dept_CAF d
SET numar = (
    SELECT COUNT(*)
    FROM info_emp_CAF e
    WHERE e.id_dept = d.id
);
COMMIT;

--b
CREATE OR REPLACE TRIGGER trig_e3_nume
AFTER INSERT OR DELETE OR UPDATE OF id_dept ON info_emp_CAF
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        UPDATE info_dept_CAF
        SET numar = numar + 1
        WHERE id = :NEW.id_dept;

    ELSIF DELETING THEN
        UPDATE info_dept_CAF
        SET numar = numar - 1
        WHERE id = :OLD.id_dept;

    ELSIF UPDATING ('id_dept') THEN
        UPDATE info_dept_CAF
        SET numar = numar - 1
        WHERE id = :OLD.id_dept;

        UPDATE info_dept_CAF
        SET numar = numar + 1
        WHERE id = :NEW.id_dept;
    END IF;
END;
/

--TEST
SELECT id, numar FROM info_dept_CAF WHERE id = 10;

INSERT INTO info_emp_CAF (id, nume, prenume, salariu, id_dept)
VALUES (7777, 'Test', 'Trigger', 3000, 10);

SELECT id, numar FROM info_dept_CAF WHERE id = 10;
