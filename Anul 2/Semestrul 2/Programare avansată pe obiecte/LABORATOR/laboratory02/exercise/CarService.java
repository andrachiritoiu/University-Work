package com.pao.laboratory02.exercise;

/**
 * Exercițiu — Singleton Service pentru Car
 *
 * Completează metoda marcată cu TODO.
 *
 * Ce este un Singleton?
 * - O clasă care are O SINGURĂ instanță în toată aplicația.
 * - Constructorul este PRIVAT — nimeni nu poate face "new CarService()".
 * - Se accesează prin CarService.getInstance().
 *
 * De ce Singleton aici?
 * - Avem un singur "depozit" de mașini în tot programul.
 * - Oricine apelează getInstance() primește același depozit.
 *
 * Implementare: Bill Pugh Singleton (cu Holder intern).
 * - Instanța se creează o singură dată, lazy (doar la primul apel).
 * - Thread-safe fără sincronizare explicită.
 */
public class CarService {
    private Car[] cars;

    // Constructor PRIVAT — nu se poate apela din exterior
    private CarService() {
        this.cars = new Car[0];
    }

    // Holder intern — JVM garantează că se inițializează o singură dată
    private static class Holder {
        private static final CarService INSTANCE = new CarService();
    }

    // Punct unic de acces la instanță
    public static CarService getInstance() {
        return Holder.INSTANCE;
    }

    /**
     * Afișează toate mașinile din sistem.
     * Dacă nu există mașini, afișează un mesaj corespunzător.
     */
    public void listAllCars() {
        if (cars.length == 0) {
            System.out.println("Nu există mașini în sistem.");
            return;
        }
        for (int i = 0; i < cars.length; i++) {
            System.out.println((i + 1) + ". " + cars[i]);
        }
    }

    /**
     * Adaugă o mașină nouă în array.
     * Folosește pattern-ul de redimensionare dinamică (ca în ArrayDemo).
     */
    public void addCar(Car car) {
        Car[] tmp = new Car[cars.length + 1];
        System.arraycopy(cars, 0, tmp, 0, cars.length);
        tmp[tmp.length - 1] = car;
        cars = tmp;
        System.out.println("Mașina \"" + car.getName() + "\" a fost adăugată!");
    }

    /**
     * TODO — Exercițiu bonus
     *
     * Adaugă un review la mașina cu numele dat.
     *
     * Pași:
     * 1. Parcurge array-ul cars cu un for.
     * 2. Compară numele fiecărei mașini cu carName folosind .equals()
     *    (ex: cars[i].getName().equals(carName))
     * 3. Dacă o găsești:
     *    a. Ia array-ul curent de reviews: cars[i].getReviews()
     *    b. Creează un array nou cu length + 1 (același pattern ca la addCar)
     *    c. Copiază review-urile vechi + adaugă review-ul nou
     *    d. Setează noul array: cars[i].setReviews(newReviews)
     *    e. Afișează un mesaj de confirmare și return
     * 4. Dacă nu o găsești (for-ul se termină), afișează "Mașina nu a fost găsită."
     */
    public void addReview(String carName, String review) {
        // TODO: implementează aici
    }
}

