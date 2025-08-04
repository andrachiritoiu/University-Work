CREATE SEQUENCE CLIENT_SEQ START WITH 1;
CREATE SEQUENCE ANIMAL_SEQ START WITH 1;
CREATE SEQUENCE CONSULTATIE_SEQ START WITH 1;
CREATE SEQUENCE RETETA_SEQ START WITH 1;
CREATE SEQUENCE STOC_SEQ START WITH 1;
CREATE SEQUENCE TIP_MEDICAMENT_SEQ START WITH 1;
CREATE SEQUENCE FURNIZOR_SEQ START WITH 1;
CREATE SEQUENCE FACTURA_SEQ START WITH 1;
CREATE SEQUENCE PERSONAL_MEDICAL_SEQ START WITH 1;
CREATE SEQUENCE PROGRAM_SEQ START WITH 1;
CREATE SEQUENCE CAMPANIE_SEQ START WITH 1;
CREATE SEQUENCE COMANDA_SEQ START WITH 1;

CREATE TABLE CLIENT (
  id_client INT DEFAULT CLIENT_SEQ.NEXTVAL PRIMARY KEY,
  nume VARCHAR2(50),
  prenume VARCHAR2(50),
  telefon VARCHAR2(10),
  email VARCHAR2(50)
);

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Popescu', 'Ana', '0714538290', 'ana@gmail.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Ionescu', 'Vlad', '0726842137', 'vlad@gmail.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Dumitru', 'Andreea', '0731294867', 'andreea@yahoo.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Marin', 'Mihai', '0745987312', 'mihai@gmail.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Georgescu', 'Elena', '0753827149', 'elena@yahoo.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Radu', 'Paul', '0764938201', 'paul@gmail.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Tudor', 'Ioana', '0775839024', 'ioana@gmail.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Stan', 'Irina', '0786924713', 'irina@yahoo.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Barbu', 'Cristina', '0798413629', 'cristina@gmail.com');

INSERT INTO CLIENT (nume, prenume, telefon, email)
VALUES ('Enache', 'Robert', '0702846395', 'robert@yahoo.com');

SELECT *
FROM CLIENT
ORDER BY id_client;



CREATE TABLE ANIMAL (
    id_animal INT DEFAULT ANIMAL_SEQ.NEXTVAL PRIMARY KEY,
    nume VARCHAR2(50) ,
    specie VARCHAR2(50) ,
    rasa VARCHAR2(50),
    id_client INT NOT NULL,
    FOREIGN KEY (id_client) REFERENCES CLIENT(id_client)
);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Rex', 'Câine', 'Labrador', 1);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Mia', 'Pisică', 'Persană', 2);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Max', 'Câine', 'German Shepherd', 3);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Luna', 'Pisică', 'Siameză', 4);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Buddy', 'Câine', 'Golden Retriever', 5);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
 VALUES('Bella', 'Pisică', 'Ragdoll', 1);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Charlie', 'Câine', 'Beagle', 2);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Simba', 'Pisică', 'Maine Coon', 6);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Lucky', 'Câine', 'Border Collie', 7);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Felix', 'Pisică', 'British Shorthair', 8);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Rocky', 'Câine', 'Rottweiler', 9);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Whiskers', 'Pisică', 'Scottish Fold', 10);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Daisy', 'Câine', 'Cocker Spaniel', 3);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Shadow', 'Pisică', 'Russian Blue', 5);

INSERT INTO ANIMAL (nume, specie, rasa, id_client)
VALUES('Bruno', 'Câine', 'Boxer', 6);

SELECT *
FROM ANIMAL
ORDER BY ID_ANIMAL;


CREATE TABLE PERSONAL_MEDICAL (
  id_personal_medical INT DEFAULT PERSONAL_MEDICAL_SEQ.NEXTVAL PRIMARY KEY,
  nume VARCHAR2(50),
  prenume VARCHAR2(50),
  salariu INT,
  grad_profesional VARCHAR2(10),
  data_angajare DATE
);

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Vasilescu', 'Dan', 8000, 'Dr.', DATE '2020-01-15');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Marinescu', 'Laura', 7500, 'Dr.', DATE '2019-03-10');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Stoica', 'Radu', 6000, 'Farm.', DATE '2021-05-20');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Popa', 'Carmen', 5500, 'Farm.', DATE '2022-02-14');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Tudor', 'Bogdan', 7800, 'Dr.', DATE '2018-09-05');
INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Munteanu', 'Diana', 5800, 'Farm.', DATE '2023-01-10');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Ionescu', 'Adrian', 7200, 'Dr.', DATE '2021-11-08');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Georgescu', 'Mihaela', 6200, 'Farm.', DATE '2020-07-22');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Popescu', 'Gabriel', 8200, 'Dr.', DATE '2017-04-12');

INSERT INTO PERSONAL_MEDICAL (nume, prenume, salariu, grad_profesional, data_angajare)
VALUES ('Dinu', 'Andreea', 5900, 'Farm.', DATE '2022-09-03');

SELECT *
FROM PERSONAL_MEDICAL
ORDER BY ID_PERSONAL_MEDICAL;



CREATE TABLE FARMACIST (
    id_personal_medical INT PRIMARY KEY,
    responsabil_stoc NUMBER(1) CHECK (responsabil_stoc IN (0,1)),
    FOREIGN KEY (id_personal_medical) REFERENCES PERSONAL_MEDICAL(id_personal_medical)
);

INSERT INTO FARMACIST (id_personal_medical, responsabil_stoc)
VALUES (3, 1);

