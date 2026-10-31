// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

import "forge-std/Test.sol";
import "../src/FidelityPoints.sol";
import "../src/Catalog.sol";

contract RedeemTest is Test {

    FidelityPoints fp;
    Catalog cat;

    address client = address(0x1234);

    function setUp() public {
        cat = new Catalog();
        fp = new FidelityPoints(10);

        fp.setCatalog(address(cat));
        cat.setFidelityProgram(address(fp));

        cat.addProduct("P001", "Coffee mug", 55, 3);
        fp.addPoints(client, 100);
    }

    //4.1 testam cumpararea si evenimentul PointsRedeemed
    function test_RedeemSuccessAndEvent() public {
        vm.expectEmit(true, true, false, true, address(fp));

        emit FidelityPoints.PointsRedeemed(
            client,
            "P001",
            1,
            6
        );

        vm.prank(client);

        bool success = fp.redeem("P001", 1);

        assertTrue(success);

        assertEq(fp.points(client), 94);
        assertEq(fp.getTotalPoints(), 94);

        (,,, uint64 stock) = cat.products(0);
        assertEq(stock, 2);
    }

    //4.2 testarea rotunjirii punctelor si promotiilor
    function test_RedeemRoundsUp() public {
        vm.prank(client);

        bool success = fp.redeem("P001", 1);

        assertTrue(success);

        // 55 / 10 = 5.5, rotunjit in sus = 6
        assertEq(fp.points(client), 94);
        assertEq(fp.getTotalPoints(), 94);
    }

    function test_PromotionReducesPoints() public {
        cat.startProductPromo("P001", 7, 20);

        assertTrue(cat.isProductPromoActive("P001"));

        assertEq(cat.getPrice("P001"), 44);

        vm.prank(client);

        bool success = fp.redeem("P001", 1);

        assertTrue(success);

        // 44 / 10 rotunjit in sus = 5 puncte
        assertEq(fp.points(client), 95);
        assertEq(fp.getTotalPoints(), 95);

        // stocul scade de la 3 la 2
        (,,, uint64 stock) = cat.products(0);
        assertEq(stock, 2);
    }


    //4.3 testarea erorii InsufficientPoints
    function test_RedeemInsufficientPoints() public {
        vm.startPrank(client);

        fp.spendPoints(95);

        vm.expectRevert(
            abi.encodeWithSelector(
                FidelityPoints.InsufficientPoints.selector,
                6,
                5
            )
        );

        fp.redeem("P001", 1);

        vm.stopPrank();

        assertEq(fp.points(client), 5);
        assertEq(fp.getTotalPoints(), 5);

        (,,, uint64 stock) = cat.products(0);
        assertEq(stock, 3);
    }

    //4.4 testam ca un client nu poate modifica direct stocul
    function test_ClientCannotDecreaseStock() public {
        vm.prank(client);

        vm.expectRevert(bytes("Not authorized"));

        cat.decreaseStock("P001", 1);

        (,,, uint64 stock) = cat.products(0);
        assertEq(stock, 3);
    }

    //4.5 testarea cumpararii unei cantitati mai mari decat stocul
    function test_RedeemExceedsStock() public {
        vm.prank(client);
        bool success = fp.redeem("P001", 4);

        assertFalse(success);

        assertEq(fp.points(client), 100);
        assertEq(fp.getTotalPoints(), 100);

        (,,, uint64 stock) = cat.products(0);
        assertEq(stock, 3);

        assertEq(fp.nbCallsPanic(), 1);
    }

    //4.6 testarea functiilor cand contractul este suspendat
    function test_PausedBlocksOperations() public {
        fp.pause();

        assertTrue(fp.paused());

        vm.expectRevert(FidelityPoints.ContractPaused.selector);
        fp.addPoints(client, 10);

        vm.startPrank(client);

        vm.expectRevert(FidelityPoints.ContractPaused.selector);
        fp.spendPoints(10);

        vm.expectRevert(FidelityPoints.ContractPaused.selector);
        fp.redeem("P001", 1);

        vm.stopPrank();

        assertEq(fp.points(client), 100);
        assertEq(fp.getTotalPoints(), 100);

        (,,, uint64 stock) = cat.products(0);
        assertEq(stock, 3);
    }
    
    //5.4
    function test_PriceTooLarge() public {
        uint tooLarge = uint256(type(uint128).max) + 1;

        vm.expectRevert(
            abi.encodeWithSelector(
                Catalog.PriceTooLarge.selector,
                tooLarge
            )
        );

        cat.addProduct("P002", "Expensive", tooLarge, 10);
    }

    function test_StockTooLarge() public {
        uint tooLarge = uint256(type(uint64).max) + 1;

        vm.expectRevert(
            abi.encodeWithSelector(
                Catalog.StockTooLarge.selector,
                tooLarge
            )
        );

        cat.addProduct("P003", "Test", 50, tooLarge);
    }

    function test_IncreaseStockOverflow() public {
        uint tooLarge = uint256(type(uint64).max);

        vm.expectRevert(
            abi.encodeWithSelector(
                Catalog.StockTooLarge.selector,
                tooLarge
            )
        );

        cat.increaseStock("P001", tooLarge);
    }

    function test_GetProductsWithoutStock() public {
        cat.decreaseStock("P001", 3);

        Catalog.Product[] memory available =
            cat.getProducts(true, false);

        assertEq(available.length, 0);

        Catalog.Product[] memory allProducts =
            cat.getProducts(false, false);

        assertEq(allProducts.length, 1);
        assertEq(allProducts[0].stock, 0);
    }

    function test_GasDecreaseStock() public {
        vm.startSnapshotGas("decreaseStock");

        cat.decreaseStock("P001", 1);

        uint gasUsed = vm.stopSnapshotGas();

        emit log_named_uint("decreaseStock gas", gasUsed);
    }

    function test_GasGetProducts() public {
        vm.startSnapshotGas("getProducts");

        Catalog.Product[] memory result =
            cat.getProducts(false, false);

        uint gasUsed = vm.stopSnapshotGas();

        emit log_named_uint("getProducts gas", gasUsed);

        assertEq(result.length, 1);
    }
 } 