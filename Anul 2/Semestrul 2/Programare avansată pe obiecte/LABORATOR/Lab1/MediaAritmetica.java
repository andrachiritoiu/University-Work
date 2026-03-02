package Lab1;
import java.util.Scanner;

public class MediaAritmetica{
    public static void main(String[] args){
        Scanner scanner = new Scanner(System.in);
        int n,sum=0;
        int[] array;
        n=scanner.nextInt();
        array=new int[n];
        for(int i=0;i<n;i++){
            array[i]=scanner.nextInt();
            sum+=array[i];
        }

        for(int num:array){
            System.out.println(num);
        }

        System.out.println("Media este: ");
        System.out.println((double)sum/n);
    }
}

/*
Rezolvati urmatoarele ex din fisiere
1.MediaAritmetica.java - citesti sirul il af si media
2.Diagonalele matricei din pachetul com.pao.laborator00 - citesti matricea de n*n, af matrice si suma el
de pe diagonala principala si produsul el de pe diagonala secundara
 */