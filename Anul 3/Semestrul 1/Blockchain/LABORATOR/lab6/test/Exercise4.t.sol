// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {PushAuction, PullAuction, MaliciousRejecter} from "../src/Exercise4.sol";

contract Exercise4Test is Test {
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        vm.deal(alice, 20 ether);
        vm.deal(bob, 20 ether);
        vm.deal(address(this), 20 ether);
    }

    // 4.1: Bob nu poate outbida un recipient care refuza refundul
    function test_PushAuctionDenialOfService() public {
        PushAuction auction = new PushAuction();
        MaliciousRejecter malicious = new MaliciousRejecter();

        vm.prank(alice);
        auction.placeBid{value: 1 ether}();
        malicious.bid{value: 2 ether}(address(auction));

        vm.expectRevert();
        vm.prank(bob);
        auction.placeBid{value: 3 ether}();

        assertEq(auction.highestBidder(), address(malicious));
        assertEq(auction.highestBid(), 2 ether);
    }

    // 4.2: PullAuction permite urmatoarea oferta chiar daca un bidder refuza etherul
    function test_PullAuctionAllowsOutbidAndIsolatesRejecter() public {
        PullAuction auction = new PullAuction(address(this));
        MaliciousRejecter malicious = new MaliciousRejecter();

        vm.prank(alice);
        auction.placeBid{value: 1 ether}();
        malicious.bid{value: 2 ether}(address(auction));
        vm.prank(bob);
        auction.placeBid{value: 3 ether}();

        assertEq(auction.highestBidder(), bob);
        assertEq(auction.pendingReturns(address(malicious)), 2 ether);

        vm.expectRevert();
        malicious.withdraw(address(auction));
    }

    // 4.3: Dupa claim, soldul ramas este suma refundurilor neplatite
    function test_PullAuctionBalanceInvariant() public {
        PullAuction auction = new PullAuction(alice);
        MaliciousRejecter malicious = new MaliciousRejecter();

        vm.prank(alice);
        auction.placeBid{value: 1 ether}();
        malicious.bid{value: 2 ether}(address(auction));
        vm.prank(bob);
        auction.placeBid{value: 3 ether}();
        auction.endAuction();

        vm.prank(alice);
        auction.withdraw();
        vm.prank(alice);
        auction.claim();

        assertEq(address(auction).balance, auction.pendingReturns(address(malicious)));
        assertEq(address(auction).balance, 2 ether);
    }

    // 4.4: Gasul refundurilor este platit de initiatorul fiecarei tranzactii
    function test_GasPushFiveBidders() public {
        PushAuction auction = new PushAuction();
        for (uint256 i = 1; i <= 5; i++) {
            address bidder = makeAddr(string.concat("push", vm.toString(i)));
            vm.deal(bidder, 10 ether);
            vm.prank(bidder);
            auction.placeBid{value: i * 1 ether}();
        }
    }

    function test_GasPullFiveBidders() public {
        PullAuction auction = new PullAuction(address(this));
        address[5] memory bidders;
        for (uint256 i = 0; i < 5; i++) {
            bidders[i] = makeAddr(string.concat("pull", vm.toString(i)));
            vm.deal(bidders[i], 10 ether);
            vm.prank(bidders[i]);
            auction.placeBid{value: (i + 1) * 1 ether}();
        }
        auction.endAuction();

        for (uint256 i = 0; i < 4; i++) {
            vm.prank(bidders[i]);
            auction.withdraw();
        }
    }
}
