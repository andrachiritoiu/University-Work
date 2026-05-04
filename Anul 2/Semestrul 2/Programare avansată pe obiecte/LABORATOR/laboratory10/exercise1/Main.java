package com.pao.laboratory10.exercise1;

import java.util.*;

public class Main {
    public static void main(String[] args) {
        // TODO: Implementează conform Readme.md
        //
        // Folosește LinkedList<Tranzactie> ca structură internă.
        // Citește comenzi din stdin până la EOF:
        //
        //   ENQUEUE id suma data tip   → addLast  (niciun output)
        //   DEQUEUE                    → removeFirst sau "Coada goala."
        //                                format: "Procesat: [id] data tip: suma RON"
        //   PUSH id suma data tip      → addFirst  (niciun output)
        //   POP                        → removeFirst sau "Coada goala."
        //                                format: "Extras: [id] data tip: suma RON"
        //   REMOVE_DEBIT               → Iterator.remove() pe toate DEBIT
        //                                afișează "Eliminat N tranzactii DEBIT."
        //   REMOVE_BELOW threshold     → Iterator.remove() pe suma < threshold
        //                                afișează "Eliminat N tranzactii sub threshold RON."
        //   PRINT                      → afișează toate, câte una pe linie
        //   SIZE                       → "Dimensiune coada: N"
        //
        // Format linie tranzacție: [id] data tip: suma RON
        //   Ex: [1] 2024-01-10 CREDIT: 500.00 RON


        LinkedList<Tranzactie> tranzactii = new LinkedList<>();

        Scanner scanner = new Scanner(System.in);

        while(scanner.hasNext()){
            String comanda = scanner.next();

            switch (comanda){
                //A
                case "ENQUEUE":{
                    int id = scanner.nextInt();
                    double suma = scanner.nextDouble();
                    String data = scanner.next();
                    TipTranzactie tip = TipTranzactie.valueOf(scanner.next());

                    Tranzactie tranzactie = new Tranzactie(id, suma, data, tip);
                    tranzactii.addLast(tranzactie);
                    break;
                }

                case "DEQUEUE":{
                    if(tranzactii.isEmpty()){
                        System.out.println("Coada goala.");
                    }
                    else{
                        Tranzactie tranzactie = tranzactii.removeFirst();
                        System.out.println("Procesat: " + tranzactie);
                    }

                    break;
                }

                case "PUSH":{
                    int id = scanner.nextInt();
                    double suma = scanner.nextDouble();
                    String data = scanner.next();
                    TipTranzactie tip = TipTranzactie.valueOf(scanner.next());

                    Tranzactie tranzactie = new Tranzactie(id, suma, data, tip);
                    tranzactii.addFirst(tranzactie);
                    break;
                }

                case "POP":{
                    if(tranzactii.isEmpty()){
                        System.out.println("Coada goala.");
                    }
                    else{
                        Tranzactie tranzactie = tranzactii.removeFirst();
                        System.out.println("Extras: " + tranzactie);
                    }

                    break;
                }

                case "PRINT":{
                    for(Tranzactie tranzactie : tranzactii){
                        System.out.println(tranzactie);
                    }

                    break;
                }

                case "SIZE":{
                    System.out.println("Dimensiune coada: " + tranzactii.size());
                    break;
                }

                //B
                case "REMOVE_DEBIT":{
                    Iterator<Tranzactie> itr = tranzactii.iterator();

                    int cnt = 0;
                    while(itr.hasNext()){
                        Tranzactie t = itr.next();

                        if(t.getTip() == TipTranzactie.DEBIT){
                            itr.remove();
                            cnt++;
                        }
                    }
                    System.out.println("Eliminat " + cnt + " tranzactii DEBIT.");

                    break;
                }

                case "REMOVE_BELOW":{
                    double threshold = scanner.nextDouble();

                    Iterator<Tranzactie> itr = tranzactii.iterator();

                    int cnt = 0;
                    while(itr.hasNext()){
                        Tranzactie t = itr.next();

                        if(t.getSuma() < threshold){
                            itr.remove();
                            cnt++;
                        }
                    }
                    System.out.printf("Eliminat %d tranzactii sub %.2f RON.%n", cnt, threshold);

                    break;
                }
            }
        }

        scanner.close();
    }
}
