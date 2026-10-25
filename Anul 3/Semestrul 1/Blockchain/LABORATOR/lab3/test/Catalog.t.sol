
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
}
