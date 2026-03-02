package Lab1;
import java.util.Scanner;

public class Matrice{
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n, sum = 0, prod = 1;
        int[][] matrix;
        n = scanner.nextInt();
        matrix = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                matrix[i][j] = scanner.nextInt();
                if (i == j) sum += matrix[i][j];
                if (i + j == n - 1) prod *= matrix[i][j];
            }

        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                System.out.print(matrix[i][j] + " ");
            }
            System.out.println();
        }

        System.out.println("Suma de pe diagonala principala: " + sum);
        System.out.println("Produs de pe diagonala secundara: " + prod);
    }
}


