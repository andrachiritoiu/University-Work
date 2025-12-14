--Lab4
--2.Definiți o funcție stocată care primește ca parametru ID-ul unui client și returnează numărul său de telefon.

CREATE OR REPLACE FUNCTION f2_CAF
  (v_id client.id_client%TYPE)
RETURN VARCHAR2 IS
    v_telefon client.telefon%TYPE;
  BEGIN
    SELECT telefon INTO v_telefon
    FROM   CLIENT
    WHERE  id_client = v_id;
    RETURN v_telefon;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
       RAISE_APPLICATION_ERROR(-20000, 'Nu exista client cu id-ul dat');
    WHEN TOO_MANY_ROWS THEN
       RAISE_APPLICATION_ERROR(-20001, 'Exista mai multi clienti cu id-ul dat');
    WHEN OTHERS THEN
       RAISE_APPLICATION_ERROR(-20002,'Alta eroare!');
END f2_CAF;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE(
        'Telefon client: ' || f2_CAF(1)
    );
END;
/


-- 4.Definiți o procedură stocată care mărește cu 5% prețul unitar al tuturor produselor din STOC care depind direct sau indirect de un furnizor al cărui ID este primit ca parametru.
CREATE OR REPLACE PROCEDURE f4_CAF
    (p_id_furnizor FURNIZOR.id_furnizor%TYPE)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM FURNIZOR
    WHERE id_furnizor=p_id_furnizor;

    IF v_count=0 THEN
        RAISE_APPLICATION_ERROR(-20020, 'Furnizorul nu exista');
    END IF;

    UPDATE STOC s
    SET s.pret_unitar=s.pret_unitar*1.05
    WHERE s.id_tip IN(
        SELECT id_tip
        FROM VINDE
        WHERE id_furnizor=p_id_furnizor
        );


EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20021, 'Eroare la actualizarea stocului');

END f4_CAF;

BEGIN
    f4_CAF(1);
END;
/

SELECT *
FROM STOC;


--Lab 5
--E1
CREATE OR REPLACE PACKAGE pachet_angajati_CAF AS
    --f
    CURSOR c_angajati_job(p_job JOBS.job_id%TYPE)
        RETURN EMPLOYEES%ROWTYPE IS
    SELECT *
    FROM EMPLOYEES
    WHERE job_id = p_job;

    --g
    CURSOR c_joburi
        RETURN JOBS%ROWTYPE IS
    SELECT *
    FROM JOBS;


    --a
    FUNCTION f_sal_min(v_dep_id  DEPARTMENTS.department_id%TYPE, v_job JOBS.job_id%TYPE)
        RETURN EMPLOYEES.salary%TYPE;

    FUNCTION f_id_manager(v_nume EMPLOYEES.last_name%TYPE, v_prenume EMPLOYEES.first_name%TYPE)
        RETURN EMPLOYEES.employee_id%TYPE;

    FUNCTION f_id_dep(v_nume_dep DEPARTMENTS.department_name%TYPE)
        RETURN DEPARTMENTS.department_id%TYPE;

    FUNCTION f_job_id(v_nume_job JOBS.job_title%TYPE)
        RETURN JOBS.job_id%TYPE;

    PROCEDURE adauga_angajat(
        p_nume EMPLOYEES.last_name%TYPE,
        p_prenume EMPLOYEES.first_name%TYPE,
        p_telefon EMPLOYEES.phone_number%TYPE,
        p_email EMPLOYEES.email%TYPE,
        p_nume_mgr EMPLOYEES.last_name%TYPE,
        p_prenume_mgr EMPLOYEES.first_name%TYPE,
        p_dep_name DEPARTMENTS.department_name%TYPE,
        p_job_name JOBS.job_title%TYPE
    );

    --b
    PROCEDURE muta_angajat(
        p_nume EMPLOYEES.last_name%TYPE,
        p_prenume EMPLOYEES.first_name%TYPE,
        p_dep_nou DEPARTMENTS.department_name%TYPE,
        p_job_nou JOBS.job_title%TYPE,
        p_nume_mgr EMPLOYEES.last_name%TYPE,
        p_prenume_mgr EMPLOYEES.first_name%TYPE
    );


    --e
    PROCEDURE update_salariu(
        p_nume EMPLOYEES.last_name%TYPE,
        p_salariu NUMBER
    );

END pachet_angajati_CAF;
/


