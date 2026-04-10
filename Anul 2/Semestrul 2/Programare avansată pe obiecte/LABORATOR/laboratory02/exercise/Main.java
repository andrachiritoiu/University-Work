package com.pao.laboratory02.exercise;

import java.util.Scanner;

/**
 * Exercițiu — Meniu interactiv CRUD pentru Car
 *
 * Completează cazul 3 din switch marcat cu TODO.
 *
 * Programul rulează într-o buclă infinită (while true).
 * La fiecare iterație:
 * 1. Afișează opțiunile.
 * 2. Citește alegerea utilizatorului.
 * 3. Execută acțiunea corespunzătoare.
 * 4. Se oprește la opțiunea 0 cu System.exit(0).
 */
public class Main {
    public static void main(String[] args) {
        CarService carService = CarService.getInstance();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\n===== Gestionare Mașini =====");
            System.out.println("1. Listare mașini");
            System.out.println("2. Adăugare mașină");
            System.out.println("3. Adăugare review (bonus)");
            System.out.println("0. Ieșire");
            System.out.print("Alege opțiunea: ");

            int option = scanner.nextInt();

            switch (option) {
                case 1:
                    carService.listAllCars();
                    break;
                case 2:
                    System.out.print("Introdu numele mașinii: ");
                    String name = scanner.next();
                    System.out.print("Introdu culoarea: ");
                    String color = scanner.next();
                    carService.addCar(new Car(name, color));
                    break;
                case 3:
                    // TODO: Implementează adăugare review
                    // Pași:
                    // 1. Citește numele mașinii de la tastatură (scanner.next())
                    // 2. Citește textul review-ului (scanner.next())
                    // 3. Apelează carService.addReview(carName, review)
                    System.out.println("TODO — implementează adăugare review");
                    break;
                case 0:
                    System.out.println("La revedere!");
                    System.exit(0);
                    break;
                default:
                    System.out.println("Opțiune invalidă. Încearcă din nou.");
            }
        }
    }
}

