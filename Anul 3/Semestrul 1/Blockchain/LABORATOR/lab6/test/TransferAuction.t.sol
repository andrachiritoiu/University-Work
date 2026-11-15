// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {CountingReceiver} from "../src/EtherReceiver.sol";
import {
    SecureAuction,
    TransferAuction,
    TransferAttacker
} from "../src/Auction.sol";
import {CarelessBank, SafeBank, RejectingClient} from "../src/TransferAuction.sol";

contract Exercise2Test is Test {
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address mallory = makeAddr("mallory");

    function setUp() public {
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(mallory, 10 ether);
        vm.deal(address(this), 20 ether);
    }

    // 2.1: transfer limiteaza fallback-ul la 2300 gas
    function test_TransferAuctionAttackFails() public {
        TransferAuction auction = new TransferAuction();

        vm.prank(alice);
        auction.placeBid{value: 5 ether}();
        vm.prank(bob);
        auction.placeBid{value: 2 ether}();

        vm.prank(mallory);
        TransferAttacker attacker = new TransferAttacker(address(auction));
        vm.prank(mallory);
        attacker.bid{value: 1 ether}();
        auction.endAuction();

        vm.prank(mallory);
        vm.expectRevert(bytes("Attack failed"));
        attacker.attack();

        assertEq(address(auction).balance, 8 ether);
        assertEq(auction.bids(address(attacker)), 1 ether);
    }

    // 2.2: Un recipient contract cu receive care scrie in storage nu poate primi transfer
    function test_TransferAuctionCannotRefundContractBidder() public {
        TransferAuction auction = new TransferAuction();
        CountingReceiver bidder = new CountingReceiver();

        vm.prank(alice);
        auction.placeBid{value: 2 ether}();
        bidder.placeBid{value: 1 ether}(address(auction));
        auction.endAuction();

        vm.expectRevert();
        bidder.withdrawFromAuction(address(auction));
        assertEq(auction.bids(address(bidder)), 1 ether);
        assertEq(address(auction).balance, 3 ether);
    }

    // 2.2: SecureAuction foloseste call si poate restitui bid-ul aceluiasi contract
    function test_SecureAuctionRefundsContractBidder() public {
        SecureAuction auction = new SecureAuction();
        CountingReceiver bidder = new CountingReceiver();

        vm.prank(alice);
        auction.placeBid{value: 2 ether}();
        bidder.placeBid{value: 1 ether}(address(auction));
        auction.endAuction();

        bidder.withdrawFromAuction(address(auction));
        assertEq(bidder.totalReceived(), 1 ether);
        assertEq(auction.bids(address(bidder)), 0);
    }

    // 2.3: send esueaza, dar banca ignora false; soldul contabil dispare, etherul ramane
    function test_CarelessBankLosesTrackOfRejectedEther() public {
        CarelessBank bank = new CarelessBank();
        RejectingClient client = new RejectingClient();

        client.deposit{value: 1 ether}(address(bank));
        client.withdraw(address(bank), 1 ether);

        assertEq(bank.balances(address(client)), 0);
        assertEq(address(bank).balance, 1 ether);
    }

    // 2.3: Daca send este verificat, revert-ul pastreaza soldul si etherul in banca
    function test_SafeBankRevertsAndPreservesBalance() public {
        SafeBank bank = new SafeBank();
        RejectingClient client = new RejectingClient();

        client.deposit{value: 1 ether}(address(bank));
        vm.expectRevert();
        client.withdraw(address(bank), 1 ether);

        assertEq(bank.balances(address(client)), 1 ether);
        assertEq(address(bank).balance, 1 ether);
    }

    // 2.4: Un apel low-level catre o adresa fara cod reuseste    forge test --match-path test/TransferAuction.t.sol -vv
    function test_CallToAddressWithoutCodeSucceeds() public {
        address nobody = makeAddr("nobody");

        (bool success,) = nobody.call{value: 1 ether}("");

        assertTrue(success);
        assertEq(nobody.balance, 1 ether);
    }
}
