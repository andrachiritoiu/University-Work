package com.pao.laboratory08.exercise1;

import java.io.*;
import java.util.*;

public class Main {
    // Calea către fișierul cu date — relativă la rădăcina proiectului
    private static final String FILE_PATH = "src/com/pao/laboratory08/tests/studenti.txt";

    public static void main(String[] args) throws Exception {
        // TODO: Implementează conform Readme.md
        //
        // 1. Citește studenții din FILE_PATH cu BufferedReader
        // 2. Citește comanda din stdin: PRINT, SHALLOW <nume> sau DEEP <nume>
        // 3. Execută comanda:
        //    - PRINT → afișează toți studenții
        //    - SHALLOW <nume> → shallow clone + modifică orașul clonei la "MODIFICAT" + afișează
        //    - DEEP <nume> → deep clone + modifică orașul clonei la "MODIFICAT" + afișează

        //A
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

        Scanner sc = new Scanner(System.in);
        String comanda = sc.nextLine();

        String[] parti = comanda.split(" ",2);
        String tipComanda = parti[0];

        if (tipComanda.equals("PRINT")) {
            for (Student s : studenti) {
                System.out.println(s);
            }
        //B
        } else if(tipComanda.equals("SHALLOW")){
            String numeCautat = parti[1];
            Student studentCautat = null;

            for(Student s : studenti){
                if(s.getNume().equals(numeCautat)){
                    studentCautat = s;
                    break;
                }
            }

            Student clona = (Student) studentCautat.clone();
            clona.getAdresa().setOras("MODIFICAT");

            System.out.println("Original: " + studentCautat);
            System.out.println("Clona: " + clona);
        }
        //C
        else if (tipComanda.equals("DEEP")) {
            String numeCautat = parti[1];
            Student studentCautat = null;

            for(Student s : studenti){
                if(s.getNume().equals(numeCautat)){
                    studentCautat = s;
                    break;
                }
            }

            Student clona = (Student) studentCautat.deepClone();
            clona.getAdresa().setOras("MODIFICAT");

            System.out.println("Original: " + studentCautat);
            System.out.println("Clona: " + clona);
        }

    }
}
