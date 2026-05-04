package com.pao.laboratory10.exercise2;
import com.pao.laboratory10.exercise1.Tranzactie;
import com.pao.laboratory10.exercise1.TipTranzactie;

import java.lang.reflect.Array;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // TODO: Implementează conform Readme.md
        //
        // 1. Citește N din stdin, apoi cele N tranzacții (id suma data tip) — pot exista duplicate de id
        //    Stochează-le toate într-un ArrayList<Tranzactie> (cu duplicate, ordine inserare)
        //
        // 2. Procesează comenzile din stdin până la EOF:
        //
        //   UNIQUE_IDS      → LinkedHashSet<Integer> cu id-urile în ordinea primei apariții
        //                     afișează: "IDs unice (N): [1, 2, 3, ...]"
        //
        //   MONTHLY_REPORT  → TreeMap<String, ...> grupat pe yyyy-MM (substring 0-7 din data)
        //                     pentru fiecare lună, sumele CREDIT și DEBIT
        //                     format: "yyyy-MM: CREDIT X.XX RON, DEBIT Y.YY RON"
        //
        //   TOP n           → primele n tranzacții după suma descrescătoare (nu modifică lista)
        //                     afișează "Top n:" urmat de n linii
        //
        //   SORT_ASC        → Collections.sort cu suma crescătoare; afișează lista sortată
        //   SORT_DESC       → Collections.sort cu suma descrescătoare; afișează lista sortată
        //   REVERSE         → Collections.reverse; afișează lista
        //   MIN_MAX         → Collections.min/max după suma
        //                     "MIN: [id] data tip: suma RON"
        //                     "MAX: [id] data tip: suma RON"
        //
        //   CME_DEMO        → încearcă for(t : lista) lista.remove(t) în try-catch
        //                     afișează "ConcurrentModificationException prins: modificare in iteratie detectata."
        //
        // Format linie tranzacție: [id] data tip: suma RON
        //   Ex: [1] 2024-01-15 CREDIT: 1500.00 RON


        //1
        ArrayList<Tranzactie> tranzactii = new ArrayList<>();

        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        for(int i=0; i<n; i++){
            int id = scanner.nextInt();
            double suma = scanner.nextDouble();
            String data = scanner.next();
            TipTranzactie tip = TipTranzactie.valueOf(scanner.next());

            Tranzactie tranzactie = new Tranzactie(id, suma, data, tip);
            tranzactii.addLast(tranzactie);
        }


        //2
        while(scanner.hasNext()) {
            String comanda = scanner.next();

            switch (comanda) {
                case "UNIQUE_IDS": {
                    LinkedHashSet<Integer> idsU = new LinkedHashSet<>();

                    for(Tranzactie tranzactie : tranzactii){
                        idsU.add(tranzactie.getId());
                    }

                    System.out.println("IDs unice (" + idsU.size() + "): " + idsU);

                    break;
                }

                case "MONTHLY_REPORT": {
                    TreeMap<String, double[]> raport = new TreeMap<>();

                    for(Tranzactie tranzactie : tranzactii){
                        String data = tranzactie.getData().substring(0,7);

                        if (!raport.containsKey(data)){
                            raport.put(data, new double[]{0.0, 0.0});
                        }

                        if(tranzactie.getTip() == TipTranzactie.CREDIT){
                            raport.get(data)[0] += tranzactie.getSuma();
                        }
                        else if(tranzactie.getTip() == TipTranzactie.DEBIT){
                            raport.get(data)[1] += tranzactie.getSuma();
                        }

                    }

                    for (Map.Entry<String, double[]> entry : raport.entrySet()) {
                        String luna = entry.getKey();
                        double credit = entry.getValue()[0];
                        double debit = entry.getValue()[1];

                        System.out.printf("%s: CREDIT %.2f RON, DEBIT %.2f RON%n", luna, credit, debit);
                    }

                    break;
                }

                case "TOP": {
                    int topN = scanner.nextInt();

                    ArrayList<Tranzactie> copie = new ArrayList<>(tranzactii);

                    Collections.sort(copie, Comparator.comparing(Tranzactie::getSuma).reversed());


                    System.out.println("Top " + topN + ":");

                    for(int i=0; i<topN; i++){
                        System.out.println(copie.get(i));
                    }

                    break;
                }

                case "SORT_ASC": {
                    Collections.sort(tranzactii, Comparator.comparing(Tranzactie::getSuma));

                    for(Tranzactie tranzactie : tranzactii){
                        System.out.println(tranzactie);
                    }

                    break;
                }

                case "SORT_DESC": {
                    Collections.sort(tranzactii, Comparator.comparing(Tranzactie::getSuma).reversed());

                    for(Tranzactie tranzactie : tranzactii){
                        System.out.println(tranzactie);
                    }

                    break;
                }

                case "REVERSE": {
                    Collections.reverse(tranzactii);

                    for(Tranzactie tranzactie : tranzactii){
                        System.out.println(tranzactie);
                    }

                    break;
                }

                case "MIN_MAX": {
                    Tranzactie min = tranzactii.get(0);
                    Tranzactie max = tranzactii.get(0);

                    for(Tranzactie tranzactie : tranzactii){
                        if(tranzactie.getSuma() < min.getSuma()){
                            min = tranzactie;
                        }
                        else if(tranzactie.getSuma() > max.getSuma()){
                            max = tranzactie;
                        }
                    }

                    System.out.println("MIN: " + min);
                    System.out.println("MAX: " + max);

                    break;

                }
                case "CME_DEMO": {
                    try {
                        for (Tranzactie t : tranzactii) {
                            tranzactii.remove(t);
                        }
                    } catch (ConcurrentModificationException e) {
                        System.out.println("ConcurrentModificationException prins: modificare in iteratie detectata.");
                    }

                    break;
                }

            }
        }
        scanner.close();
    }
}
