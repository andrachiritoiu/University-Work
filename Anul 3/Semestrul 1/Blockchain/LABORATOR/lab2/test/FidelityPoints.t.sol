// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {FidelityPoints} from "../src/Laborator2_FidelityPoints.sol";

contract FidelityPointsTest is Test {

    FidelityPoints fidelity;
    address client = address(0x1234);

    function setUp() public {
        fidelity = new FidelityPoints(10);
    }

    function testInitialValue() public {
        assertEq(fidelity.pointValue(), 10);
        assertEq(fidelity.admin(), address(this));
    }

    function testAddPoints() public {
        fidelity.addPoints(client, 100);

        assertEq(fidelity.points(client), 100);
    }

    function testGetTotalValue() public {
        fidelity.addPoints(client, 100);

        assertEq(fidelity.getTotalValue(client), 1000);
    }

    function testSetPointValue() public {
        fidelity.addPoints(client, 100);
        fidelity.setPointValue(20);

        assertEq(fidelity.getTotalValue(client), 2000);
    }
}