--9
CREATE OR REPLACE TYPE tip_stocuri_coamnda AS VARRAY(10) OF NUMBER(4)
/
CREATE TABLE comanda_test_CAF(
    id_comanda NUMBER(10) PRIMARY KEY,
    data_comanda date,
    stocuri_comanda tip_stocuri_coamnda
);

DECLARE
    v_stoc tip_stocuri_coamnda := tip_stocuri_coamnda(1,2,3);
    v_lista comanda_test_CAF.stocuri_comanda%TYPE;

BEGIN
    INSERT INTO comanda_test_CAF
    VALUES(1,SYSDATE,v_stoc);

    INSERT INTO comanda_test_CAF
    VALUES(2,SYSDATE,null);

    INSERT INTO comanda_test_CAF
    VALUES(3,SYSDATE,tip_stocuri_coamnda(4,5));

    SELECT stocuri_comanda
    INTO v_lista
    FROM comanda_test_CAF
    WHERE id_comanda=1;

    FOR j IN v_lista.FIRST..v_lista.LAST loop
        DBMS_OUTPUT.PUT_LINE(v_lista(j));
    END LOOP;
END;
/
SELECT *
FROM comanda_test_CAF;



-- 10.
CREATE TABLE client_test_CAF AS
    SELECT id_client, nume
    FROM CLIENT
    WHERE ROWNUM <= 2;

CREATE OR REPLACE TYPE tip_emailuri_CAF IS TABLE OF VARCHAR(50);

ALTER TABLE client_test_CAF
ADD (alte_emailuri tip_emailuri_CAF)
NESTED TABLE alte_emailuri STORE AS tabel_emailuri_CAF;

INSERT INTO client_test_CAF
VALUES (50, 'Ionescu', tip_emailuri_CAF('ionescu_job@domeniu.ro', 'ionescu_personal@altundeva.ro'));

UPDATE client_test_CAF
SET alte_emailuri = tip_emailuri_CAF('contact@ionescu.ro', 'p.rezerva@mail.com')
WHERE id_client = 50;

SELECT C.id_client, C.nume, T.COLUMN_VALUE AS adresa_email
FROM client_test_CAF C, TABLE (C.alte_emailuri) T;

DROP TABLE client_test_CAF;
DROP TYPE tip_emailuri_CAF;
