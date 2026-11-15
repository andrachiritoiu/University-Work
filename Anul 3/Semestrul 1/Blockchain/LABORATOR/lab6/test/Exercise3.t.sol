// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {SecureAuction, VulnerableAuction} from "../src/Auction.sol";
import {
    LegacyAuction,
    ReentrantAttacker,
    PrizeAttacker,
    CrossFunctionAttacker,
    StorageGuardAuction
} from "../src/Exercise3.sol";

contract Exercise3Test is Test {
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        vm.deal(alice, 20 ether);
        vm.deal(bob, 20 ether);
        vm.deal(address(this), 20 ether);
    }

    // 3.1: Cu Bob la 2.5 ether, atacatorul poate lua 8 ether fara revert
    function test_ReentrantWithdrawWithBobAtTwoPointFive() public {
        LegacyAuction auction = new LegacyAuction();
        ReentrantAttacker attacker = new ReentrantAttacker(address(auction));

        vm.prank(alice);
        auction.placeBid{value: 5 ether}();
        vm.prank(bob);
        auction.placeBid{value: 2.5 ether}();
        attacker.bid{value: 1 ether}();
        auction.endAuction();

        attacker.attack();
        assertEq(address(attacker).balance, 8 ether);
        assertEq(address(auction).balance, 0.5 ether);
    }

    // 3.2: VulnerableAuction permite doua claim-uri, SecureAuction doar unul
    function test_PrizeAttacker() public {
        VulnerableAuction vulnerable = new VulnerableAuction();
        PrizeAttacker attacker = new PrizeAttacker(address(vulnerable), false);

        vm.prank(alice);
        vulnerable.placeBid{value: 5 ether}();
        vm.prank(bob);
        vulnerable.placeBid{value: 1 ether}();
        attacker.bid{value: 6 ether}();
        vulnerable.endAuction();
        attacker.attack();

        assertEq(address(attacker).balance, 12 ether);

        SecureAuction secure = new SecureAuction();
        PrizeAttacker secureAttacker = new PrizeAttacker(address(secure), true);
        vm.prank(alice);
        secure.placeBid{value: 5 ether}();
        secureAttacker.bid{value: 6 ether}();
        secure.endAuction();
        secureAttacker.attack();

        assertEq(address(secureAttacker).balance, 6 ether);
    }

    // 3.3: Acelasi modifier blocheaza re-intrarea cross-function
    function test_NonReentrantBlocksClaimPrizeFromWithdraw() public {
        VulnerableAuction auction = new VulnerableAuction();
        CrossFunctionAttacker attacker = new CrossFunctionAttacker(address(auction));

        vm.prank(alice);
        auction.placeBid{value: 2 ether}();
        attacker.bid{value: 1 ether}();
        auction.endAuction();
        attacker.attack();

        assertTrue(attacker.reentryFailed());
        assertEq(address(attacker).balance, 1 ether);
    }

    // 3.3: Aceste teste apar separat in forge test --gas-report
    function test_GasTransientWithdraw() public {
        VulnerableAuction auction = new VulnerableAuction();
        vm.prank(alice);
        auction.placeBid{value: 1 ether}();
        vm.prank(bob);
        auction.placeBid{value: 2 ether}();
        auction.endAuction();
        vm.prank(alice);
        auction.withdraw();
    }

    function test_GasStorageWithdraw() public {
        StorageGuardAuction auction = new StorageGuardAuction();
        vm.prank(alice);
        auction.deposit{value: 1 ether}();
        vm.prank(alice);
        auction.withdraw();
    }
}
