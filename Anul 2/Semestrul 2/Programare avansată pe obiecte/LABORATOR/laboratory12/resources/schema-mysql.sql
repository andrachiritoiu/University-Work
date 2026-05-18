-- ============================================================
--  schema-mysql.sql  —  Laboratory 12 / Proiect Etapa II
--  Compatibil cu: MySQL 8.x, MariaDB 10.x
--  Rulare: mysql -u root -p paoj_lab12 < schema-mysql.sql
-- ============================================================

-- Ordinea DROP conteaza: intai tabelele cu FK, apoi cele referite
DROP TABLE IF EXISTS loan;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS reader;
DROP TABLE IF EXISTS author;

-- -------------------------------------------------------
CREATE TABLE author (
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(200) NOT NULL,
    country VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
CREATE TABLE book (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    title     VARCHAR(300)   NOT NULL,
    author_id BIGINT         NOT NULL,
    available TINYINT(1)     NOT NULL DEFAULT 1,   -- 1=disponibil, 0=imprumutat
    CONSTRAINT fk_book_author FOREIGN KEY (author_id) REFERENCES author(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
CREATE TABLE reader (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(200) NOT NULL,
    email VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
CREATE TABLE loan (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id     BIGINT       NOT NULL,
    reader_id   BIGINT       NOT NULL,
    loan_date   DATE         NOT NULL,
    return_date DATE,                          -- NULL = imprumut activ
    CONSTRAINT fk_loan_book   FOREIGN KEY (book_id)   REFERENCES book(id),
    CONSTRAINT fk_loan_reader FOREIGN KEY (reader_id) REFERENCES reader(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

