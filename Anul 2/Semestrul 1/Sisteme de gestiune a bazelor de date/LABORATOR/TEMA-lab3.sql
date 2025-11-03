--Tema 3
--E1.

SET SERVEROUTPUT ON

DECLARE
 numar number(3):=100;
 mesaj1 varchar2(255):='text 1';
 mesaj2 varchar2(255):='text 2';
BEGIN
  DECLARE
   numar number(3):=1;
   mesaj1 varchar2(255):='text 2';
   mesaj2 varchar2(255):='text 3';
BEGIN
numar:=numar+1;
mesaj2:=mesaj2||' adaugat in sub-bloc';

DBMS_OUTPUT.PUT_LINE('numar in subbloc: ' || numar);
DBMS_OUTPUT.PUT_LINE('mesaj1 in subbloc: ' || mesaj1);
DBMS_OUTPUT.PUT_LINE('mesaj2 in subbloc: ' || mesaj2);
    
END;
numar:=numar+1;
mesaj1:=mesaj1||' adaugat un blocul principal';
mesaj2:=mesaj2||' adaugat in blocul principal';

DBMS_OUTPUT.PUT_LINE('numar in bloc: ' || numar);
DBMS_OUTPUT.PUT_LINE('mesaj1 in bloc: ' || mesaj1);
DBMS_OUTPUT.PUT_LINE('mesaj2 in bloc: ' || mesaj2);

END;





--E3.

DECLARE
    v_nume_membru VARCHAR(100) := '&nume_membru';
    v_id_membru MEMBER.MEMBER_ID%TYPE;
    v_numar_filme NUMBER:=0;
    
BEGIN
    SELECT member_id
    INTO v_id_membru
    FROM MEMBER
    WHERE last_name = v_nume_membru;
    
    SELECT COUNT(DISTINCT title_id)
    INTO v_numar_filme
    FROM RENTAL R
    WHERE R.member_id = v_id_membru;
    
    DBMS_OUTPUT.PUT_LINE('Membrul cu numele ' || v_nume_membru ||
                             ' a împrumutat ' || NVL(v_numar_filme,0) || ' filme.');
END;

