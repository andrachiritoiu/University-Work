# Exercise 3 (Bonus) - Colector custom si snapshot imutabil

## Scenariu

Extinde modulul de raportare cu un colector custom care produce un snapshot analitic read-only.

## Notiuni demonstrate

- `Collector.of(...)`
- modele imutabile pentru rezultate
- separare intre colectare si prezentare

## Cerinte minime

1. Defineste un colector custom pentru agregare pe mai multe dimensiuni.
2. Returneaza un rezultat imutabil (fara mutatii dupa construire).
3. Demonstreaza in `Main.java` cel putin 3 interogari pe snapshot.

## Libertate de implementare

- Nu exista format I/O fix.
- Datele pot fi hardcodate sau generate intern.
- Evaluarea este manuala pe baza claritatii demo-ului si corectitudinii rezultatului.

## Exemplu de implementare (sugestie)

Mai jos este un exemplu minimal, complet funcțional, care ilustrează un `Collector` custom, un container mutabil folosit în colectare și un `Snapshot` imutabil returnat de finisher. Codul e orientativ — poți folosi aceleași idei în implementarea ta.

1) Model simplu `Transaction` (immutabil):

```java
public final class Transaction {
	private final int id;
	private final BigDecimal amount;
	private final LocalDate date;
	private final String country;
	private final String channel;

	public Transaction(int id, BigDecimal amount, LocalDate date, String country, String channel) {
		this.id = id; this.amount = amount; this.date = date; this.country = country; this.channel = channel;
	}
	// getters...
}
```

2) `Snapshot` imutabil pentru rezultate agregate:

```java
public final class Snapshot {
	private final Map<String, Long> countByCountry;
	private final Map<String, Long> countByChannel;
	private final BigDecimal totalAmount;
	private final List<Transaction> topTransactions;

	public Snapshot(Map<String, Long> byCountry, Map<String, Long> byChannel, BigDecimal total, List<Transaction> top) {
		this.countByCountry = Collections.unmodifiableMap(new HashMap<>(byCountry));
		this.countByChannel = Collections.unmodifiableMap(new HashMap<>(byChannel));
		this.totalAmount = total;
		this.topTransactions = List.copyOf(top);
	}
	// getters...
}
```

3) `CustomCollectors.toSnapshot(int topN)` — collector custom:

```java
public static Collector<Transaction, ?, Snapshot> toSnapshot(int topN) {
	class Agg { /* mutable maps, total, list */ }
	return Collector.of(
		Agg::new,
		(agg, tx) -> { /* accumulate */ },
		(a,b) -> { /* combine for parallel */ return a; },
		agg -> { /* finisher -> build Snapshot, compute topN */ }
	);
}
```

4) `Main` demo — cel puțin 3 interogări pe `Snapshot`:

```java
List<Transaction> data = List.of(/* câteva tranzacții hardcodate */);
Snapshot snap = data.stream().collect(CustomCollectors.toSnapshot(5));

// Interogare 1: top tranzacții (din snapshot)
snap.getTopTransactions().forEach(System.out::println);

// Interogare 2: total pe țări (desc)
snap.getCountByCountry().entrySet().stream() /* sort & print */;

// Interogare 3: canale ordonate după număr
snap.getCountByChannel().entrySet().stream() /* sort & print */;
```

Comentarii:
- Finisher-ul `agg -> Snapshot` trebuie să transforme structurile mutabile din `Agg` în colecții imutabile și să calculeze view-urile (ex: topN).
- `Collector.Characteristics.UNORDERED` este acceptabil dacă nu depinzi de ordinea stream-ului; asigură-te că `combine` e corect implementat pentru execuții paralele.
- Testează cu date care produc tie-breakers (ex: două tranzacții cu aceeași sumă) pentru a demonstra stabilitatea ordonării din snapshot.
