DECLARE
    TYPE p_angajat IS RECORD(
        empl_id EMP_CAF.employee_id%TYPE,
        sal EMP_CAF.salary%TYPE
    );
    TYPE tablou_imbr IS TABLE OF p_angajat;

    v_angajati tablou_imbr;
BEGIN
    v_angajati := tablou_imbr();

    SELECT employee_id,salary
    BULK COLLECT INTO v_angajati
    FROM(
        SELECT employee_id,salary
        FROM EMP_CAF
        WHERE commission_pct is NULL
        ORDER BY salary asc
        )
    WHERE ROWNUM <= 5;

    FOR i in v_angajati.FIRST .. v_angajati.LAST LOOP
        UPDATE EMP_CAF
        SET salary = salary + salary*0.05
        WHERE employee_id = v_angajati(i).empl_id;

        DBMS_OUTPUT.PUT_LINE(
            'Angajat ID: ' || v_angajati(i).empl_id ||
            ' | Vechi: ' || v_angajati(i).sal ||
            ' | Nou: ' || (v_angajati(i).sal * 0.05 + v_angajati(i).sal)
        );

    END LOOP;
END;