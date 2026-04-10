package com.pao.test;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

import com.github.difflib.DiffUtils;
import com.github.difflib.UnifiedDiffUtils;
import com.github.difflib.patch.Patch;

/**
 * Utilitar pentru testarea automată a exercițiilor I/O.
 * <p>
 * Folosire dintr-un Test.java al unui exercițiu:
 * IOTest.runParts("src/com/pao/laboratoryNN/exerciseM/tests", Main::main);
 * <p>
 * Convenție directoare de test:
 * tests/partA/1.in  → input furnizat la System.in pentru Partea A, testul 1
 * tests/partA/1.out → output așteptat (comparație exactă, fără spații finale)
 * tests/partB/1.in, tests/partB/1.out, ... pentru Partea B
 * ... și tot așa pentru partC, partD etc.
 * <p>
 * Fișierele .in și .out trebuie să aibă același prefix numeric (e.g. 1.in / 1.out).
 * Subdirectoarele sunt procesate în ordine alfabetică.
 */
public class IOTest {

    @FunctionalInterface
    public interface MainMethod {
        void run(String[] args) throws Exception;
    }

    /**
     * Rulează testele din toate subdirectoarele partX/ ale directorului dat.
     * Fiecare subdirector este o "parte" a exercițiului și primește propriul header și sumar.
     * La final se afișează un tabel combinat cu rezultatele tuturor părților.
     *
     * @param testsDir calea relativă la rădăcina proiectului (e.g. "src/com/pao/laboratory06/exercise1/tests")
     * @param main     referință la Main::main al exercițiului testat
     */
    public static void runParts(String testsDir, MainMethod main) {
        runParts(testsDir, main, false);
    }

    /**
     * Rulează testele din toate subdirectoarele partX/ ale directorului dat.
     * Fiecare subdirector este o "parte" a exercițiului și primește propriul header și sumar.
     * La final se afișează un tabel combinat cu rezultatele tuturor părților.
     *
     * @param testsDir        calea relativă la rădăcina proiectului (e.g. "src/com/pao/laboratory06/exercise1/tests")
     * @param main            referință la Main::main al exercițiului testat
     * @param printFullOutput dacă să se afișeze outputul complet (expected/actual) la testele eșuate
     */
    public static void runParts(String testsDir, MainMethod main, boolean printFullOutput) {
        File dir = new File(testsDir);
        if (!dir.exists() || !dir.isDirectory()) {
            System.out.println("EROARE: directorul de teste nu există: " + dir.getAbsolutePath());
            return;
        }

        // Colectăm subdirectoarele (partA, partB, partC, ...)
        File[] all = dir.listFiles();
        File[] partDirs = (all == null) ? new File[0]
                : Arrays.stream(all)
                  .filter(f -> f.isDirectory())
                  .toArray(File[]::new);
        Arrays.sort(partDirs, Comparator.comparing(File::getName));

        if (partDirs.length == 0) {
            System.out.println("EROARE: nu există subdirectoare de tip partX/ în " + testsDir);
            System.out.println("Structura așteptată: tests/partA/, tests/partB/, ...");
            return;
        }

        // Rezultate per parte pentru tabelul final
        List<String> partNames = new ArrayList<>();
        List<Integer> partPassed = new ArrayList<>();
        List<Integer> partTotal = new ArrayList<>();

        for (File partDir : partDirs) {
            String partName = partDir.getName();
            System.out.println();
            System.out.println("╔══════════════════════════════════════════════════════════════╗");
            System.out.printf("║  Partea: %-52s║%n", partName);
            System.out.println("╚══════════════════════════════════════════════════════════════╝");

            int[] results = runPartDir(partDir, main, printFullOutput);
            partNames.add(partName);
            partPassed.add(results[0]);
            partTotal.add(results[1]);
        }

        // Tabel sumar final
        System.out.println();
        System.out.println("══════════════════════════════════════════════════════════════");
        System.out.println("  SUMAR FINAL");
        System.out.println("──────────────────────────────────────────────────────────────");
        int totalP = 0, totalT = 0;
        for (int i = 0; i < partNames.size(); i++) {
            int p = partPassed.get(i), t = partTotal.get(i);
            String status = (p == t && t > 0) ? "[OK]" : (p == 0 ? "[FAIL]" : "[PARTIAL]");
            System.out.printf("  %s  %-10s  %d/%d teste%n", status, partNames.get(i), p, t);
            totalP += p;
            totalT += t;
        }
        System.out.println("──────────────────────────────────────────────────────────────");
        System.out.printf("  Total: %d/%d teste trecute%n", totalP, totalT);
        System.out.println("══════════════════════════════════════════════════════════════");
    }

