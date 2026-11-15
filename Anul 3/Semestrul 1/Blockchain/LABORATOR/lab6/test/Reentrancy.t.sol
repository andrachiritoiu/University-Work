// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {VulnerableAuction, SecureAuction, Attacker} from "../src/Auction.sol";

contract ReentrancyTest is Test {
    
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address mallory = makeAddr("mallory");

    function setUp() public {
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(mallory, 10 ether);
    }

    /// alice bids 5, bob bids 2, the attacker contract bids 1; the auction holds 8 ether.
    function _prepare(address auction) internal returns (Attacker attacker) {
        vm.prank(alice);
        VulnerableAuction(auction).placeBid{value: 5 ether}();
        vm.prank(bob);
        VulnerableAuction(auction).placeBid{value: 2 ether}();

        vm.prank(mallory);
        attacker = new Attacker(auction);
        vm.prank(mallory);
        attacker.bid{value: 1 ether}();

        VulnerableAuction(auction).endAuction();
    }

    // 1.4: Cu receive, atacul nu mai re-intra; se recupereaza doar bid-ul propriu.
    function test_AttackerReceiveStopsReentrancy() public {
        VulnerableAuction auction = new VulnerableAuction();
        Attacker attacker = _prepare(address(auction));
        assertEq(address(auction).balance, 8 ether);

        vm.prank(mallory);
        attacker.attack();

        console.log("auction balance :", address(auction).balance);
        console.log("attacker balance:", address(attacker).balance);
        assertEq(address(auction).balance, 7 ether);
        assertEq(address(attacker).balance, 1 ether);
    }

    function test_AttackerReceiveAlsoWorksWithSecureAuction() public {
        SecureAuction auction = new SecureAuction();
        Attacker attacker = _prepare(address(auction));

        vm.prank(mallory);
        attacker.attack();

        assertEq(address(auction).balance, 7 ether);
        assertEq(address(attacker).balance, 1 ether);
    }

    function test_HonestWithdrawFromSecureAuction() public {
        SecureAuction auction = new SecureAuction();
        _prepare(address(auction));

        vm.prank(bob);
        auction.withdraw();
        assertEq(bob.balance, 10 ether);
        assertEq(address(auction).balance, 6 ether);

        vm.prank(bob);
        vm.expectRevert(bytes("No funds to withdraw"));
        auction.withdraw();
    }
}