INSERT INTO FARMACIST (id_personal_medical, responsabil_stoc)
VALUES (4, 0);

INSERT INTO FARMACIST (id_personal_medical, responsabil_stoc)
VALUES (6, 1);

INSERT INTO FARMACIST (id_personal_medical, responsabil_stoc)
VALUES (8, 0);

INSERT INTO FARMACIST (id_personal_medical, responsabil_stoc)
VALUES (10, 1);

SELECT *
FROM FARMACIST
ORDER BY ID_PERSONAL_MEDICAL;


CREATE TABLE MEDIC_VETERINAR (
    id_personal_medical INT PRIMARY KEY,
    specializare VARCHAR2(50),
    FOREIGN KEY (id_personal_medical) REFERENCES PERSONAL_MEDICAL(id_personal_medical)
);

INSERT INTO MEDIC_VETERINAR (id_personal_medical, specializare)
VALUES (1, 'Chirurgie');

INSERT INTO MEDIC_VETERINAR (id_personal_medical, specializare)
VALUES (2, 'Dermatologie');

INSERT INTO MEDIC_VETERINAR (id_personal_medical, specializare)
VALUES (5, 'Medicină internă');

INSERT INTO MEDIC_VETERINAR (id_personal_medical, specializare)
VALUES (7, 'Cardiologie');

INSERT INTO MEDIC_VETERINAR (id_personal_medical, specializare)
VALUES (9, 'Oncologie');

SELECT *
FROM MEDIC_VETERINAR
ORDER BY ID_PERSONAL_MEDICAL;


CREATE TABLE PROGRAM (
    id_program INT DEFAULT PROGRAM_SEQ.NEXTVAL PRIMARY KEY,
    zi_saptamana VARCHAR2(50),
    ora_inceput VARCHAR2(20),
    ora_sfarsit VARCHAR2(20),
    id_personal_medical INT NOT NULL,
    FOREIGN KEY (id_personal_medical) REFERENCES PERSONAL_MEDICAL(id_personal_medical)
);


INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Luni', '08:00', '16:00', 1);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Marți', '08:00', '16:00', 1);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Miercuri', '08:00', '16:00', 1);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Marți', '09:00', '17:00', 2);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Joi', '09:00', '17:00', 2);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Vineri', '09:00', '17:00', 2);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Miercuri', '08:00', '16:00', 3);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Sâmbătă', '08:00', '14:00', 3);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Joi', '10:00', '18:00', 4);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Vineri', '10:00', '18:00', 4);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Vineri', '08:00', '16:00', 5);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Sâmbătă', '08:00', '16:00', 5);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Sâmbătă', '09:00', '13:00', 6);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Luni', '14:00', '22:00', 7);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Marți', '08:00', '16:00', 8);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Luni', '12:00', '20:00', 9);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Miercuri', '10:00', '18:00', 9);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Vineri', '08:00', '14:00', 9);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Marți', '12:00', '20:00', 10);

INSERT INTO PROGRAM (zi_saptamana, ora_inceput, ora_sfarsit, id_personal_medical)
VALUES ('Joi', '08:00', '16:00', 10);

SELECT *
FROM PROGRAM
ORDER BY ID_PROGRAM;


CREATE TABLE CAMPANIE (
    id_campanie INT DEFAULT CAMPANIE_SEQ.NEXTVAL PRIMARY KEY,
    nume VARCHAR2(50),
    tip VARCHAR2(50),
    data_start DATE,
    data_sfarsit DATE
);

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Vaccinare antirabie', 'Vaccinare', DATE '2024-01-15', DATE '2024-02-15');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Deparazitare gratuită', 'Deparazitare', DATE '2024-03-01', DATE '2024-03-31');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Sterilizare câini', 'Chirurgie', DATE '2024-05-01', DATE '2024-05-31');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Control ectoparaziti', 'Prevenție', DATE '2024-06-01', DATE '2024-08-31');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Vaccinare polivalentă', 'Vaccinare', DATE '2024-09-01', DATE '2024-10-31');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Control cardiologic', 'Diagnostic', DATE '2024-02-01', DATE '2024-02-29');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Castrare pisici', 'Chirurgie', DATE '2024-04-01', DATE '2024-04-30');
INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Screening oncologic', 'Diagnostic', DATE '2024-07-01', DATE '2024-07-31');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Deparazitare internă', 'Tratament', DATE '2024-10-01', DATE '2024-10-31');

INSERT INTO CAMPANIE (nume, tip, data_start, data_sfarsit)
VALUES ('Control geriatric', 'Diagnostic', DATE '2024-11-01', DATE '2024-12-31');

SELECT *
FROM CAMPANIE
ORDER BY ID_CAMPANIE;


CREATE TABLE CONSULTATIE (
    id_consultatie INT DEFAULT CONSULTATIE_SEQ.NEXTVAL PRIMARY KEY,
    pret INT,
    id_animal INT NOT NULL,
    id_personal_medical INT NOT NULL,
    FOREIGN KEY (id_animal) REFERENCES ANIMAL(id_animal),
    FOREIGN KEY (id_personal_medical) REFERENCES
MEDIC_VETERINAR(id_personal_medical)
);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (150, 1, 1);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (180, 1, 2);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (200, 2, 2);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (160, 2, 5);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (180, 3, 1);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (220, 4, 5);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (170, 5, 2);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (190, 5, 7);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (190, 6, 7);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (210, 7, 9);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (160, 8, 1);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (240, 9, 5);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (195, 10, 2);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (220, 10, 9);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (175, 11, 1);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (185, 12, 2);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (165, 13, 5);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (205, 14, 7);

