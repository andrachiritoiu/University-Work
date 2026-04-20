package com.pao.laboratory08.exercise2;

import com.pao.laboratory08.exercise1.Student;
import com.pao.laboratory08.exercise1.Adresa;
import java.io.*;
import java.util.*;

public class Main {
    private static final String FILE_PATH = "src/com/pao/laboratory08/tests/studenti.txt";
    private static final String OUTPUT_FILE = "src/com/pao/laboratory08/exercise2/rezultate.txt";

    public static void main(String[] args) throws Exception {
        // TODO: Implementează conform Readme.md
        //
        // 1. Citește studenții din FILE_PATH cu BufferedReader
        // 2. Citește pragul de vârstă din stdin cu Scanner
        // 3. Filtrează studenții cu varsta >= prag
        // 4. Scrie filtrații în "rezultate.txt" cu BufferedWriter
        // 5. Afișează sumarul la consolă

        //1
        BufferedReader br = new BufferedReader(new FileReader(FILE_PATH));

        List<Student> studenti = new ArrayList<>();

        String linie = br.readLine() ;
        while(linie != null){
            if (linie.trim().isEmpty()) {
                linie = br.readLine();
                continue;
            }

            String[] info = linie.split(",");

            if (info.length < 4) {
                linie = br.readLine();
                continue;
            }

            String nume = info[0].trim();
            int varsta = Integer.parseInt(info[1].trim());
            String oras = info[2].trim();
            String strada = info[3].trim();

            Adresa adresa = new Adresa(oras, strada);
            Student student = new Student(nume, varsta, adresa);

            studenti.add(student);

            linie = br.readLine();
        }

        br.close();

        //2
        Scanner sc = new Scanner(System.in);
        int prag = Integer.parseInt(sc.nextLine().trim());


        //3
        List<Student> sudentiFiltrati = new ArrayList<>();

        for(Student s : studenti){
            if(s.getVarsta() >= prag){
                sudentiFiltrati.add(s);
            }
        }

        //4
        BufferedWriter bw = new BufferedWriter(new PrintWriter(OUTPUT_FILE));

        for(Student s : sudentiFiltrati){
            bw.write(s.toString());
            bw.newLine();
        }

        bw.close();

        //5
        System.out.println("Filtru: varsta >= " + prag);
        System.out.println("Rezultate: " + sudentiFiltrati.size() + " studenti");
        System.out.println();

        for (Student s : sudentiFiltrati) {
            System.out.println(s);
        }

        System.out.println();
        System.out.println("Scris in: rezultate.txt");
    }
}