CREATE OR REPLACE PACKAGE BODY pachet_angajati_CAF AS
    --a
     FUNCTION f_sal_min(v_dep_id  DEPARTMENTS.department_id%TYPE, v_job JOBS.job_id%TYPE)
     RETURN EMPLOYEES.salary%TYPE IS
         v_sal EMPLOYEES.salary%TYPE;
     BEGIN
         SELECT MIN(salary)
         INTO v_sal
         FROM EMPLOYEES
         WHERE v_dep_id = department_id
            AND v_job = job_id;
         RETURN v_sal;
    END;

    FUNCTION f_id_manager(v_nume EMPLOYEES.last_name%TYPE, v_prenume EMPLOYEES.first_name%TYPE)
    RETURN EMPLOYEES.employee_id%TYPE IS
        v_id EMPLOYEES.employee_id%TYPE;
    BEGIN
        SELECT employee_id
        INTO v_id
        FROM EMPLOYEES
        WHERE last_name = v_nume
        AND first_name = v_prenume;

    RETURN v_id;
    END;

    FUNCTION f_id_dep(v_nume_dep DEPARTMENTS.department_name%TYPE)
    RETURN DEPARTMENTS.department_id%TYPE IS
        v_id DEPARTMENTS.department_id%TYPE;
    BEGIN
        SELECT department_id
        INTO v_id
        FROM DEPARTMENTS
        WHERE department_name = v_nume_dep;

    RETURN v_id;
    END;

    FUNCTION f_job_id(v_nume_job JOBS.job_title%TYPE)
    RETURN JOBS.job_id%TYPE IS
        v_id JOBS.job_id%TYPE;
    BEGIN
        SELECT job_id
        INTO v_id
        FROM JOBS
        WHERE job_title = v_nume_job;

    RETURN v_id;
    END;

    PROCEDURE adauga_angajat(
    p_nume EMPLOYEES.last_name%TYPE,
    p_prenume EMPLOYEES.first_name%TYPE,
    p_telefon EMPLOYEES.phone_number%TYPE,
    p_email EMPLOYEES.email%TYPE,
    p_nume_mgr EMPLOYEES.last_name%TYPE,
    p_prenume_mgr EMPLOYEES.first_name%TYPE,
    p_dep_name DEPARTMENTS.department_name%TYPE,
    p_job_name JOBS.job_title%TYPE
    ) IS
        v_mgr EMPLOYEES.employee_id%TYPE;
        v_dep DEPARTMENTS.department_id%TYPE;
        v_job JOBS.job_id%TYPE;
        v_sal EMPLOYEES.salary%TYPE;
    BEGIN
        v_mgr := f_id_manager(p_nume_mgr, p_prenume_mgr);
        v_dep := f_id_dep(p_dep_name);
        v_job := f_job_id(p_job_name);
        v_sal := f_sal_min(v_dep, v_job);

    INSERT INTO EMPLOYEES
    VALUES (
        employees_seq.NEXTVAL,
        p_prenume,
        p_nume,
        p_email,
        p_telefon,
        SYSDATE,
        v_job,
        v_sal,
        NULL,
        v_mgr,
        v_dep
    );
    END;

    --b
    PROCEDURE muta_angajat(
        p_nume EMPLOYEES.last_name%TYPE,
        p_prenume EMPLOYEES.first_name%TYPE,
        p_dep_nou DEPARTMENTS.department_name%TYPE,
        p_job_nou JOBS.job_title%TYPE,
        p_nume_mgr EMPLOYEES.last_name%TYPE,
        p_prenume_mgr EMPLOYEES.first_name%TYPE
    ) IS
        v_id EMPLOYEES.employee_id%TYPE;
        v_dep DEPARTMENTS.department_id%TYPE;
        v_job JOBS.job_id%TYPE;
        v_mgr EMPLOYEES.employee_id%TYPE;
        v_sal_cur EMPLOYEES.salary%TYPE;
        v_sal_min EMPLOYEES.salary%TYPE;
    BEGIN
        SELECT employee_id, salary
        INTO v_id, v_sal_cur
        FROM EMPLOYEES
        WHERE last_name = p_nume
          AND first_name = p_prenume;

        v_dep := f_id_dep(p_dep_nou);
        v_job := f_job_id(p_job_nou);
        v_mgr := f_id_manager(p_nume_mgr, p_prenume_mgr);
        v_sal_min := f_sal_min(v_dep, v_job);

        INSERT INTO JOB_HISTORY
        VALUES (v_id, SYSDATE, SYSDATE, v_job, v_dep);

        UPDATE EMPLOYEES
        SET department_id = v_dep,
            job_id = v_job,
            manager_id = v_mgr,
            salary = GREATEST(v_sal_cur, v_sal_min),
            hire_date = SYSDATE
        WHERE employee_id = v_id;
    END;

    --e
    PROCEDURE update_salariu(
        p_nume EMPLOYEES.last_name%TYPE,
        p_salariu NUMBER
    ) IS
        v_count NUMBER;
        v_job JOBS.job_id%TYPE;
        v_min JOBS.min_salary%TYPE;
        v_max JOBS.max_salary%TYPE;
    BEGIN
        SELECT COUNT(*)
        INTO v_count
        FROM EMPLOYEES
        WHERE last_name = p_nume;

        IF v_count = 0 THEN
            DBMS_OUTPUT.PUT_LINE('Nu exista angajat cu acest nume');

        ELSIF v_count > 1 THEN
            DBMS_OUTPUT.PUT_LINE('Exista mai multi angajati cu acest nume');
            FOR e IN (SELECT first_name, salary
                      FROM EMPLOYEES
                      WHERE last_name = p_nume) LOOP
                DBMS_OUTPUT.PUT_LINE(e.first_name || ' ' || e.salary);
            END LOOP;

        ELSE
            SELECT job_id
            INTO v_job
            FROM EMPLOYEES
            WHERE last_name = p_nume;

            SELECT min_salary, max_salary
            INTO v_min, v_max
            FROM JOBS
            WHERE job_id = v_job;

            IF p_salariu BETWEEN v_min AND v_max THEN
                UPDATE EMPLOYEES
                SET salary = p_salariu
                WHERE last_name = p_nume;
            ELSE
                DBMS_OUTPUT.PUT_LINE('Salariul nu respecta limitele jobului');
            END IF;
        END IF;
    END;

