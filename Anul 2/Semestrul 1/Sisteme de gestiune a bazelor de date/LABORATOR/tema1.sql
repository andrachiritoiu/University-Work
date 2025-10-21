 --TEMA
 --17.Generaţi automat un script SQL care să conţină comenzi de ştergere a tuturor tabelelor personale create.
--Indicaţie: Folosiţi comenzile SPOOL …/sterg_tabele.sql şi SPOOL OFF.
 
 SPOOL sterg_tabele.sql
 SET HEADING OFF
 SET FEEDBACK OFF
 SET PAGESIZE 0
 
 SELECT 'DROP TABLE ' || table_name || ', '
 FROM user_tables
 WHERE table_name LIKE 'EMP_%';
 
 SPOOL OFF
 SET HEADING ON
 SET FEEDBACK ON
 SET PAGESIZE 14
 
--23. Folosind tabelul departments generaţi automat script-ul SQL de inserare a înregistrărilor în acest tabel.

 SPOOL insert_departments.sql
 SET HEADING OFF
 SET FEEDBACK OFF
 SET PAGESIZE 0

 SELECT 'Insert into departments (department_id, department_name) VALUES (' || department_id || ', ' || department_name || ');'
 FROM departments;

 SPOOL OFF
 SET HEADING ON
 SET FEEDBACK ON
 SET PAGESIZE 14