INSERT INTO CONSULTATIE (pret, id_animal, id_personal_medical)
VALUES (230, 15, 9);

SELECT *
FROM CONSULTATIE
ORDER BY ID_CONSULTATIE;


CREATE TABLE RETETA (
    id_reteta INT DEFAULT RETETA_SEQ.NEXTVAL PRIMARY KEY,
    data_emiterii DATE,
    id_consultatie INT NOT NULL,
    id_personal_medical INT NOT NULL,
    FOREIGN KEY (id_consultatie) REFERENCES CONSULTATIE(id_consultatie),
    FOREIGN KEY (id_personal_medical) REFERENCES MEDIC_VETERINAR(id_personal_medical)
);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-03-15', 1, 1);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-03-16', 2, 2);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-03-20', 3, 2);
INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-03-22', 4, 5);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-03-25', 5, 1);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-01', 6, 5);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-05', 7, 2);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-08', 8, 7);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-10', 9, 7);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-12', 10, 9);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-15', 11, 1);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-18', 12, 5);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-20', 13, 2);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-22', 14, 9);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-25', 15, 1);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-04-28', 16, 2);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-05-01', 17, 5);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-05-05', 18, 7);

INSERT INTO RETETA (data_emiterii, id_consultatie, id_personal_medical)
VALUES (DATE '2025-06-05', 19, 9);

SELECT *
FROM RETETA
ORDER BY ID_RETETA;



CREATE TABLE TIP_MEDICAMENT (
    id_tip INT DEFAULT TIP_MEDICAMENT_SEQ.NEXTVAL PRIMARY KEY,
    substanta_activa VARCHAR2(50),
    denumire VARCHAR2(50),
    producator VARCHAR2(50)
);

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Amoxicilină', 'Amoxivet', 'VetPharma');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Meloxicam', 'Meloxivet', 'AnimalHealth');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Fipronil', 'Frontline', 'Boehringer');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Ivermectină', 'Ivomec', 'Merial');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Dexametazonă', 'Dexavet', 'VetMedica');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Enrofloxacină', 'Baytril', 'Bayer');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Selamectină', 'Revolution', 'Zoetis');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Cefalexină', 'Cefalex', 'VetPharma');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Tramadol', 'Tramal Vet', 'AnimalHealth');

INSERT INTO TIP_MEDICAMENT (substanta_activa, denumire, producator)
VALUES ('Metamizol', 'Novalgin Vet', 'VetMedica');

SELECT *
FROM TIP_MEDICAMENT
ORDER BY ID_TIP;



CREATE TABLE STOC (
    id_stoc INT DEFAULT STOC_SEQ.NEXTVAL PRIMARY KEY,
    data_expirare DATE,
    data_fabricatie DATE,
    nr_bucati_primite INT CHECK (nr_bucati_primite > 0),
    nr_bucati_ramase INT CHECK (nr_bucati_ramase >= 0),
    pret_unitar INT CHECK (pret_unitar > 0),
    data_aprovizionare DATE,
    id_tip INT NOT NULL,
    FOREIGN KEY (id_tip) REFERENCES TIP_MEDICAMENT(id_tip)
);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2025-12-31', DATE '2024-01-15', 100, 75, 25, DATE '2024-01-20', 1);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2026-06-30', DATE '2024-02-10', 50, 30, 45, DATE '2024-02-15', 2);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2025-08-31', DATE '2024-01-05', 80, 60, 35, DATE '2024-01-10', 3);
INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2025-11-30', DATE '2024-03-01', 60, 40, 55, DATE '2024-03-05', 4);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2026-01-31', DATE '2024-02-20', 40, 25, 30, DATE '2024-02-25', 5);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2025-09-30', DATE '2024-01-10', 70, 50, 40, DATE '2024-01-15', 6);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2026-03-31', DATE '2024-03-15', 90, 70, 60, DATE '2024-03-20', 7);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2025-10-31', DATE '2024-04-01', 120, 95, 22, DATE '2024-04-05', 8);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2026-02-28', DATE '2024-03-10', 65, 45, 38, DATE '2024-03-15', 9);

INSERT INTO STOC (data_expirare, data_fabricatie, nr_bucati_primite, nr_bucati_ramase, pret_unitar, data_aprovizionare, id_tip)
VALUES (DATE '2025-07-31', DATE '2024-02-05', 85, 60, 42, DATE '2024-02-10', 10);

SELECT *
FROM STOC
ORDER BY ID_STOC;


CREATE TABLE FURNIZOR (
    id_furnizor INT DEFAULT FURNIZOR_SEQ.NEXTVAL PRIMARY KEY,
    nume VARCHAR2(50),
    adresa VARCHAR2(50),
    telefon VARCHAR2(10)
);

INSERT INTO FURNIZOR (nume, adresa, telefon)
VALUES ('VetPharma Distribution', 'Str. Medicamentelor 10, București', '0213456789');

INSERT INTO FURNIZOR (nume, adresa, telefon)
VALUES ('AnimalHealth Supply', 'Bd. Veterinarilor 25, Cluj', '0264567890');

INSERT INTO FURNIZOR (nume, adresa, telefon)
VALUES ('MedVet Solutions', 'Str. Farmaciei 15, Timișoara', '0256678901');

INSERT INTO FURNIZOR (nume, adresa, telefon)
VALUES ('PetCare Logistics', 'Calea Victoriei 45, București', '0212789012');

