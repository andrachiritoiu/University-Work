// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FidelityToken} from "../src/FidelityToken.sol";
import {FidelityPoints} from "../src/FidelityPoints.sol";


//ex 1
contract FidelityPointsTest is Test {

    FidelityToken token;
    FidelityPoints fidelity;

    address alice = makeAddr("alice");

    function setUp() public {
        token = new FidelityToken(address(this), 1000 ether);

        fidelity = new FidelityPoints(address(token));

        token.transferOwnership(address(fidelity));
    }

    function test_AddPoints() public {
        fidelity.addPoints(alice, 100 ether);

        assertEq(token.balanceOf(alice), 100 ether);
        assertEq(token.totalSupply(), 100 ether);
    }

    function test_SpendPoints() public {
        fidelity.addPoints(alice, 100 ether);

        vm.startPrank(alice);

        token.approve(address(fidelity), 40 ether);
        fidelity.spendPoints(40 ether);

        vm.stopPrank();

        assertEq(token.balanceOf(alice), 60 ether);
        assertEq(token.totalSupply(), 60 ether);
    }
}