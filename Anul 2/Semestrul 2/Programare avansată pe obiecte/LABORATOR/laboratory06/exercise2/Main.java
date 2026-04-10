package com.pao.laboratory06.exercise2;

public class Main {
    public static void main(String[] args) {
//        Scanner in = new Scanner(System.in);
//        int n = in.nextInt();
//        List<Colaborator> colaboratori = new ArrayList<>();
//        for (int i = 0; i < n; i++) {
//            String tip = in.next();
//            Colaborator c = switch (tip) {
//                case "CIM" -> {
//                    CIMColaborator obj = new CIMColaborator();
//                    obj.citeste(in);
//                    yield obj;
//                }
//                case "PFA" -> {
//                    PFAColaborator obj = new PFAColaborator();
//                    obj.citeste(in);
//                    yield obj;
//                }
//                case "SRL" -> {
//                    SRLColaborator obj = new SRLColaborator();
//                    obj.citeste(in);
//                    yield obj;
//                }
//                default -> throw new IllegalArgumentException("Tip necunoscut: " + tip);
//            };
//            colaboratori.add(c);
//        }
//        // Sortează și afișează pe tip, fiecare descrescător după venit net anual
//        for (TipColaborator tipColab : TipColaborator.values()) {
//            colaboratori.stream()
//                    .filter(c -> c.getTip() == tipColab)
//                    .sorted((a, b) -> Double.compare(b.calculeazaVenitNetAnual(), a.calculeazaVenitNetAnual()))
//                    .forEach(Colaborator::afiseaza);
//        }
//        // Colaborator cu venit net maxim
//        Colaborator max = colaboratori.stream().max(Comparator.comparingDouble(Colaborator::calculeazaVenitNetAnual)).orElse(null);
//        System.out.printf("\nColaborator cu venit net maxim: ");
//        if (max != null) max.afiseaza();
//        // Colaboratori persoane juridice (SRL)
//        System.out.println("\nColaboratori persoane juridice:");
//        colaboratori.stream()
//                .filter(c -> c instanceof PersoanaJuridica)
//                .sorted((a, b) -> Double.compare(b.calculeazaVenitNetAnual(), a.calculeazaVenitNetAnual()))
//                .forEach(Colaborator::afiseaza);
//        // Sume și număr colaboratori pe tip
//        System.out.println("\nSume și număr colaboratori pe tip:");
//        Map<TipColaborator, Double> suma = new EnumMap<>(TipColaborator.class);
//        Map<TipColaborator, Integer> numar = new EnumMap<>(TipColaborator.class);
//        var typesOfCollaborators = new HashSet<TipColaborator>();
//        for (Colaborator c : colaboratori) {
//            typesOfCollaborators.add(c.getTip());
//        }
//        for (TipColaborator t : typesOfCollaborators) {
//            suma.put(t, 0.0);
//            numar.put(t, 0);
//        }
//        for (Colaborator c : colaboratori) {
//            TipColaborator t = c.getTip();
//            suma.put(t, suma.get(t) + c.calculeazaVenitNetAnual());
//            numar.put(t, numar.get(t) + 1);
//        }
//        for (TipColaborator t : TipColaborator.values()) {
//            System.out.printf("%s: suma = %.2f lei, număr = %d\n", t, suma.get(t), numar.get(t));
//        }
    }
}