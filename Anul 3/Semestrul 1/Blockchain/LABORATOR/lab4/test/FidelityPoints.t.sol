// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

import {Test} from "forge-std/Test.sol";
import {FidelityPoints} from "../src/FidelityPoints.sol";
import {FidelityPointsRequire} from "../src/FidelityPointsRequire.sol";
import {Catalog} from "../src/Catalog.sol";

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

        vm.expectRevert(
            abi.encodeWithSelector(
                FidelityPoints.InsufficientPoints.selector,
                150,
                100
            )
        );
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

    //7.1
    function test_GasAddPointsWithImmutableAdmin() public {
        vm.startSnapshotGas("addPoints-immutable-admin");
        fidelityPoints.addPoints(user, 100);
        uint gasUsed = vm.stopSnapshotGas();

        emit log_named_uint("addPoints with immutable admin gas", gasUsed);
    }

    //7.2
    function test_SpendPointsUsesSingleReadAndUncheckedSubtraction() public {
        fidelityPoints.addPoints(user, 100);

        vm.prank(user);
        fidelityPoints.spendPoints(30);

        assertEq(fidelityPoints.points(user), 70);
        assertEq(fidelityPoints.getTotalPoints(), 70);
    }

    //7.3
    function test_GasBatchPointsCalldataAndMemory() public {
        address[] memory clients = new address[](10);
        uint[] memory amounts = new uint[](10);
        for (uint i = 0; i < 10; i++) {
            clients[i] = address(uint160(i + 1));
            amounts[i] = 10;
        }

        vm.startSnapshotGas("addPointsBatch-calldata");
        fidelityPoints.addPointsBatch(clients, amounts);
        uint calldataGas = vm.stopSnapshotGas();
        emit log_named_uint("addPointsBatch calldata gas", calldataGas);

        vm.startSnapshotGas("addPointsBatch-memory");
        fidelityPoints.addPointsBatchMemory(clients, amounts);
        uint memoryGas = vm.stopSnapshotGas();
        emit log_named_uint("addPointsBatch memory gas", memoryGas);

        assertEq(fidelityPoints.getTotalPoints(), 200);
    }

    //7.4
    function test_CustomErrorsVsRequire() public {
        FidelityPointsRequire requireVersion = new FidelityPointsRequire();
        uint customSize =
            vm.getDeployedCode("src/FidelityPoints.sol:FidelityPoints").length;
        uint requireSize =
            vm.getDeployedCode("src/FidelityPointsRequire.sol:FidelityPointsRequire").length;

        emit log_named_uint("custom errors runtime bytecode", customSize);
        emit log_named_uint("require runtime bytecode", requireSize);

        fidelityPoints.addPoints(user, 100);
        requireVersion.addPoints(user, 100);

        vm.startSnapshotGas("custom-error-revert");
        vm.prank(user);
        (bool customOk,) = address(fidelityPoints).call(
            abi.encodeCall(FidelityPoints.spendPoints, (150))
        );
        uint customGas = vm.stopSnapshotGas();

        vm.startSnapshotGas("require-revert");
        vm.prank(user);
        (bool requireOk,) = address(requireVersion).call(
            abi.encodeCall(FidelityPointsRequire.spendPoints, (150))
        );
        uint requireGas = vm.stopSnapshotGas();

        assertFalse(customOk);
        assertFalse(requireOk);
        emit log_named_uint("custom error revert gas", customGas);
        emit log_named_uint("require revert gas", requireGas);
    }

    //7.5
    function test_GasRedeemOptimizerComparison() public {
        Catalog catalog = new Catalog();
        catalog.addProduct("P001", "Product", 10, 1);
        catalog.setFidelityProgram(address(fidelityPoints));
        fidelityPoints.setCatalog(address(catalog));
        fidelityPoints.addPoints(user, 100);
        emit log_named_uint(
            "FidelityPoints runtime bytecode",
            vm.getDeployedCode("src/FidelityPoints.sol:FidelityPoints").length
        );

        vm.startSnapshotGas("redeem-optimizer");
        vm.prank(user);
        fidelityPoints.redeem("P001", 1);
        uint gasUsed = vm.stopSnapshotGas();

        emit log_named_uint("redeem optimizer gas", gasUsed);
    }
}
