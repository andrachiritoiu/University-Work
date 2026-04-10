package com.pao.laboratory04.exercise;

import java.util.Scanner;

/**
 * Exercițiul 4 (Integrator) — Sistem de gestiune studenți + note
 *
 * Combină Map, Enum și Excepții custom într-un mini-sistem interactiv.
 * Studenții creează TOATE clasele de la zero.
 *
 * ═══════════════════════════════════════════════════════════════
 *  CLASE DE CREAT (fișiere separate în subpachetele corespunzătoare):
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. model/Subject.java — ENUM
 *    - Constante: PAOJ, BD, SO, RC (sau alte materii)
 *    - Câmpuri: String fullName, int credits
 *    - Constructor privat, getteri
 *    - toString() → "PAOJ (Programare Avansată pe Obiecte, 6 credite)"
 *
 * 2. model/Student.java — CLASĂ
 *    - Câmpuri private: String name, int age, Map<Subject, Double> grades
 *    - Constructor: Student(String name, int age)
 *      → inițializează grades ca HashMap gol
 *      → validare: dacă age < 18 sau age > 60, aruncă InvalidStudentException
 *    - Metode: getName(), getAge(), getGrades()
 *    - addGrade(Subject subject, double grade)
 *      → dacă grade < 1 sau grade > 10, aruncă InvalidGradeException
 *      → pune nota în map (suprascrie dacă materia există deja)
 *    - double getAverage()
 *      → calculează media aritmetică a notelor (returnează 0 dacă nu are note)
 *    - toString() → "Student{name='Ana', age=20, avg=8.50}"
 *
 * 3. exception/InvalidStudentException.java — EXCEPȚIE CUSTOM
 *    - extends RuntimeException
 *    - Constructor cu String message → super(message)
 *
 * 4. exception/InvalidGradeException.java — EXCEPȚIE CUSTOM
 *    - extends RuntimeException
 *    - Constructor cu String message → super(message)
 *
 * 5. exception/StudentNotFoundException.java — EXCEPȚIE CUSTOM
 *    - extends RuntimeException
 *    - Constructor cu String message → super(message)
 *
 * 6. service/StudentService.java — SERVICIU (Singleton)
 *    - Câmp: List<Student> students (ArrayList)
 *    - Singleton pattern (constructor privat, getInstance())
 *    - Metode:
 *      a) void addStudent(String name, int age)
 *         → creează Student și adaugă în listă
 *         → dacă există deja un student cu același nume, aruncă RuntimeException
 *      b) Student findByName(String name)
 *         → caută în listă, aruncă StudentNotFoundException dacă nu găsește
 *      c) void addGrade(String studentName, Subject subject, double grade)
 *         → găsește studentul (findByName) și adaugă nota
 *      d) void printAllStudents()
 *         → afișează toți studenții cu notele lor
 *      e) void printTopStudents()
 *         → sortează studenții descrescător după medie și afișează
 *      f) Map<Subject, Double> getAveragePerSubject()
 *         → calculează media pe fiecare materie (din toți studenții care au notă)
 *
 * ═══════════════════════════════════════════════════════════════
 *  MENIU (implementat mai jos — NU modifica structura switch-ului)
 * ═══════════════════════════════════════════════════════════════
 */
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // TODO: obține instanța StudentService (Singleton)

        System.out.println("=== Sistem Gestiune Studenți ===");

        boolean running = true;
        while (running) {
            System.out.println("\n--- Meniu ---");
            System.out.println("1. Adaugă student");
            System.out.println("2. Adaugă notă");
            System.out.println("3. Afișează toți studenții");
            System.out.println("4. Top studenți (după medie)");
            System.out.println("5. Media pe materie");
            System.out.println("0. Ieșire");
            System.out.print("Opțiune: ");

            String option = scanner.nextLine().trim();

            try {
                switch (option) {
                    case "1":
                        System.out.print("Nume: ");
                        String name = scanner.nextLine().trim();
                        System.out.print("Vârsta: ");
                        int age = Integer.parseInt(scanner.nextLine().trim());
                        // TODO: apelează service.addStudent(name, age)
                        System.out.println("Student adăugat cu succes!");
                        break;

                    case "2":
                        System.out.print("Nume student: ");
                        String studentName = scanner.nextLine().trim();
                        System.out.print("Materie (" + /* TODO: afișează Subject.values() */ "PAOJ, BD, SO, RC" + "): ");
                        String subjectStr = scanner.nextLine().trim().toUpperCase();
                        System.out.print("Nota (1-10): ");
                        double grade = Double.parseDouble(scanner.nextLine().trim());
                        // TODO: convertește subjectStr în Subject cu valueOf()
                        // TODO: apelează service.addGrade(studentName, subject, grade)
                        System.out.println("Notă adăugată!");
                        break;

                    case "3":
                        // TODO: apelează service.printAllStudents()
                        break;

                    case "4":
                        // TODO: apelează service.printTopStudents()
                        break;

                    case "5":
                        // TODO: apelează service.getAveragePerSubject() și afișează
                        break;

                    case "0":
                        running = false;
                        System.out.println("La revedere!");
                        break;

                    default:
                        System.out.println("Opțiune invalidă.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Eroare: Introdu un număr valid.");
            } catch (IllegalArgumentException e) {
                System.out.println("Eroare: " + e.getMessage());
            } catch (RuntimeException e) {
                System.out.println("Eroare: " + e.getMessage());
            }
        }

        scanner.close();
    }
}

