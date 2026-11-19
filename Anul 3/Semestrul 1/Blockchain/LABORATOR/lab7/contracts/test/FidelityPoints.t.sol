// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

import {Test} from "forge-std/Test.sol";
import {FidelityPoints} from "../src/FidelityPoints.sol";

contract FidelityPointsTest is Test {
    FidelityPoints internal fp;

    address internal admin = address(this);
    address internal client = makeAddr("client");

    function setUp() public {
        fp = new FidelityPoints(10);
    }

    function test_AddPointsUpdatesBalanceAndEmitsEvent() public {
        vm.expectEmit(true, false, false, true, address(fp));
        emit FidelityPoints.PointsAdded(client, 100);
        fp.addPoints(client, 100);

        assertEq(fp.points(client), 100);
        assertEq(fp.getTotalPoints(), 100);
    }

    function test_AddPointsRevertsForNonAdmin() public {
        vm.prank(client);
        vm.expectRevert(abi.encodeWithSelector(FidelityPoints.NotAdmin.selector, client));
        fp.addPoints(client, 100);
    }

    function test_SpendPointsEmitsEvent() public {
        fp.addPoints(client, 100);

        vm.expectEmit(true, false, false, true, address(fp));
        emit FidelityPoints.PointsSpent(client, 30);
        vm.prank(client);
        fp.spendPoints(30);

        assertEq(fp.points(client), 70);
        assertEq(fp.getTotalPoints(), 70);
    }

    function test_SetPointValueEmitsEvent() public {
        vm.expectEmit(false, false, false, true, address(fp));
        emit FidelityPoints.PointValueChanged(10, 20);
        fp.setPointValue(20);

        assertEq(fp.pointValue(), 20);
        assertEq(fp.admin(), admin);
    }
}
