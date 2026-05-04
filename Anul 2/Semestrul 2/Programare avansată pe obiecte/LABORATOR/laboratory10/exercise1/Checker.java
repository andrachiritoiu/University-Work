package com.pao.laboratory10.exercise1;

import com.pao.test.IOTest;

public class Checker {
    public static void main(String[] args) {
        // Rulează toate testele:
        IOTest.runParts("src/com/pao/laboratory10/exercise1/tests", Main::main);

        // Sau rulează doar testele pentru o parte specifică:
//        IOTest.runPart("src/com/pao/laboratory10/exercise1/tests", "partA", Main::main);
//        IOTest.runPart("src/com/pao/laboratory10/exercise1/tests", "partB", Main::main);
    }
}