    /**
     * Rulează testele dintr-o singură parte (subdirector).
     * Util în dezvoltare: IOTest.runPart("src/.../tests", "partA", Main::main)
     *
     * @param testsDir calea relativă la directorul tests/
     * @param partName numele subdirectorului (e.g. "partA")
     * @param main     referință la Main::main
     */
    public static void runPart(String testsDir, String partName, MainMethod main) {
        runPart(testsDir, partName, main, false);
    }

    /**
     * Rulează testele dintr-o singură parte (subdirector), cu opțiune de afișare completă output.
     *
     * @param testsDir        calea relativă la directorul tests/
     * @param partName        numele subdirectorului (e.g. "partA")
     * @param main            referință la Main::main
     * @param printFullOutput dacă să se afișeze outputul complet (expected/actual) la testele eșuate
     */
    public static void runPart(String testsDir, String partName, MainMethod main, boolean printFullOutput) {
        File partDir = new File(testsDir, partName);
        if (!partDir.exists() || !partDir.isDirectory()) {
            System.out.println("EROARE: directorul de parte nu există: " + partDir.getAbsolutePath());
            return;
        }
        // delete old diffs for this part
        File resultsDir = new File(partDir, "../../results").getAbsoluteFile();
        if (resultsDir.exists()) {
            File[] oldDiffs = resultsDir.listFiles((d, name) -> name.startsWith(partName + "-") && name.endsWith(".diff"));
            if (oldDiffs != null) {
                for (File f : oldDiffs) f.delete();
            }
        }
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.printf("║  Partea: %-52s║%n", partName);
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
        int[] results = runPartDir(partDir, main, printFullOutput);
        System.out.println();
        System.out.printf("Rezultat %s: %d/%d teste trecute.%n", partName, results[0], results[1]);
    }

    /**
     * Rulează testele direct dintr-un director plat (fără subdirectoare partX/).
     * Fișierele .in și .out trebuie să fie direct în directorul dat.
     *
     * @param testsDir calea relativă la rădăcina proiectului (e.g. "src/com/pao/laboratory07/exercise2/tests")
     * @param main     referință la Main::main al exercițiului testat
     */
    public static void runFlat(String testsDir, MainMethod main) {
        runFlat(testsDir, main, false);
    }

    /**
     * Rulează testele direct dintr-un director plat (fără subdirectoare partX/), cu opțiune de afișare completă.
     *
     * @param testsDir        calea relativă la rădăcina proiectului
     * @param main            referință la Main::main al exercițiului testat
     * @param printFullOutput dacă să se afișeze outputul complet la testele eșuate
     */
    public static void runFlat(String testsDir, MainMethod main, boolean printFullOutput) {
        File dir = new File(testsDir);
        if (!dir.exists() || !dir.isDirectory()) {
            System.out.println("EROARE: directorul de teste nu există: " + dir.getAbsolutePath());
            return;
        }
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.printf("║  Teste: %-53s║%n", testsDir);
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
        int[] results = runPartDir(dir, main, printFullOutput);
        System.out.println();
        System.out.println("══════════════════════════════════════════════════════════════");
        System.out.printf("  Total: %d/%d teste trecute%n", results[0], results[1]);
        System.out.println("══════════════════════════════════════════════════════════════");
    }

    // ── Internal helpers ─────────────────────────────────────────────────────

