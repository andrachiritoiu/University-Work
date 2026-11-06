// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FeeToken} from "../src/FeeToken.sol";

//ex 2
contract FeeTokenTest is Test {

    FeeToken token;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        token = new FeeToken(address(this), 1000 ether);

        token.mint(alice, 100 ether);
    }

    function test_TransferFee() public {
        vm.prank(alice);
        token.transfer(bob, 20 ether);

        assertEq(token.balanceOf(bob), 19.8 ether);

        assertEq(token.balanceOf(address(this)), 0.2 ether);

        assertEq(token.balanceOf(alice), 80 ether);

        assertEq(token.totalSupply(), 100 ether);
    }

    function testFuzz_TransferPreservesSupply(uint256 amount) public {
        amount = bound(amount, 0, 100 ether);

        vm.prank(alice);
        token.transfer(bob, amount);

        uint256 fee = amount / 100;

        assertEq(token.balanceOf(bob), amount - fee);
        assertEq(token.balanceOf(address(this)), fee);
        assertEq(token.totalSupply(), 100 ether);
    }

    function test_MintAndBurnWithoutFee() public {
        token.mint(bob, 20 ether);

        vm.prank(bob);
        token.burn(5 ether);

        assertEq(token.balanceOf(bob), 15 ether);
        assertEq(token.balanceOf(address(this)), 0);
        assertEq(token.totalSupply(), 115 ether);
    }
}