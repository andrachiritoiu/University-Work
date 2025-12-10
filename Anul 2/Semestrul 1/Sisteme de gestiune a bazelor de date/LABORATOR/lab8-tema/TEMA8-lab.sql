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