package com.pao.laboratory03.exercise4;

import com.pao.laboratory03.exercise4.model.Cat;
import com.pao.laboratory03.exercise4.model.Dog;
import com.pao.laboratory03.exercise4.model.Parrot;
import com.pao.laboratory03.exercise4.service.ZooService;

import java.util.Scanner;

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  EXERCIȚIUL 4 — Main (NU modifica acest fișier)                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Aplicație interactivă de gestionare a unei grădini zoologice.
 * Combină: interfețe, clase abstracte, moștenire, polimorfism, colecții, Singleton.
 *
 * Rulează DUPĂ ce completezi TOATE TODO-urile din:
 *   - model/Dog.java, model/Cat.java, model/Parrot.java
 *   - service/ZooService.java
 *
 * EXEMPLU DE INTERACȚIUNE (intrare utilizator marcată cu ">"):
 * ─────────────────────────────────────────────
 * ===== Grădina Zoologică =====
 * 1. Listare animale
 * 2. Adăugare câine
 * 3. Adăugare pisică
 * 4. Adăugare papagal
 * 5. Filtrare după tip
 * 6. Cel mai bătrân animal
 * 0. Ieșire
 * Alege opțiunea: > 2
 * Nume: > Rex
 * Vârsta: > 5
 * Adăugat: Dog{name='Rex', age=5}
 *
 * Alege opțiunea: > 3
 * Nume: > Miti
 * Vârsta: > 3
 * Adăugat: Cat{name='Miti', age=3}
 *
 * Alege opțiunea: > 4
 * Nume: > Coco
 * Vârsta: > 2
 * Cuvinte cunoscute: > 50
 * Adăugat: Parrot{name='Coco', age=2}
 *
 * Alege opțiunea: > 1
 *   1. Rex (varsta: 5 ani) face: Ham!
 *   2. Miti (varsta: 3 ani) face: Miau!
 *   3. Coco (varsta: 2 ani) face: Squawk! (știe 50 cuvinte)
 *
 * Alege opțiunea: > 5
 * Tip (Dog/Cat/Parrot): > Dog
 *   - Rex (varsta: 5 ani) face: Ham!
 *
 * Alege opțiunea: > 6
 * Cel mai bătrân animal: Rex (varsta: 5 ani) face: Ham!
 *
 * Alege opțiunea: > 0
 * La revedere!
 * ─────────────────────────────────────────────
 */
public class Main {
    public static void main(String[] args) {

        ZooService zoo = ZooService.getInstance();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\n===== Grădina Zoologică =====");
            System.out.println("1. Listare animale");
            System.out.println("2. Adăugare câine");
            System.out.println("3. Adăugare pisică");
            System.out.println("4. Adăugare papagal");
            System.out.println("5. Filtrare după tip");
            System.out.println("6. Cel mai bătrân animal");
            System.out.println("0. Ieșire");
            System.out.print("Alege opțiunea: ");

            int option = scanner.nextInt();

            switch (option) {
                case 1:
                    zoo.listAll();
                    break;
                case 2:
                    System.out.print("Nume: ");
                    String dogName = scanner.next();
                    System.out.print("Vârsta: ");
                    int dogAge = scanner.nextInt();
                    zoo.addAnimal(new Dog(dogName, dogAge));
                    break;
                case 3:
                    System.out.print("Nume: ");
                    String catName = scanner.next();
                    System.out.print("Vârsta: ");
                    int catAge = scanner.nextInt();
                    zoo.addAnimal(new Cat(catName, catAge));
                    break;
                case 4:
                    System.out.print("Nume: ");
                    String parrotName = scanner.next();
                    System.out.print("Vârsta: ");
                    int parrotAge = scanner.nextInt();
                    System.out.print("Cuvinte cunoscute: ");
                    int words = scanner.nextInt();
                    zoo.addAnimal(new Parrot(parrotName, parrotAge, words));
                    break;
                case 5:
                    System.out.print("Tip (Dog/Cat/Parrot): ");
                    String type = scanner.next();
                    zoo.listByType(type);
                    break;
                case 6:
                    zoo.findOldest();
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

