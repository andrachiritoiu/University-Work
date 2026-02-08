--ex7.subprogram cu 2 cursoare - pt un interval de date => clientul cu med
INSERT INTO CODURI_EROARE (cod_eroare, descriere, entitate_afectata)
SELECT -20002,
       'Nu exista comenzi in intervalul specificat.',
       'COMANDA/COMANDA_CLIENT'
FROM dual
WHERE NOT EXISTS (
    SELECT 1 FROM CODURI_EROARE WHERE cod_eroare = -20002
);

COMMIT;

CREATE OR REPLACE PROCEDURE ex7_comenzi(
    p_data_start IN DATE,
    p_data_sfarsit IN DATE
)
IS
    nr_comenzi NUMBER := 0;
    
    --cursor clasic(explicit)
    CURSOR c_detalii(p_id_comanda COMANDA.id_comanda%TYPE) IS
        SELECT m.denumire, a.cantitate, a.pret_vanzare_final, a.discount
        FROM ARE a
        JOIN STOC s ON s.id_stoc = a.id_stoc
        JOIN MEDICAMENT m ON m.id_medicament = s.id_medicament
        WHERE a.id_comanda = p_id_comanda
        ORDER BY m.denumire;
        
        detalii_comanda c_detalii%ROWTYPE;

BEGIN
    --ciclu cursor cu subcerere
    FOR comanda IN (
        SELECT c.id_comanda, c.data_comanda, cl.prenume || ' ' || cl.nume AS client, cc.metoda_plata
        FROM COMANDA c
        JOIN COMANDA_CLIENT cc ON cc.id_comanda = c.id_comanda
        JOIN CLIENT cl ON cl.id_client = cc.id_client
        WHERE  c.data_comanda BETWEEN p_data_start AND p_data_sfarsit
        ORDER BY c.id_comanda
    )LOOP
    
        nr_comenzi := nr_comenzi+1;
    
        DBMS_OUTPUT.PUT_LINE('Comanda #' || comanda.id_comanda || ' (' || TO_CHAR(comanda.data_comanda,'YYYY-MM-DD') || ')');
        DBMS_OUTPUT.PUT_LINE('Client: ' || comanda.client);
        DBMS_OUTPUT.PUT_LINE('Metoda plata: ' || comanda.metoda_plata);
        DBMS_OUTPUT.PUT_LINE('Produse (medicamente):');
    
        OPEN c_detalii(comanda.id_comanda); 
        FETCH c_detalii INTO detalii_comanda;
        
        IF c_detalii%FOUND THEN
            LOOP
                 DBMS_OUTPUT.PUT_LINE(
                    '  - ' || detalii_comanda.denumire ||
                    ' | cant=' || detalii_comanda.cantitate ||
                    ' | pret_final=' || detalii_comanda.pret_vanzare_final ||
                    ' | disc=' || detalii_comanda.discount || '%'
                );
                
                FETCH c_detalii INTO detalii_comanda;
                EXIT WHEN c_detalii%NOTFOUND;
                
             END LOOP;
        ELSE
            DBMS_OUTPUT.PUT_LINE('  (nu exista medicamente asociate acestei comenzi)');
        END IF;
        
        CLOSE c_detalii;
        
        DBMS_OUTPUT.NEW_LINE;

    END LOOP;
    
    IF nr_comenzi = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Nu au fost gasite comenzi in intervalul specificat.');
    ELSIF nr_comenzi = 1 THEN
        DBMS_OUTPUT.PUT_LINE('Au fost afisate informatii despre o singura comanda.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Au fost afisate informatii despre ' || nr_comenzi || ' comenzi.');
    END IF;



EXCEPTION
 WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Eroare: ' || SQLERRM);
        RAISE;

END ex7_comenzi;
/


--APEL
BEGIN
  --nu  sunt comenzi
  BEGIN
    ex7_comenzi(DATE '2024-01-01', DATE '2024-01-31');
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Test eroare OK: ' || SQLERRM);
  END;

  DBMS_OUTPUT.NEW_LINE;

  --sunt comenzi
  ex7_comenzi(DATE '2025-04-01', DATE '2025-04-30');
END;
/