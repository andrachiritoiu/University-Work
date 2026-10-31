
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

import {Test} from "forge-std/Test.sol";
import {Catalog} from "../src/Catalog.sol";

contract CatalogTest is Test {
    Catalog public catalog;

    function setUp() public {
        catalog = new Catalog();
    }

    function test_DiscountedPrice() public {
        uint result = catalog.discountedPrice(200, 25);

        assertEq(result, 150);
    }

    function test_DiscountedPrice_NoDiscount() public {
        uint result = catalog.discountedPrice(200, 0);

        assertEq(result, 200);
    }

    function test_DiscountedPrice_FullDiscount() public {
        uint result = catalog.discountedPrice(200, 100);

        assertEq(result, 0);
    }

    function test_DiscountedPrice_InvalidPercent() public {
        vm.expectRevert(
            abi.encodeWithSignature("Error(string)", "Invalid percent")
        );

        catalog.discountedPrice(200, 120);
    }

    //6.1
    function test_GasDecreaseStock_FirstAndLastOf100() public {
        for (uint i = 1; i <= 100; i++) {
            catalog.addProduct(bytes32(i), "Product", 10, 1);
        }

        vm.startSnapshotGas("decreaseStock-first");
        catalog.decreaseStock(bytes32(uint256(1)), 1);
        uint firstGas = vm.stopSnapshotGas();
        emit log_named_uint("decreaseStock first product gas", firstGas);

        vm.startSnapshotGas("decreaseStock-last");
        catalog.decreaseStock(bytes32(uint256(100)), 1);
        uint lastGas = vm.stopSnapshotGas();
        emit log_named_uint("decreaseStock last product gas", lastGas);
    }

    //6.2
    function test_GasAddProductWithIndex() public {
        vm.startSnapshotGas("addProduct");
        catalog.addProduct("P001", "Product", 10, 1);
        uint gasUsed = vm.stopSnapshotGas();

        emit log_named_uint("addProduct with index gas", gasUsed);
    }

    function test_DuplicateProductReverts() public {
        catalog.addProduct("P001", "Product", 10, 1);

        vm.expectRevert(
            abi.encodeWithSelector(
                Catalog.ProductAlreadyExists.selector,
                bytes32("P001")
            )
        );
        catalog.addProduct("P001", "Duplicate", 20, 2);
    }

    //6.3
    function test_RemoveProductUsesSwapAndPop() public {
        catalog.addProduct("P001", "First", 10, 1);
        catalog.addProduct("P002", "Last", 20, 2);
        catalog.startProductPromo("P001", 7, 10);

        catalog.removeProduct("P001");

        (bytes32 movedCode,,,) = catalog.products(0);
        (,, uint40 promoStart,) = catalog.productPromos("P001");

        assertEq(movedCode, bytes32("P002"));
        assertEq(catalog.productIndex("P002"), 1);
        assertEq(catalog.productIndex("P001"), 0);
        assertEq(promoStart, 0);
    }

    //6.4
    function test_GetProductsPaged() public {
        for (uint i = 1; i <= 100; i++) {
            catalog.addProduct(bytes32(i), "Product", 10, 1);
        }

        Catalog.Product[] memory page = catalog.getProducts(10, 5);

        assertEq(page.length, 5);
        assertEq(page[0].code, bytes32(uint256(11)));
        assertEq(page[4].code, bytes32(uint256(15)));
    }

    function test_GasGetProductsWith100Products() public {
        for (uint i = 1; i <= 100; i++) {
            catalog.addProduct(bytes32(i), "Product", 10, 1);
        }

        vm.startSnapshotGas("getProducts-100");
        Catalog.Product[] memory result = catalog.getProducts(false, false);
        uint gasUsed = vm.stopSnapshotGas();

        emit log_named_uint("getProducts with 100 products gas", gasUsed);
        assertEq(result.length, 100);
    }
}
