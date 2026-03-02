package Lab1;
import java.util.Scanner;

public class lab1{
    public static void main(String[] args){
        Scanner scanner = new Scanner(System.in);
        int n;
        int[] array;
        n=scanner.nextInt();
        array=new int[n];
        for(int i=0;i<n;i++){
            array[i]=scanner.nextInt();
        }

        //afisare
        for(int num:array){
            System.out.println(num);
        }

        //afisam folosind indici din campul length
        for(int i=0;i<array.length;i++){
            System.out.println(array[i]);
        }
    }
}

/*
Rezolvati urmatoarele ex din fisiere
1.MediaAritmetica.java - citesti sirul il af si media
2.Diagonalele matricei din pachetul com.pao.laborator00 - citesti matricea de n*n, af matrice si suma el
de pe diagonala principala si produsul el de pe diagonala secundara
 */