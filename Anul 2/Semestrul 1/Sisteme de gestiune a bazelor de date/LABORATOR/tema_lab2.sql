-- TEMA

-- 7.Obs. Pentru rezolvare creați tabela title_copy_***, preluând structura și datele din tabela
-- title_copy.

CREATE TABLE TITLE_COPY_CAF AS
SELECT *
FROM TITLE_COPY;

-- SELECT *
-- FROM TITLE_COPY_CAF



-- A)Câte exemplare au statusul eronat?

SELECT COUNT(T.TITLE_ID)
FROM TITLE_COPY_CAF T
LEFT JOIN RENTAL R ON R.COPY_ID=T.COPY_ID AND R.TITLE_ID=T.TITLE_ID
WHERE (T.STATUS = 'RENTED' AND R.ACT_RET_DATE IS NOT NULL)
    OR (T.STATUS = 'AVAILABE' AND R.ACT_RET_DATE IS NULL);




-- B)Setați statusul corect pentru toate exemplarele care au statusul eronat. Salvați actualizările
-- realizate.

UPDATE TITLE_COPY_CAF T
SET STATUS = 'AVAILABLE'
WHERE EXISTS(
    SELECT 1
    FROM RENTAL R
    WHERE T.STATUS = 'RENTED' AND R.ACT_RET_DATE IS NOT NULL
    AND R.COPY_ID=T.COPY_ID AND R.TITLE_ID=T.TITLE_ID
);

UPDATE TITLE_COPY_CAF T
SET STATUS = 'RENTED'
WHERE EXISTS(
    SELECT 1
    FROM RENTAL R
    WHERE T.STATUS = 'AVAILABLE' AND R.ACT_RET_DATE IS NULL
    AND R.COPY_ID=T.COPY_ID AND R.TITLE_ID=T.TITLE_ID
);

COMMIT;

-- SELECT *
-- FROM TITLE_COPY_CAF;




-- 8.Toate filmele rezervate au fost împrumutate la data rezervării? Afișați textul “Da” sau ”Nu” în
-- funcție de situație.

SELECT
    CASE
        WHEN COUNT(*)=0 THEN 'DA'
        ELSE 'NU'
    END AS "TOATE_FILMELE_LA_DATA_REZERVARII"
FROM RESERVATION REZ
WHERE
    NOT EXISTS(
        SELECT 1
        FROM RENTAL RT
        WHERE RT.MEMBER_ID=REZ.MEMBER_ID AND RT.TITLE_ID=REZ.TITLE_ID AND RT.BOOK_DATE=REZ.RES_DATE
    );




-- 12. Pentru anumite zile specificate din luna curentă, obțineți numărul de împrumuturi efectuate.
--A)Se iau în considerare doar primele 2 zile din lună.

SELECT CAST(R.BOOK_DATE AS DATE) AS ZI,
    COUNT(*) AS NUMAR_IMPRUMUTURI
FROM RENTAL R
WHERE EXTRACT(MONTH FROM R.BOOK_DATE) = EXTRACT(MONTH FROM CURRENT_DATE) AND
    EXTRACT(YEAR FROM R.BOOK_DATE) = EXTRACT(YEAR FROM CURRENT_DATE) AND
    EXTRACT(DAY FROM R.BOOK_DATE) IN (1,2)
GROUP BY (CAST(R.BOOK_DATE AS DATE));



--B)Se iau în considerare doar zilele din lună în care au fost efectuate împrumuturi.
SELECT CAST(R.BOOK_DATE AS DATE) AS ZI,
    COUNT(*) AS NUMAR_IMPRUMUTURI
FROM RENTAL R
WHERE EXTRACT(MONTH FROM R.BOOK_DATE) = EXTRACT(MONTH FROM CURRENT_DATE) AND
    EXTRACT(YEAR FROM R.BOOK_DATE) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY (CAST(R.BOOK_DATE AS DATE));
