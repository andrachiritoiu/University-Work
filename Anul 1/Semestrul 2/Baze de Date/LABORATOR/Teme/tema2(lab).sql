--TEMA2
--1.Sa se afiseze pentru fiecare oras numele si numarul de clienti care au avut vizite in orasul
--respectiv (o vizita este valida daca rezervarea a fost confirmata).

SELECT P.ORAS, COUNT(DISTINCT R.ID_CLIENT) AS NUMAR_CLIENTI
FROM PROPRIETATI P
JOIN REZERVARI R ON R.ID_PROPRIETATE=P.ID_PROPRIETATE
WHERE R.STATUS = 'CONFIRMATA'
GROUP BY P.ORAS;


--2.Sa se afiseze clientii (id si nume) care au efectuat exclusiv plati cash si au cel putin 3
--review-uri cu rating mai mare sau egal cu 2.

SELECT DISTINCT C.ID_CLIENT,C.NUME
FROM CLIENTI C
JOIN REZERVARI R ON R.ID_CLIENT=C.ID_CLIENT
JOIN PLATI P ON P.ID_REZERVARE=R.ID_REZERVARE
JOIN REVIEWS RW ON RW.ID_CLIENT=C.ID_CLIENT
WHERE C.ID_CLIENT NOT IN (
    SELECT R2.ID_CLIENT
    FROM REZERVARI R2
    JOIN PLATI P1 ON R2.ID_REZERVARE=P1.ID_REZERVARE
    WHERE P1.METODA!='CASH'
    )
    AND RW.ID_CLIENT IN
        (SELECT RW1.ID_CLIENT
         FROM REVIEWS RW1
         WHERE RW1.RATING >= 2
         GROUP BY RW1.ID_CLIENT
         HAVING COUNT(RW1.ID_REVIEW)>=3
    );

--3. Sa se afize primii N clienti (id si nume) in functie de totalul cheltuielilor pe rezervari, unde
--N reprezinta numarul de proprietati care au fost rezervate in 2025 (indiferent daca rezervarea
--a fost confirmata sau anulata.)

-- in functie de totalul cheltuielilor pe rezervari
SELECT *
FROM (
    SELECT C1.ID_CLIENT,C1.NUME,SUM(P.PRET_PER_NOAPTE*(R1.DATA_CHECK_OUT-R1.DATA_CHECK_IN)) AS CHELTUIELI
    FROM REZERVARI R1
    JOIN CLIENTI C1 ON C1.ID_CLIENT=R1.ID_CLIENT
    JOIN PROPRIETATI P ON P.ID_PROPRIETATE=R1.ID_PROPRIETATE
    GROUP BY C1.ID_CLIENT, C1.NUME
    ORDER BY CHELTUIELI DESC
    )
WHERE ROWNUM <=
      (SELECT COUNT(DISTINCT R2.ID_PROPRIETATE)
       FROM REZERVARI R2
       WHERE TO_CHAR(R2.DATA_CHECK_IN, 'YYYY') = '2025'
      );


-- in functie de totalul cheltuielilor pe rezervari in 2025
SELECT *
FROM (
    SELECT C1.ID_CLIENT,C1.NUME,SUM(P.PRET_PER_NOAPTE*(R1.DATA_CHECK_OUT-R1.DATA_CHECK_IN)) AS CHELTUIELI
    FROM REZERVARI R1
    JOIN CLIENTI C1 ON C1.ID_CLIENT=R1.ID_CLIENT
    JOIN PROPRIETATI P ON P.ID_PROPRIETATE=R1.ID_PROPRIETATE
    WHERE TO_CHAR(R1.DATA_CHECK_IN, 'YYYY') = '2025'
    GROUP BY C1.ID_CLIENT, C1.NUME
    ORDER BY CHELTUIELI DESC
    )
WHERE ROWNUM <=
      (SELECT COUNT(DISTINCT R2.ID_PROPRIETATE)
       FROM REZERVARI R2
       WHERE TO_CHAR(R2.DATA_CHECK_IN, 'YYYY') = '2025'
      );


