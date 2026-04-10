package com.pao.laboratory03.abstractclasses;

/**
 * Clasă abstractă — nu poate fi instanțiată direct.
 * Conține metode abstracte (fără corp) + metode concrete (cu corp).
 */
public abstract class DBConnection {

    private String url;

    public DBConnection(String url) {
        this.url = url;
    }

    /** Abstractă — subclasele TREBUIE să o implementeze. */
    public abstract void connectToDb();

    /** Concretă — moștenită automat de subclase. */
    public void afterDbConnection() {
        System.out.println("  → Conexiune stabilită la: " + url);
    }

    public String getUrl() {
        return url;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{url='" + url + "'}";
    }
}
