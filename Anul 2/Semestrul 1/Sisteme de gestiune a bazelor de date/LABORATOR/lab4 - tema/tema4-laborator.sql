-- SGBD
-- Tema lab
-- 4.Definiți un bloc anonim în care să se afle numele și prenumele Clientului care deține cel mai mare număr de Animale înregistrate.

DECLARE
  v_client_nume CLIENT.nume%TYPE;
  v_client_prenume CLIENT.prenume%TYPE;
BEGIN
  SELECT c.nume, c.prenume
  INTO   v_client_nume, v_client_prenume
  FROM   CLIENT c
  JOIN   ANIMAL a ON c.id_client = a.id_client
  GROUP BY c.nume, c.prenume
  HAVING COUNT(a.id_animal) = (
    SELECT MAX(COUNT(*))
    FROM   ANIMAL
    GROUP BY id_client
  );
  DBMS_OUTPUT.PUT_LINE('Clientul cu cele mai multe animale inregistrate este: ' || v_client_nume || ' ' || v_client_prenume);
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('Nu exista clienti cu animale inregistrate in baza de date.');
  WHEN TOO_MANY_ROWS THEN
    DBMS_OUTPUT.PUT_LINE('ATENTIE: Exista mai multi clienti cu acelasi numar maxim de animale. Unul dintre ei este: ' || v_client_nume || ' ' || v_client_prenume);
END;
/



-- 7.Determinați valoarea Comisionului pe care îl primește un Medic Veterinar al cărui cod (id_personal_medical) este dat de la tastatură, pe baza numărului de Consultații efectuate, folosind instrucțiunea IF.

DECLARE
   v_cod_client CLIENT.id_client%TYPE := &p_cod_client;
   v_nr_comenzi NUMBER;
   v_bonus      NUMBER(8);

BEGIN
   SELECT COUNT(c.id_comanda) INTO v_nr_comenzi
   FROM   COMANDA c
   JOIN   COMANDA_CLIENT cc ON c.id_comanda = cc.id_comanda
   WHERE  cc.id_client = v_cod_client;

   IF v_nr_comenzi >= 10 THEN
      v_bonus := 500;
   ELSIF v_nr_comenzi >= 5 AND v_nr_comenzi < 10 THEN
      v_bonus := 200;
   ELSIF v_nr_comenzi > 0 AND v_nr_comenzi < 5 THEN
      v_bonus := 50;
   ELSE
      v_bonus := 0;
   END IF;

   DBMS_OUTPUT.PUT_LINE('Clientul ' || v_cod_client || ' are ' || v_nr_comenzi || ' comenzi plasate.');
   DBMS_OUTPUT.PUT_LINE('Bonusul acordat este: ' || v_bonus || ' RON.');

EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('Eroare: Nu exista un client cu ID-ul ' || v_cod_client);
END;
/


-- 9.Scrieți un bloc PL/SQL în care stocați prin variabile de substituție un Cod de Stoc (id_stoc), un Procent de creșterea
-- prețului și un număr de luni pentru extinderea datei de expirare. Măriți prețul unitar și extindeți data de expirare a produsului din stocul respectiv. Afișați mesajul de succes/eșec folosind SQL%ROWCOUNT. Anulați modificările realizate (ROLLBACK).

-- DEFINE p_id_stoc = 15
-- DEFINE p_procent_crestere = 10
-- DEFINE p_luni_adaugate = 6

DECLARE
  v_id_stoc STOC.id_stoc%TYPE := &p_id_stoc;
  v_procent NUMBER(5,2)       := &p_procent_crestere;
  v_luni    NUMBER            := &p_luni_adaugate;
BEGIN
  UPDATE STOC
  SET    pret_unitar = pret_unitar * (1 + v_procent/100),
         data_expirare = ADD_MONTHS(data_expirare, v_luni)
  WHERE  id_stoc = v_id_stoc;

  IF SQL%ROWCOUNT = 0 THEN
     DBMS_OUTPUT.PUT_LINE('Nu exista o inregistrare de stoc cu ID-ul ' || v_id_stoc || '. Nicio actualizare realizata.');
  ELSE
     DBMS_OUTPUT.PUT_LINE('Actualizare realizata: ' || SQL%ROWCOUNT || ' rand(uri) afectate in STOC.');
     DBMS_OUTPUT.PUT_LINE('Pretul a crescut cu ' || v_procent || '%, iar expirarea a fost prelungita cu ' || v_luni || ' luni.');
  END IF;

  ROLLBACK;
  DBMS_OUTPUT.PUT_LINE('ATENTIE: Modificarile DML au fost anulate (ROLLBACK) pentru a pastra integritatea datelor de stoc.');
END;
/