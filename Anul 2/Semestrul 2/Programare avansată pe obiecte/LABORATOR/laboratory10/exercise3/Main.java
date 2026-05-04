package com.pao.laboratory10.exercise3;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.pao.laboratory10.exercise1.Tranzactie;
import com.pao.laboratory10.exercise1.TipTranzactie;

public class Main {
    public static void main(String[] args) {
        List<TranzactieStream> tranzactii = List.of(
                new TranzactieStream(1, 1500.00, "2024-01-10", TipTranzactie.CREDIT, "CONT_A"),
                new TranzactieStream(2, 300.00, "2024-01-15",  TipTranzactie.DEBIT, "CONT_B"),
                new TranzactieStream(3, 2500.00, "2024-01-20", TipTranzactie.CREDIT, "CONT_A"),
                new TranzactieStream(4, 700.00, "2024-02-05",  TipTranzactie.DEBIT, "CONT_C"),
                new TranzactieStream(5, 1200.00, "2024-02-12", TipTranzactie.CREDIT, "CONT_B"),
                new TranzactieStream(6, 450.00, "2024-02-18",  TipTranzactie.DEBIT, "CONT_D"),
                new TranzactieStream(7, 3200.00, "2024-03-01", TipTranzactie.CREDIT, "CONT_A"),
                new TranzactieStream(8, 900.00, "2024-03-07",  TipTranzactie.DEBIT, "CONT_C"),
                new TranzactieStream(9, 1100.00, "2024-03-14", TipTranzactie.CREDIT, "CONT_E"),
                new TranzactieStream(10, 250.00, "2024-03-21",  TipTranzactie.DEBIT, "CONT_B")
        );

        //1. filter(tip == CREDIT)
        System.out.println("1. Tranzactii CREDIT:");
        tranzactii.stream()
                .filter(t -> t.getTip() == TipTranzactie.CREDIT)
                .forEach(System.out::println);

        //2.  mapToDouble(suma).sum()
        System.out.println("\n2. Total procesat:");

        double total = tranzactii.stream()
                                .mapToDouble(TranzactieStream::getSuma)
                                .sum();

        System.out.printf("Total procesat: %.2f RON%n", total);

        // 3. groupingBy(luna, summingDouble(suma))
        System.out.println("\n3. Total per luna:");

        Map<String, Double> sume = tranzactii.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getData().substring(0,7),
                        Collectors.summingDouble(TranzactieStream::getSuma)
                ));

        sume.forEach((luna, suma) ->
                System.out.printf("%s: %.2f RON%n", luna, suma)
        );

        // 4. sorted(comparingDouble.reversed()).limit(3)
        System.out.println("\n4. Top 3 tranzactii:");

        tranzactii.stream()
                .sorted(Comparator.comparingDouble(TranzactieStream::getSuma).reversed())
                .limit(3)
                .forEach(System.out::println);

        // 5. map(contSursa).distinct().collect(toList())
        System.out.println("\n5. Conturi sursa unice:");

        List<String> conturiUnice = tranzactii.stream()
                                            .map(TranzactieStream::getContSursa)
                                            .distinct()
                                            .collect(Collectors.toList());

        System.out.println("Conturi sursa unice: " + conturiUnice);


        // 6. mapToDouble(suma).average()
        System.out.println("\n6. Suma medie:");
        double sumaM = tranzactii.stream()
                .mapToDouble(TranzactieStream::getSuma)
                .average()
                .orElse(0.0);

        System.out.printf("Suma medie: %.2f RON%n", sumaM);


        // 7. groupingBy(luna) cu extras de cont
        System.out.println("\n7. Extrase de cont lunare:");
        Map<String , List<TranzactieStream>> tranzactiiPerLuna = tranzactii.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getData().substring(0,7),
                        Collectors.toList()));

        tranzactiiPerLuna.forEach( (luna,lista) -> {
            double suma = lista.stream()
                    .mapToDouble(TranzactieStream::getSuma)
                    .sum();

            System.out.printf("EXTRAS DE CONT - %s: %d tranzactii, total: %.2f RON%n",
                    luna, lista.size(), suma);
        });
    }
}
