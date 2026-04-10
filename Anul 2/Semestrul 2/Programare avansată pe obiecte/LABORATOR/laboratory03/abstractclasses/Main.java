package com.pao.laboratory03.abstractclasses;

/** Demo: clase abstracte, moștenire, polimorfism, upcasting. */
public class Main {
    public static void main(String[] args) {

        MySqlConnection mysql = new MySqlConnection("jdbc:mysql://localhost:3306/mydb");
        OracleConnection oracle = new OracleConnection("jdbc:oracle:thin:@localhost:1521:orcl");

        System.out.println("=== Conexiune MySQL ===");
        mysql.connectToDb();
        mysql.afterDbConnection();

        System.out.println();

        System.out.println("=== Conexiune Oracle ===");
        oracle.connectToDb();
        oracle.afterDbConnection();

        // Polimorfism: variabilă tip-părinte stochează obiect-copil
        System.out.println("\n=== Polimorfism — array de DBConnection ===");
        DBConnection[] connections = {mysql, oracle};
        for (DBConnection conn : connections) {
            System.out.println(conn);
        }
    }
}
