// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

contract A {
    int public a;

    error NegativeValue(int value);

    function setA(int value) external returns (int) {
        a = value;                                     // modified before the checks
        if (value < 0) revert NegativeValue(value);    // custom error
        require(value != 13, "Unlucky value");         // Error(string)
        return 100 / (value - 10);                     // Panic(0x12) if value == 10
    }
}

contract B {
    A public contractA;
    int public b;

    uint public nbCalls;
    uint public nbCallsError;
    uint public nbCallsPanic;
    uint public nbCallsRevert;

    constructor(A _contractA) {
        contractA = _contractA;
    }

    function setDirect(int value) external {
        b = value;
        contractA.setA(value);                         // an error in A bubbles up
    }

    function setWithTry(int value) external {
        b = value;
        nbCalls += 1;
        try contractA.setA(value) returns (int result) {
            b = result;
        } catch Error(string memory) {
            nbCallsError += 1;
        } catch Panic(uint) {
            nbCallsPanic += 1;
        } catch (bytes memory) {
            nbCallsRevert += 1;
        }
    }
}
