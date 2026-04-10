package com.pao.test;

import com.github.difflib.DiffUtils;
import com.github.difflib.UnifiedDiffUtils;
import com.github.difflib.patch.Patch;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

class IncorrectExtensionException extends Exception {
    public IncorrectExtensionException(String expectedExtension, String filename) {
        super("Filename must end with '" + expectedExtension + "' but got: " + filename);
    }
}

public class DiffGenerator {
    public static void saveDiff(String expected, String actual, String filename) throws IncorrectExtensionException {
        if (!filename.endsWith(".diff")) {
            throw new IncorrectExtensionException(".diff", filename);
        }
        // 1. Define your Expected and Actual outputs (usually from your tests)
        List<String> expectedOutput = expected.lines().toList();

        List<String> actualOutput = actual.lines().toList();

        try {
            // 2. Compute the differences (The Patch)
            Patch<String> patch = DiffUtils.diff(expectedOutput, actualOutput);

            // 3. Convert the Patch into the standard Unified Diff format
            // Arguments: original filename, revised filename, original text, the patch, context size (lines around diff)
            List<String> unifiedDiff = UnifiedDiffUtils.generateUnifiedDiff(
                    "expected_output.txt",
                    "actual_output.txt",
                    expectedOutput,
                    patch,
                    3 // context size
            );

            // 4. Save it to a .diff file
            Path outputPath = Path.of(filename);
            Files.write(outputPath, unifiedDiff);

            System.out.println("Diff file generated successfully at: " + outputPath.toAbsolutePath());

        } catch (IOException e) {
            System.err.println("Failed to write diff file: " + e.getMessage());
        }
    }
}