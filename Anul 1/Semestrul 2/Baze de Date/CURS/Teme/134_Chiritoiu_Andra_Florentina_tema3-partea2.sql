--A
--1.Care sunt clienții care au lansat comenzi în anul curent?
SELECT C.NUME
FROM CLIENT C
JOIN COMANDA CO ON C.ID_CLIENT=CO.ID_CLIENT
WHERE TO_CHAR(CO.DATA_COMANDA, 'YYYYY') = '2025';

--2. Să se obțină numele funcționarilor care au preluat comenzi de livrare la care au participat cel puțin 2 autovehicule.
SELECT DISTINCT F.NUME
FROM FUNCTIONAR F
JOIN COMANDA CO ON CO.COD_ANGAJAT=F.COD_ANGAJAT
JOIN AUTOVEHICUL A ON A.ID_COMANDA=CO.ID_COMANDA
GROUP BY F.NUME, CO.ID_COMANDA
HAVING COUNT(DISTINCT A.ID_AUTOVEHICUL) >= 2;

--3.  Ce autovehicule au participat la livrarea comenzii având cea mai mare valoare declarată din luna martie 2024?
SELECT A.ID_AUTOVEHICUL
FROM AUTOVEHICUL A
JOIN COMANDA CO ON CO.ID_COMANDA=A.ID_COMNDA
WHERE TO_CHAR(CO.DATA_COMANDA,'MMYYYY')='032024'
AND (SELECT MAX(C.VALOARE_COMNADA)
     FROM COMANDA C
     WHERE TO_CHAR(C.DATA_COMANDA,'MMYYYY')='032024'
    );

--4.Care sunt persoanele implicate (client, funcționar, curieri) în cea mai recentă comanda care a fost transportată într-un oras diferit de cel de ridicare a coletului ?
SELECT CL.NUME, F.NUME, CU.NUME
FROM CLIENT CL
JOIN COMANDA C ON C.ID_CLIENT=CL.ID_CLIENT
JOIN CURIER CU ON CU.COD_ANGAJAT=C.COD_ANGAJAT
JOIN FUNCTIONAR F ON F.COD_ANGAJAT=C.COD_ANGAJAT
WHERE C.ADRESA_RIDICARE!=C.ADRESA_RECEPTIE
AND C.DATA_COMANDA=(
    SELECT MAX(C2.DATA_COMANDA)
    FROM COMANDA C2
    WHERE  C2.ADRESA_RIDICARE!=C2.ADRESA_RECEPTIE
    );

--5.Care sunt curierii care au participat la livrări comandate în luna aprilie 2025, pentru care au folosit vehicule de capacitate 1t?
SELECT DISTINCT CU.NUME
FROM CURIER CU
JOIN COMANDA C ON C.COD_ANGAJAT=CU.COD_ANGAJAT
JOIN AUTOVEHICULE A ON A.ID_COMANDA=C.ID_COMANDA
WHERE TO_CHAR(C.DATA_COMANDA,'MMYYYY')='042025'
AND A.CAPACITATE=1000;

--C

--1
-- Limbaj natural: Afișează comenzile care au valoarea mai mare de 1000 lei.

-- Algebră relațională:
-- σ(valoare_comanda > 1000)(COMANDA)

-- SQL:
SELECT *
FROM COMANDA
WHERE VALOARE_COMANDA > 1000;

--2
-- Limbaj natural: Afișează numele și telefonul tuturor clienților.

-- Algebră relațională:
-- π(nume, telefon)(CLIENT)

--SQL
SELECT NUME, TELEFON
FROM CLIENT;

--3
-- Limbaj natural: Afișează codurile angajaților care sunt funcționari sau curieri.

-- Algebră relațională:
--π(cod_angajat)(FUNCȚIONAR) ∪ π(cod_angajat)(CURIER)

--SQL
SELECT COD_ANGAJAT
FROM ANGAJAT A
WHERE A.COD_ANGAJAT IN (
    SELECT COD_ANGAJAT FROM FUNCȚIONAR
)
OR A.COD_ANGAJAT IN (
    SELECT COD_ANGAJAT FROM CURIER
);

--4
--Limbaj natural: Afișează comenzile care nu folosesc autovehicule.

--Algebră relațională:
--π(id_comanda)(COMANDA) − π(id_comanda)(FOLOSEȘTE)

--SQL
SELECT ID_COMANDA
FROM COMANDA
WHERE ID_COMANDA NOT IN (
    SELECT ID_COMANDA
    FROM AUTOVEHICUL
    WHERE ID_COMANDA IS NOT NULL
);

--5
--Limbaj natural: Afișează numele clienților și adresele de ridicare ale comenzilor pe care le-au făcut.

--Algebră relațională:
--COMANDA ⨝ CLIENT

--SQL
SELECT CL.NUME, C.ADRESA_RIDICARE
FROM COMANDA C
JOIN CLIENT CL ON C.ID_CLIENT = CL.ID_CLIENT;