INSERT INTO FURNIZOR (nume, adresa, telefon)
VALUES ('VetMed Import', 'Str. Importului 8, Constanța', '0241890123');

SELECT *
FROM FURNIZOR
ORDER BY ID_FURNIZOR;


CREATE TABLE COMANDA (
    id_comanda INT DEFAULT COMANDA_SEQ.NEXTVAL PRIMARY KEY,
    data_comanda DATE,
    id_personal_medical INT NOT NULL,
    FOREIGN KEY (id_personal_medical) REFERENCES FARMACIST(id_personal_medical)
);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-03-10', 3);
INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-03-15', 4);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-03-20', 6);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-03-25', 3);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-04-01', 4);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-04-05', 6);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-04-10', 3);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-04-15', 4);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-04-20', 8);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-04-25', 10);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-05-01', 3);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-05-05', 6);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-05-10', 8);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-05-15', 10);

INSERT INTO COMANDA (data_comanda, id_personal_medical)
VALUES (DATE '2025-05-20', 4);

SELECT *
FROM COMANDA
ORDER BY ID_COMANDA;


CREATE TABLE COMANDA_CLIENT (
    id_comanda INT PRIMARY KEY,
    metoda_plata VARCHAR2(10) CHECK (metoda_plata IN ('cash', 'card')),
    id_client INT NOT NULL,
    FOREIGN KEY (id_comanda) REFERENCES COMANDA(id_comanda),
    FOREIGN KEY (id_client) REFERENCES CLIENT(id_client)
);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (1, 'card', 1);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (2, 'cash', 2);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (3, 'card', 3);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (4, 'cash', 4);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (5, 'card', 5);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (6, 'cash', 6);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (7, 'card', 7);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (8, 'cash', 8);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (9, 'card', 9);

INSERT INTO COMANDA_CLIENT (id_comanda, metoda_plata, id_client)
VALUES (10, 'cash', 10);

SELECT *
FROM COMANDA_CLIENT
ORDER BY ID_COMANDA;


CREATE TABLE COMANDA_FARMACIE (
    id_comanda INT PRIMARY KEY,
    termen_livrare DATE,
    id_furnizor INT NOT NULL,
    FOREIGN KEY (id_comanda) REFERENCES COMANDA(id_comanda),
    FOREIGN KEY (id_furnizor) REFERENCES FURNIZOR(id_furnizor)
);

INSERT INTO COMANDA_FARMACIE (id_comanda, termen_livrare, id_furnizor)
VALUES (11, DATE '2025-05-10', 1);

INSERT INTO COMANDA_FARMACIE (id_comanda, termen_livrare, id_furnizor)
VALUES (12, DATE '2025-05-15', 2);

INSERT INTO COMANDA_FARMACIE (id_comanda, termen_livrare, id_furnizor)
VALUES (13, DATE '2025-05-20', 3);

INSERT INTO COMANDA_FARMACIE (id_comanda, termen_livrare, id_furnizor)
VALUES (14, DATE '2025-05-25', 4);
INSERT INTO COMANDA_FARMACIE (id_comanda, termen_livrare, id_furnizor)
VALUES (15, DATE '2025-05-30', 5);

SELECT *
FROM COMANDA_FARMACIE
ORDER BY ID_COMANDA;


CREATE TABLE FACTURA (
    id_factura INT DEFAULT FACTURA_SEQ.NEXTVAL PRIMARY KEY,
    data_emitere DATE,
    suma INT CHECK (suma > 0),
    id_comanda INT NOT NULL,
    FOREIGN KEY (id_comanda) REFERENCES COMANDA(id_comanda)
);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-03-10', 250, 1);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-03-15', 180, 2);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-03-20', 320, 3);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-03-25', 150, 4);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-04-01', 280, 5);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-04-05', 190, 6);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-04-10', 340, 7);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-04-15', 220, 8);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-04-20', 390, 9);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-04-25', 165, 10);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-05-01', 580, 11);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-05-05', 420, 12);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-05-10', 650, 13);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-05-15', 380, 14);

INSERT INTO FACTURA (data_emitere, suma, id_comanda)
VALUES (DATE '2025-05-20', 490, 15);

SELECT *
FROM FACTURA
ORDER BY ID_FACTURA;


CREATE TABLE CONTINE (
    id_reteta INT,
    id_tip INT,
    cantitate INT DEFAULT 1,
    PRIMARY KEY (id_reteta, id_tip),
    FOREIGN KEY (id_reteta) REFERENCES RETETA(id_reteta),
    FOREIGN KEY (id_tip) REFERENCES TIP_MEDICAMENT(id_tip)
);

INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (1, 1, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (1, 2, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (2, 3, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (2, 4, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (3, 1, 3);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (4, 2, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (5, 2, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (5, 7, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (6, 5, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (6, 8, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (7, 1, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (8, 1, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (8, 10, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (9, 3, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (9, 7, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (10, 5, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (11, 2, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (12, 4, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (13, 6, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (14, 8, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (15, 9, 2);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (16, 10, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (17, 5, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (18, 6, 1);
INSERT INTO CONTINE (id_reteta, id_tip, cantitate)
VALUES (19, 9, 1);

SELECT *
FROM CONTINE
ORDER BY ID_RETETA, ID_TIP;


CREATE TABLE INCLUDE (
    id_comanda INT,
    id_tip INT,
    cantitate INT DEFAULT 1,
    PRIMARY KEY (id_comanda, id_tip),
    FOREIGN KEY (id_comanda) REFERENCES COMANDA(id_comanda),
    FOREIGN KEY (id_tip) REFERENCES TIP_MEDICAMENT(id_tip)
);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (11, 2, 10);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (12, 3, 15);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (13, 4, 12);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (14, 5, 20);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (15, 6, 8);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (1, 1, 2);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (1, 3, 1);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (2, 2, 4);

INSERT INTO INCLUDE (id_comanda, id_tip, cantitate)
VALUES (3, 5, 3);


SELECT *
FROM INCLUDE
ORDER BY ID_COMANDA, ID_TIP;


CREATE TABLE VINDE (
    id_furnizor INT,
    id_tip INT,
    pret_furnizor INT,
    PRIMARY KEY (id_furnizor, id_tip),
    FOREIGN KEY (id_furnizor) REFERENCES FURNIZOR(id_furnizor),
    FOREIGN KEY (id_tip) REFERENCES TIP_MEDICAMENT(id_tip)
);

INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (1, 1, 20);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (1, 2, 40);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (1, 8, 18);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (2, 3, 30);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (2, 4, 50);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (2, 9, 32);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (3, 5, 25);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (3, 6, 35);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (3, 10, 38);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (4, 7, 55);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (4, 1, 22);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (5, 2, 42);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (5, 3, 33);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (1, 4, 48);
INSERT INTO VINDE (id_furnizor, id_tip, pret_furnizor)
VALUES (2, 5, 27);

SELECT *
FROM VINDE
ORDER BY ID_FURNIZOR, ID_TIP;


CREATE TABLE INTERVINE (
    id_animal INT,
    id_campanie INT,
    id_personal_medical INT,
    PRIMARY KEY (id_animal, id_campanie, id_personal_medical),
    FOREIGN KEY (id_animal) REFERENCES ANIMAL(id_animal),
    FOREIGN KEY (id_campanie) REFERENCES CAMPANIE(id_campanie),
    FOREIGN KEY (id_personal_medical) REFERENCES PERSONAL_MEDICAL(id_personal_medical)
);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (1, 1, 1);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (2, 1, 2);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (3, 2, 3);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (4, 2, 4);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (5, 3, 5);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (6, 3, 6);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (7, 4, 7);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (8, 4, 8);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (9, 5, 9);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (10, 5, 10);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (11, 1, 2);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (12, 2, 3);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (13, 3, 4);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (14, 4, 5);

INSERT INTO INTERVINE (id_animal, id_campanie, id_personal_medical)
VALUES (15, 5, 6);

SELECT *
FROM INTERVINE
ORDER BY ID_ANIMAL, ID_CAMPANIE, ID_PERSONAL_MEDICAL;


CREATE TABLE ARE (
    id_stoc INT,
    id_comanda INT,
    PRIMARY KEY (id_stoc, id_comanda),
    FOREIGN KEY (id_stoc) REFERENCES STOC(id_stoc),
    FOREIGN KEY (id_comanda) REFERENCES COMANDA_CLIENT(id_comanda)
);

INSERT INTO ARE (id_stoc, id_comanda)
VALUES (1, 1);

INSERT INTO ARE (id_stoc, id_comanda)
VALUES (2, 2);

INSERT INTO ARE (id_stoc, id_comanda)
VALUES (3, 3);

INSERT INTO ARE (id_stoc, id_comanda)
VALUES (4, 4);

INSERT INTO ARE (id_stoc, id_comanda)
VALUES (5, 5);

SELECT *
FROM ARE
ORDER BY ID_STOC, ID_COMANDA;



-- 12. Formularea în limbaj natural și implementarea a 5 cereri SQL complexe ce vor utiliza, în ansamblul lor, următoarele elemente
--1.Formulare în limbaj natural: Afișați clienții care au animale consultate de medici cu specializarea 'Chirurgie' sau 'Cardiologie',
-- au avut cel puțin 2 consultații și suma totală a consultațiilor pentru animalele lor este mai mare decât media generală. Pentru
-- fiecare client afișați numele complet, numărul de animale, suma totală a consultațiilor și data ultimei consultații.

SELECT
    CL.NUME || ' ' || CL.PRENUME AS NUME_CLIENT,
    COUNT(DISTINCT A.ID_ANIMAL) AS NR_ANIMALE,
    SUM(C.PRET) AS SUMA_TOTALA_CONSULTII,
    MAX(R.DATA_EMITERII) AS DATA_ULTIMA_CONSULTATIE
FROM CLIENT CL
JOIN ANIMAL A ON CL.ID_CLIENT=A.ID_CLIENT
JOIN CONSULTATIE C ON A.ID_ANIMAL=C.ID_ANIMAL
LEFT JOIN RETETA R ON C.ID_CONSULTATIE=R.ID_CONSULTATIE
WHERE EXISTS (
    SELECT 1
    FROM CONSULTATIE C1
    JOIN PERSONAL_MEDICAL PM ON C1.ID_PERSONAL_MEDICAL=PM.ID_PERSONAL_MEDICAL
    JOIN MEDIC_VETERINAR MV ON PM.ID_PERSONAL_MEDICAL=MV.ID_PERSONAL_MEDICAL
    WHERE C1.ID_ANIMAL=A.ID_ANIMAL
    AND MV.SPECIALIZARE IN ('Chirurgie', 'Cardiologie')
) AND (
    SELECT COUNT(C2.ID_CONSULTATIE)
    FROM CONSULTATIE C2
    JOIN ANIMAL A2 ON C2.ID_ANIMAL=A2.ID_ANIMAL
    JOIN CLIENT CL2 ON A2.ID_CLIENT=CL2.ID_CLIENT
    WHERE CL2.ID_CLIENT=CL.ID_CLIENT
) >= 2
AND (
    SELECT SUM(C3.PRET)
    FROM CONSULTATIE C3
    JOIN ANIMAL A3 ON C3.ID_ANIMAL=A3.ID_ANIMAL
    JOIN CLIENT CL3 ON A3.ID_CLIENT=CL3.ID_CLIENT
    WHERE CL3.ID_CLIENT=CL.ID_CLIENT
) > (
    SELECT AVG(TOTAL_PER_CLIENT)
    FROM (
        SELECT SUM(C4.PRET) AS TOTAL_PER_CLIENT
        FROM CONSULTATIE C4
        JOIN ANIMAL A4 ON C4.ID_ANIMAL=A4.ID_ANIMAL
        JOIN CLIENT CL4 ON A4.ID_CLIENT=CL4.ID_CLIENT
        GROUP BY CL4.ID_CLIENT
    )
)
GROUP BY CL.ID_CLIENT, CL.NUME, CL.PRENUME
ORDER BY SUMA_TOTALA_CONSULTII DESC;

--2.Formulare în limbaj natural: Selectați primele 5 tipuri de medicamente în funcție de prețul cel mai mic din stoc și afișați
-- substanța activă, denumirea și informații despre furnizorii care le comercializează.
SELECT
    MEDICAMENTE.SUBSTANTA_ACTIVA,
    MEDICAMENTE.DENUMIRE,
    MEDICAMENTE.PRET_UNITAR,
    FURNIZORI.NUME_FURNIZOR
FROM (
    SELECT
        TM.ID_TIP,
        TM.SUBSTANTA_ACTIVA,
        TM.DENUMIRE,
        S.PRET_UNITAR
    FROM TIP_MEDICAMENT TM
    JOIN STOC S ON TM.ID_TIP = S.ID_TIP
    ORDER BY S.PRET_UNITAR
) MEDICAMENTE
JOIN (
    SELECT
        V.ID_TIP,
        F.NUME AS NUME_FURNIZOR
    FROM VINDE V
    JOIN FURNIZOR F ON V.ID_FURNIZOR = F.ID_FURNIZOR
) FURNIZORI ON MEDICAMENTE.ID_TIP = FURNIZORI.ID_TIP
WHERE ROWNUM <= 5;

--3.Formulare în limbaj natural: Afișați clienții care au un numărul total de consultații pentru animalele lor mai mare decât
-- media consultațiilor per client din sistem.
SELECT
    CL.NUME || ' ' || CL.PRENUME AS NUME_CLIENT,
    COUNT(C.ID_CONSULTATIE) AS NR_CONSULTII,
    SUM(C.PRET) AS SUMA_TOTALA
FROM CLIENT CL
JOIN ANIMAL A ON CL.ID_CLIENT = A.ID_CLIENT
JOIN CONSULTATIE C ON A.ID_ANIMAL = C.ID_ANIMAL
GROUP BY CL.ID_CLIENT, CL.NUME, CL.PRENUME
HAVING COUNT(C.ID_CONSULTATIE) > (
    SELECT AVG(consultatii_per_client)
    FROM (
        SELECT COUNT(C2.ID_CONSULTATIE) AS consultatii_per_client
        FROM CLIENT CL2
        JOIN ANIMAL A2 ON CL2.ID_CLIENT = A2.ID_CLIENT
        JOIN CONSULTATIE C2 ON A2.ID_ANIMAL = C2.ID_ANIMAL
        GROUP BY CL2.ID_CLIENT
    )
)
ORDER BY NR_CONSULTII;

--4.Formulare în limbaj natural:Afișați toate animalele cu informații despre ultima lor consultație, folosind valori implicite
-- pentru câmpurile lipsă și categorizarea după specie.
SELECT
    A.NUME AS NUME_ANIMAL,
    A.SPECIE,
    NVL(A.RASA, 'Rasă necunoscută') AS RASA,
    DECODE(A.SPECIE, 'Câine', 'Canin', 'Pisică', 'Felin', 'Altă specie') AS CATEGORIE_SPECIE,
    NVL((
        SELECT MAX(C.PRET)
        FROM CONSULTATIE C
        WHERE C.ID_ANIMAL = A.ID_ANIMAL
    ), 0) AS ULTIMUL_PRET_CONSULTATIE
FROM ANIMAL A
ORDER BY A.SPECIE, A.NUME;

--5.Formulare în limbaj natural:Pentru fiecare rețetă din farmacia veterinară, afișați informații despre medicul prescriptor
-- (numele scurtat și specializarea), data emiterii formatată, vechimea rețetei în luni și statusul ei (recentă, validă sau veche).
-- De asemenea, includeți statistici despre medic: numărul total de consultații și media prețurilor.
WITH STATISTICI_MEDICI AS (
    SELECT
        PM.ID_PERSONAL_MEDICAL,
        PM.NUME || ' ' || PM.PRENUME AS NUME_COMPLET,
        MV.SPECIALIZARE,
        COUNT(C.ID_CONSULTATIE) AS NR_CONSULTII,
        SUM(C.PRET) AS SUMA_TOTALA,
        AVG(C.PRET) AS MEDIA_PRET
    FROM PERSONAL_MEDICAL PM
    JOIN MEDIC_VETERINAR MV ON PM.ID_PERSONAL_MEDICAL = MV.ID_PERSONAL_MEDICAL
    LEFT JOIN CONSULTATIE C ON PM.ID_PERSONAL_MEDICAL = C.ID_PERSONAL_MEDICAL
    GROUP BY PM.ID_PERSONAL_MEDICAL, PM.NUME, PM.PRENUME, MV.SPECIALIZARE
)
SELECT
    R.ID_RETETA,
    UPPER(SUBSTR(SM.NUME_COMPLET, 1, 15)) AS NUME_MEDIC_SCURT,
    LOWER(SM.SPECIALIZARE) AS SPECIALIZARE_LOWER,
    TO_CHAR(R.DATA_EMITERII, 'DD-MM-YYYY') AS DATA_EMITERE_FORMAT,
    ABS(MONTHS_BETWEEN(SYSDATE, R.DATA_EMITERII)) AS VECHIME_LUNI,
    CASE
        WHEN ABS(MONTHS_BETWEEN(SYSDATE, R.DATA_EMITERII)) < 1 THEN 'Rețetă recentă'
        WHEN ABS(MONTHS_BETWEEN(SYSDATE, R.DATA_EMITERII)) < 6 THEN 'Rețetă validă'
        ELSE 'Rețetă veche'
    END AS STATUS_RETETA,
    SM.NR_CONSULTII,
    ROUND(SM.MEDIA_PRET, 2) AS MEDIA_PRET_ROTUNJITA
FROM RETETA R
JOIN STATISTICI_MEDICI SM ON R.ID_PERSONAL_MEDICAL = SM.ID_PERSONAL_MEDICAL
WHERE SM.NR_CONSULTII > 0
ORDER BY R.DATA_EMITERII DESC;

--13
--1.Actualizarea prețului din stoc (cresterea cu 10%) pentru medicamentele care au fost prescrise în mai mult de 3 rețete.
UPDATE STOC
SET pret_unitar = pret_unitar * 1.1
WHERE id_tip IN (
    SELECT tm.id_tip
    FROM TIP_MEDICAMENT tm
    WHERE (
        SELECT COUNT(*)
        FROM CONTINE c
        WHERE c.id_tip = tm.id_tip
    ) > 3
);


-- SELECT s.id_tip, s.pret_unitar
-- FROM STOC s
-- WHERE s.id_tip IN (
--     SELECT tm.id_tip
--     FROM TIP_MEDICAMENT tm
--     WHERE (
--         SELECT COUNT(*)
--         FROM CONTINE c
--         WHERE c.id_tip = tm.id_tip
--     ) > 3
-- );


--2.Ștergerea înregistrărilor din tabela CLIENT pentru clienții care nu au animale înregistrate.
DELETE FROM CLIENT
WHERE id_client NOT IN (
    SELECT DISTINCT id_client
    FROM ANIMAL
    WHERE id_client IS NOT NULL
);

DELETE FROM ANIMAL
WHERE ID_ANIMAL NOT IN(
    SELECT DISTINCT ID_ANIMAL
    FROM INTERVINE
    )
AND ID_ANIMAL NOT IN(
    SELECT ID_ANIMAL
    FROM CONSULTATIE C
    JOIN RETETA R on C.id_consultatie = R.id_consultatie
    );

-- SELECT *
-- FROM CLIENT
-- WHERE id_client NOT IN (
--     SELECT DISTINCT id_client
--     FROM ANIMAL
--     WHERE id_client IS NOT NULL
-- );

--3.Actualizarea responsabilității stocului pentru farmaciștii care au gestionat comenzi de la furnizori .
UPDATE FARMACIST
SET responsabil_stoc = 1
WHERE id_personal_medical IN (
    SELECT DISTINCT C.id_personal_medical
    FROM COMANDA C
    JOIN COMANDA_FARMACIE CF ON C.id_comanda = CF.id_comanda
);

-- SELECT *
-- FROM FARMACIST
-- WHERE id_personal_medical IN (
--     SELECT DISTINCT c.id_personal_medical
--     FROM COMANDA c
--     JOIN COMANDA_FARMACIE cf ON c.id_comanda = cf.id_comanda
-- );


--14.
CREATE VIEW VIEW_CONSULTII_COMPLEXE AS
SELECT
    c.id_consultatie,
    c.pret,
    cl.nume || ' ' || cl.prenume AS nume_client,
    a.nume AS nume_animal,
    pm.nume || ' ' || pm.prenume AS nume_medic
FROM CONSULTATIE c
JOIN ANIMAL a ON c.id_animal = a.id_animal
JOIN CLIENT cl ON a.id_client = cl.id_client
JOIN PERSONAL_MEDICAL pm ON c.id_personal_medical = pm.id_personal_medical;

UPDATE VIEW_CONSULTII_COMPLEXE
SET pret = 200
WHERE id_consultatie = 1;

-- INSERT INTO VIEW_CONSULTII_COMPLEXE (id_consultatie, pret, nume_client, nume_animal, nume_medic)
-- VALUES (100, 150, 'Test Client', 'Test Animal', 'Test Medic');

-- SELECT * FROM VIEW_CONSULTII_COMPLEXE;


--15
--a) Outer join pe minimum 4 tabele
SELECT
    cl.nume || ' ' || cl.prenume AS nume_client,
    a.nume AS nume_animal,
    c.pret AS pret_consultatie,
    r.data_emiterii,
    tm.denumire AS medicament
FROM CLIENT cl
LEFT OUTER JOIN ANIMAL a ON cl.id_client = a.id_client
LEFT OUTER JOIN CONSULTATIE c ON a.id_animal = c.id_animal
LEFT OUTER JOIN RETETA r ON c.id_consultatie = r.id_consultatie
LEFT OUTER JOIN CONTINE co ON r.id_reteta = co.id_reteta
LEFT OUTER JOIN TIP_MEDICAMENT tm ON co.id_tip = tm.id_tip
ORDER BY cl.nume, a.nume;

--b) Operația division
SELECT pm.nume || ' ' || pm.prenume AS nume_medic
FROM PERSONAL_MEDICAL pm
JOIN MEDIC_VETERINAR mv ON pm.id_personal_medical = mv.id_personal_medical
WHERE NOT EXISTS (
    SELECT tm.id_tip
    FROM TIP_MEDICAMENT tm
    WHERE NOT EXISTS (
        SELECT 1
        FROM RETETA r
        JOIN CONTINE c ON r.id_reteta = c.id_reteta
        WHERE r.id_personal_medical = pm.id_personal_medical
        AND c.id_tip = tm.id_tip
    )
);

--c) Analiza top-n
SELECT *
FROM (
    SELECT
        cl.nume || ' ' || cl.prenume AS nume_client,
        SUM(f.suma) AS total_platit,
        COUNT(f.id_factura) AS nr_facturi
    FROM CLIENT cl
    JOIN COMANDA_CLIENT cc ON cl.id_client = cc.id_client
    JOIN FACTURA f ON cc.id_comanda = f.id_comanda
    GROUP BY cl.id_client, cl.nume, cl.prenume
    ORDER BY total_platit DESC
)
WHERE ROWNUM <= 5;

--16
SELECT c.nume, c.prenume, a.nume, cons.pret, mv.specializare
FROM CLIENT c, ANIMAL a, CONSULTATIE cons, PERSONAL_MEDICAL pm, MEDIC_VETERINAR mv
WHERE c.id_client = a.id_client
AND a.id_animal = cons.id_animal
AND cons.id_personal_medical = pm.id_personal_medical
AND pm.id_personal_medical = mv.id_personal_medical
AND cons.pret > 180
AND a.specie = 'Câine';


SELECT c.nume, c.prenume, a.nume, cons.pret, mv.specializare
FROM CLIENT c
JOIN ANIMAL a ON c.id_client = a.id_client AND a.specie = 'Câine'
JOIN CONSULTATIE cons ON a.id_animal = cons.id_animal AND cons.pret > 180
JOIN PERSONAL_MEDICAL pm ON cons.id_personal_medical = pm.id_personal_medical
JOIN MEDIC_VETERINAR mv ON pm.id_personal_medical = mv.id_personal_medical;

--17
SELECT c.id_consultatie, c.pret, r.id_reteta,
       r.data_emiterii, pm.nume, mv.specializare
FROM CONSULTATIE c
JOIN RETETA r ON c.id_consultatie = r.id_consultatie
JOIN PERSONAL_MEDICAL pm ON r.id_personal_medical = pm.id_personal_medical
JOIN MEDIC_VETERINAR mv ON pm.id_personal_medical = mv.id_personal_medical;



--exercitii
--1
CREATE TABLE COPIE_INTERVINE AS
    SELECT *
    FROM INTERVINE I ;
ALTER TABLE COPIE_INTERVINE
    ADD CONSTRAINT C1 PRIMARY KEY(ID_ANIMAL,ID_CAMPANIE,ID_PERSONAL_MEDICAL)
    ADD CONSTRAINT C2  FOREIGN KEY (ID_ANIMAL)
    REFERENCES ANIMAL(ID_ANIMAL);

ALTER TABLE COPIE_INTERVINE
    ADD CONSTRAINT C2  FOREIGN KEY (ID_CAMPANIE)
    REFERENCES CAMPANIE(ID_CAMPANIE);

ALTER TABLE COPIE_INTERVINE
    ADD CONSTRAINT C2 FOREIGN KEY (ID_PERSONAL_MEDICAL)
    REFERENCES PERSONAL_MEDICAL(ID_PERSONAL_MEDICAL);

SELECT *
FROM COPIE_INTERVINE;


--2
SELECT C.ID_CAMPANIE, C.NUME
FROM CAMPANIE C
JOIN INTERVINE I ON I.ID_CAMPANIE=C.ID_CAMPANIE
JOIN ANIMAL A ON A.ID_ANIMAL=I.ID_ANIMAL
JOIN CONSULTATIE CO ON CO.ID_ANIMAL=A.ID_ANIMAL
JOIN RETETA R ON R.ID_CONSULTATIE=CO.ID_CONSULTATIE
JOIN CONTINE C1 ON C1.ID_RETETA=R.ID_RETETA
WHERE EXISTS(
    SELECT 1
    FROM (
        SELECT A1.ID_ANIMAL,COUNT(C2.ID_TIP)
        FROM ANIMAL A1
        JOIN CONSULTATIE CO1 ON CO1.ID_ANIMAL=A1.ID_ANIMAL
        JOIN RETETA R1 ON R1.ID_CONSULTATIE=CO1.ID_CONSULTATIE
        JOIN CONTINE C2 ON C2.ID_RETETA=R1.ID_RETETA
        WHERE A.ID_ANIMAL=A1.ID_ANIMAL
        GROUP BY A1.ID_ANIMAL
        HAVING COUNT(C2.ID_TIP)=(
            SELECT MAX( COUNT(C3.ID_TIP))
            FROM CONTINE C3
            GROUP BY C3.ID_RETETA
            )
        )
)
