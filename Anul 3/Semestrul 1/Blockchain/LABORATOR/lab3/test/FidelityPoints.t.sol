// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

import {Test, stdError} from "forge-std/Test.sol";
import {FidelityPoints} from "../src/FidelityPoints.sol";

contract FidelityPointsTest is Test {
    FidelityPoints public fidelityPoints;

    address admin = address(this);
    address user = makeAddr("user");

    function setUp() public {
        fidelityPoints = new FidelityPoints(10);
    }

    function test_SetPointValue_AsAdmin() public {
        vm.prank(admin);
        fidelityPoints.setPointValue(20);
        assertEq(fidelityPoints.pointValue(), 20);
    }

    function test_SetPointValue_RevertWhen_NotAdmin() public {
        vm.prank(user);

        vm.expectRevert(
            abi.encodeWithSelector(
                FidelityPoints.NotAdmin.selector,
                user
            )
        );

        fidelityPoints.setPointValue(20);

        assertEq(fidelityPoints.pointValue(), 10);
    }

    //2.1 
    function test_SpendPoints() public {
        fidelityPoints.addPoints(user, 100);

        vm.prank(user);
        fidelityPoints.spendPoints(30);

        assertEq(fidelityPoints.points(user), 70);
        assertEq(fidelityPoints.getTotalPoints(), 70);
    }

    //2.2
    function test_SpendTooManyPoints() public {
        fidelityPoints.addPoints(user, 100);

        vm.expectRevert(stdError.arithmeticError);
        vm.prank(user);
        fidelityPoints.spendPoints(150);
    }

    //2.3 
    function test_AddPoints_RevertWhen_NotAdmin() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                FidelityPoints.NotAdmin.selector,
                user
            )
        );

        vm.prank(user);
        fidelityPoints.addPoints(user, 100);
    }
}