END pachet_angajati_CAF;


--Verificare
--a
BEGIN
  pachet_angajati_CAF.adauga_angajat(
    p_nume        => 'Popescu',
    p_prenume     => 'Ion',
    p_telefon     => '0712345678',
    p_email       => 'IPOPESCU',
    p_nume_mgr    => 'King',
    p_prenume_mgr => 'Steven',
    p_dep_name    => 'Sales',
    p_job_name    => 'Sales Representative'
  );
END;
/

SELECT last_name, department_id, job_id, salary
FROM EMPLOYEES
WHERE last_name = 'Popescu';


--b
BEGIN
  pachet_angajati_CAF.muta_angajat(
    p_nume        => 'Popescu',
    p_prenume     => 'Ion',
    p_dep_nou     => 'IT',
    p_job_nou     => 'Programmer',
    p_nume_mgr    => 'Hunold',
    p_prenume_mgr => 'Alexander'
  );
END;
/
SELECT department_id, job_id, manager_id, salary
FROM EMPLOYEES
WHERE last_name = 'Popescu';


--e
BEGIN
  pachet_angajati_CAF.update_salariu('Popescu', 9000);
END;
/
SELECT last_name, salary
FROM EMPLOYEES
WHERE last_name = 'Popescu';


--f
DECLARE
    v_emp EMPLOYEES%ROWTYPE;
BEGIN
    OPEN pachet_angajati_CAF.c_angajati_job('IT_PROG');

    LOOP
        FETCH pachet_angajati_CAF.c_angajati_job INTO v_emp;
        EXIT WHEN pachet_angajati_CAF.c_angajati_job%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(
            v_emp.last_name || ' ' ||
            v_emp.first_name || ' | Salariu: ' ||
            v_emp.salary
        );
    END LOOP;

    CLOSE pachet_angajati_CAF.c_angajati_job;
END;
/



--g
DECLARE
  v_job JOBS%ROWTYPE;
BEGIN
  OPEN pachet_angajati_CAF.c_joburi;
  LOOP
    FETCH pachet_angajati_CAF.c_joburi INTO v_job;
    EXIT WHEN pachet_angajati_CAF.c_joburi%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE(v_job.job_id || ' - ' || v_job.job_title);
  END LOOP;
  CLOSE pachet_angajati_CAF.c_joburi;
END;
/
