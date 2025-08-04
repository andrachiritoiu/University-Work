-- TEMA 1
--1. Sa se afiseze pentru fiecare artist numele si cate formatii a avut in deschidere
-- (ATENTIE: daca o formatie a cantat de mai multe ori in deschiderea unui artist, atunci
-- se va contoriza o singura data)

SELECT A.NUME, COUNT(DISTINCT C.ID_ARTIST_DESCHIDERE)
FROM ARTISTI A
JOIN TURNEE T ON T.ID_ARTIST=A.ID_ARTIST
JOIN CONCERTE C ON C.ID_TURNEU=T.ID_TURNEU
JOIN ARTISTI AD ON AD.ID_ARTIST = C.ID_ARTIST_DESCHIDERE
WHERE AD.TIP='FORMATIE'
GROUP BY A.NUME, A.ID_ARTIST;


--2.Sa se afiseze pentru fiecare artist numele si numarul de albume lansate inainte de data
-- ultimului premiu castigat. Se vor lua in considerare doar acei artisti care au sustinut
-- cel putin 3 concerte in anul 2024.

SELECT A.NUME, COUNT(DISTINCT AL.ID_ALBUM) AS "NUMAR ALBUME"
FROM ARTISTI A
JOIN ALBUME AL ON AL.ID_ARTIST=A.ID_ARTIST
WHERE A.ID_ARTIST IN(
        SELECT A1.ID_ARTIST
        FROM ARTISTI A1
        JOIN TURNEE T1 ON T1.ID_ARTIST=A1.ID_ARTIST
        JOIN CONCERTE C1 ON C1.ID_TURNEU=T1.ID_TURNEU
        WHERE TO_CHAR(C1.DATA,'YYYY')='2024'
        GROUP BY A1.ID_ARTIST
        HAVING COUNT(DISTINCT C1.ID_CONCERT)>=3)
    AND AL.AN_LANSARE < (
        SELECT MAX(P.AN_DECERNARE)
        FROM PREMII_CASTIGATE P
        WHERE P.ID_ARTIST=A.ID_ARTIST
    )
GROUP BY A.NUME;


--3.Sa se afiseze pentru fiecare artist venitul obtinut in anul 2025 la concerte unde au avut
--in deschidere un artist care a castigat cel putin 3 premii.

SELECT A.NUME,SUM(C.VENIT) AS "VENIT 2025"
FROM CONCERTE C
JOIN TURNEE T ON T.ID_TURNEU=C.ID_TURNEU
JOIN ARTISTI A ON A.ID_ARTIST=T.ID_ARTIST
WHERE TO_CHAR(C.DATA,'YYYY')='2025'
    AND C.ID_ARTIST_DESCHIDERE IN(
        SELECT A1.ID_ARTIST
        FROM ARTISTI A1
        JOIN PREMII_CASTIGATE P ON P.ID_ARTIST=A1.ID_ARTIST
        GROUP BY A1.ID_ARTIST
        HAVING COUNT(DISTINCT P.ID_PREMIU)>=3
    )
GROUP BY A.NUME, A.ID_ARTIST;