    /**
     * Rulează toate testele (.in/.out) dintr-un singur director de parte.
     *
     * @return int[]{passed, total}
     */
    private static int[] runPartDir(File dir, MainMethod main, boolean printFullOutput) {
        File[] all = dir.listFiles();
        File[] inFiles = (all == null) ? new File[0]
                : Arrays.stream(all).filter(f -> f.getName().endsWith(".in")).toArray(File[]::new);
        if (inFiles.length == 0) {
            System.out.println("  (niciun fișier .in găsit în " + dir.getPath() + ")");
            return new int[]{0, 0};
        }
        Arrays.sort(inFiles, Comparator.comparing(File::getName));

        int passed = 0, failed = 0;
        int testIdx = 0;
        for (File inFile : inFiles) {
            testIdx++;
            String base = inFile.getName().replace(".in", "");
            File outFile = new File(dir, base + ".out");

            System.out.println();
            System.out.println("  *** Test " + testIdx + ": " + base + " ***");

            if (!outFile.exists()) {
                System.out.println("  [SKIP] " + base + " — lipsește " + base + ".out");
                System.out.println("  -------------------------------------------------------------");
                continue;
            }

            String input, expected;
            try {
                input = Files.readString(inFile.toPath()).replace("\r\n", "\n");
                expected = Files.readString(outFile.toPath()).stripTrailing().replace("\r\n", "\n");
            } catch (IOException e) {
                System.out.println("  [ERROR] " + base + " — nu s-a putut citi: " + e.getMessage());
                failed++;
                System.out.println("  -------------------------------------------------------------");
                continue;
            }

            if (printFullOutput) {
                System.out.println();
                System.out.println("  Input:");
                System.out.println("  ---");
                if (input.isEmpty()) System.out.println("  (empty)");
                else {
                    for (String l : input.split("\n", -1)) System.out.println("  " + l);
                }
                System.out.println("  ---");
                System.out.println("  Expected:");
                System.out.println("  ---");
                if (expected.isEmpty()) System.out.println("  (empty)");
                else {
                    for (String l : expected.split("\n", -1)) System.out.println("  " + l);
                }
                System.out.println("  ---");
            }

            String actual = capture(input, main);
            if (actual == null) {
                System.out.println();
                System.out.println("  [FAIL] " + base + " — excepție la rularea Main.main()");
                System.out.println("  -------------------------------------------------------------");
                failed++;
                continue;
            }
            actual = actual.stripTrailing().replace("\r\n", "\n");

            if (actual.equals(expected)) {
                System.out.println("  [PASS] " + base);
                System.out.println();
                System.out.println("  -------------------------------------------------------------");
                passed++;
            } else {
                System.out.println("  [FAIL] " + base);
                System.out.println();
                if (printFullOutput) {
                    System.out.println("  Actual:");
                    System.out.println("  ---");
                    if (actual.isEmpty()) System.out.println("  (empty)");
                    else {
                        for (String l : actual.split("\n", -1)) System.out.println("  " + l);
                    }
                    System.out.println("  ---");
                }
                printUnifiedDiff(expected, actual, dir, base);
                System.out.println();
                System.out.println("  -------------------------------------------------------------");
                failed++;
            }
        }

        System.out.println();
        System.out.printf("  Rezultat parte: %d/%d teste trecute.%n", passed, passed + failed);
        return new int[]{passed, passed + failed};
    }

    // Overload for backward compatibility
    private static int[] runPartDir(File dir, MainMethod main) {
        return runPartDir(dir, main, false);
    }

    private static String capture(String input, MainMethod main) {
        InputStream savedIn = System.in;
        PrintStream savedOut = System.out;
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes()));
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            System.setOut(new PrintStream(baos));
            main.run(new String[0]);
            System.out.flush();
            return baos.toString();
        } catch (Exception e) {
            System.setIn(savedIn);
            System.setOut(savedOut);
            System.out.println("  Excepție: " + e);
            return null;
        } finally {
            System.setIn(savedIn);
            System.setOut(savedOut);
        }
    }

    // Print and save unified diff using java-diff-utils
    private static void printUnifiedDiff(String expected, String actual, File partDir, String base) {
        List<String> expectedLines = Arrays.asList(expected.split("\n", -1));
        List<String> actualLines = Arrays.asList(actual.split("\n", -1));
        Patch<String> patch = DiffUtils.diff(expectedLines, actualLines);
        List<String> unifiedDiff = UnifiedDiffUtils.generateUnifiedDiff(
                "expected", "actual", expectedLines, patch, 3);
        // Print to console
        System.out.println("  ╔═══ Diff ═══════════════");
        System.out.println("  ║");
        for (String line : unifiedDiff) {
            System.out.println("  ║    " + line);
        }
        System.out.println("  ║");
        System.out.println("  ╚═══ END of Diff ════════");
        // Save to results/partX-Y.diff
        File resultsDir = new File( partDir, "../../results").getAbsoluteFile();
        if (!resultsDir.exists()) resultsDir.mkdirs();
        String partName = partDir.getName();
        File diffFile = new File(resultsDir, partName + "-" + base + ".diff");
        if (diffFile.exists()) diffFile.delete();
        try (PrintWriter pw = new PrintWriter(diffFile, "UTF-8")) {
            for (String line : unifiedDiff) {
                pw.println(line);
            }
        } catch (IOException e) {
            System.out.println("    [Eroare la scrierea fișierului diff: " + diffFile.getAbsolutePath() + "]");
        }
    }
}
