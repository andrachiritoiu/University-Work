--E2. Modificați exercițiul anterior astfel încât să obțineți și următoarele informații:
--un număr de ordine pentru fiecare angajat care va fi resetat pentru fiecare job
-- pentru fiecare job
--  o numărul de angajați
--  o valoarea lunară a veniturilor angajaților
--  o valoarea medie a veniturilor angajaților
-- indiferent job
--  o numărul total de angajați
--  o valoarea totală lunară a veniturilor angajaților
--  o valoarea medie a veniturilor angajaților


DECLARE
  CURSOR c_jobs IS
    SELECT job_id, job_title
    FROM JOBS;

  CURSOR c_emp(p_job_id VARCHAR2) IS
    SELECT last_name, salary
    FROM EMP_CAF
    WHERE p_job_id=job_id;

    v_nr_crt  NUMBER := 0;
    v_nr_emp NUMBER := 0;
    v_suma NUMBER := 0;
    v_medie NUMBER := 0;

    v_total_emp NUMBER := 0;
    v_total_suma NUMBER := 0;
    v_total_medie NUMBER := 0;

BEGIN
    FOR i IN c_jobs LOOP
        v_nr_crt :=0;
        v_nr_emp := 0;
        v_suma := 0;

        DBMS_OUTPUT.PUT_LINE('--------');
        DBMS_OUTPUT.PUT_LINE('JOB: ' || i.job_title);

        FOR j in c_emp(i.job_id) LOOP
            v_nr_crt := v_nr_crt + 1;
            v_nr_emp := v_nr_emp + 1;
            v_suma := v_suma + j.salary;

            DBMS_OUTPUT.PUT_LINE(v_nr_crt || '. ' || j.last_name || ', Salariu: ' || j.salary);

            EXIT WHEN c_emp%NOTFOUND;
        END LOOP;

        v_total_emp := v_total_emp + v_nr_emp;
        v_total_suma := v_total_suma + v_suma;

        IF v_nr_emp >0 THEN
             v_medie := ROUND(v_suma/v_nr_emp, 2);
        DBMS_OUTPUT.PUT_LINE('Statistici Job:');
        DBMS_OUTPUT.PUT_LINE('Nr. Angajati: ' || v_nr_emp);
        DBMS_OUTPUT.PUT_LINE('Total Salarii: ' || v_suma);
        DBMS_OUTPUT.PUT_LINE('Medie Salarii: ' || v_medie);

        ELSE
            DBMS_OUTPUT.PUT_LINE('Nu exista angajati');
        END IF;

        EXIT WHEN c_jobs%NOTFOUND;
    END LOOP;

     IF v_total_emp >0 THEN
             v_total_medie := ROUND(v_total_suma/v_total_emp, 2);
        DBMS_OUTPUT.PUT_LINE('--------:');
        DBMS_OUTPUT.PUT_LINE('Statistici GLOBALE:');
        DBMS_OUTPUT.PUT_LINE('Nr. Angajati TOTAL: ' || v_total_emp);
        DBMS_OUTPUT.PUT_LINE('Total Salarii: ' || v_total_suma);
        DBMS_OUTPUT.PUT_LINE('Medie Salarii TOTAL: ' || v_total_medie);

     ELSE
            DBMS_OUTPUT.PUT_LINE('Nu exista angajati');
    END IF;

END;


--e6.Pentru fiecare Tip de Medicament (Tip Medicament), obțineți:
-- Denumirea Tipului de Medicament.
-- Lista detaliată a tuturor articolelor de Stoc care aparțin acelui tip de medicament. (Lista va include ID-ul de Stoc și data de expirare).

--cursor clasic
DECLARE
    CURSOR c_med IS
        SELECT id_tip,denumire
        FROM   TIP_MEDICAMENT;

    CURSOR c_stoc(p_id_tip VARCHAR2) IS
        SELECT id_stoc,data_expirare
        FROM   STOC
        WHERE id_tip=p_id_tip;

    v_id_tip TIP_MEDICAMENT.id_tip%TYPE;
    v_denumire TIP_MEDICAMENT.denumire%TYPE;

    v_id_stoc STOC.id_stoc%TYPE;
    v_data_expirare STOC.data_expirare%TYPE;

BEGIN
    OPEN c_med;
    LOOP
        FETCH c_med INTO v_id_tip, v_denumire;
        EXIT WHEN c_med%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('-------------------------------------');
        DBMS_OUTPUT.PUT_LINE ('TIP MEDICAMENT '|| v_denumire || '(' || v_id_tip || ')');
        DBMS_OUTPUT.PUT_LINE('-------------------------------------');

        OPEN c_stoc(v_id_tip);
        LOOP
            FETCH c_stoc INTO v_id_stoc, v_data_expirare;
            EXIT WHEN c_stoc%NOTFOUND;

            DBMS_OUTPUT.PUT_LINE(' - Stoc ID: ' || v_id_stoc || ', Expiră la: ' || TO_CHAR(v_data_expirare, 'DD-MON-YYYY'));
        END LOOP;
        CLOSE c_stoc;

    END LOOP;
    CLOSE c_med;

    END;
/

--ciclu cursor
DECLARE
    CURSOR c_med IS
        SELECT id_tip,denumire
        FROM   TIP_MEDICAMENT;

    CURSOR c_stoc(p_id_tip VARCHAR2) IS
        SELECT id_stoc,data_expirare
        FROM   STOC
        WHERE id_tip=p_id_tip;

BEGIN
    FOR i IN c_med LOOP
        EXIT WHEN c_med%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('-------------------------------------');
        DBMS_OUTPUT.PUT_LINE ('TIP MEDICAMENT '|| i.denumire || '(' || i.id_tip|| ')');
        DBMS_OUTPUT.PUT_LINE('-------------------------------------');

        FOR j IN c_stoc(i.id_tip) LOOP
            EXIT WHEN c_stoc%NOTFOUND;

            DBMS_OUTPUT.PUT_LINE(' - Stoc ID: ' || j.id_stoc || ', Expiră la: ' || TO_CHAR(j.data_expirare, 'DD-MON-YYYY'));
        END LOOP;
    END LOOP;
    END;
/



--ciclu cursor cu subcerere
DECLARE
    CURSOR c_med IS
        SELECT id_tip,denumire
        FROM   TIP_MEDICAMENT;

    CURSOR c_stoc(p_id_tip VARCHAR2) IS
        SELECT id_stoc,data_expirare
        FROM   STOC
        WHERE id_tip=p_id_tip;

BEGIN
    FOR i IN (
         SELECT id_tip,denumire
         FROM   TIP_MEDICAMENT
        )
        LOOP

        DBMS_OUTPUT.PUT_LINE('-------------------------------------');
        DBMS_OUTPUT.PUT_LINE ('TIP MEDICAMENT '|| i.denumire || '(' || i.id_tip|| ')');
        DBMS_OUTPUT.PUT_LINE('-------------------------------------');

        FOR j IN (
            SELECT id_stoc,data_expirare
            FROM   STOC
            WHERE id_tip=i.id_tip)
        LOOP
            DBMS_OUTPUT.PUT_LINE(' - Stoc ID: ' || j.id_stoc || ', Expiră la: ' || TO_CHAR(j.data_expirare, 'DD-MON-YYYY'));
        END LOOP;
    END LOOP;
    END;
/