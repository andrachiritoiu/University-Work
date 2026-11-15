// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Receiver, OnlyFallback, NoReceive, CountingReceiver, Sender} from "../src/EtherReceiver.sol";

contract EtherReceiverTest is Test {

    Receiver r;
    Sender sender;
    address alice = makeAddr("alice");

    function setUp() public {
        r = new Receiver();
        sender = new Sender{value: 10 ether}();
        vm.deal(alice, 10 ether);
    }

    function test_EmptyCalldataGoesToReceive() public {
        vm.expectEmit(address(r));
        emit Receiver.ViaReceive(alice, 1 ether);
        vm.prank(alice);
        (bool ok,) = address(r).call{value: 1 ether}("");
        assertTrue(ok);
        assertEq(r.getBalance(), 1 ether);
    }

    function test_UnknownSelectorGoesToFallback() public {
        bytes memory data = abi.encodeWithSignature("doesNotExist()");
        vm.expectEmit(address(r));
        emit Receiver.ViaFallback(alice, 1 ether, data);
        vm.prank(alice);
        (bool ok,) = address(r).call{value: 1 ether}(data);
        assertTrue(ok);
    }

    function test_PayableFunction() public {
        vm.expectEmit(address(r));
        emit Receiver.ViaDeposit(alice, 2 ether);
        vm.prank(alice);
        r.deposit{value: 2 ether}();
        assertEq(address(r).balance, 2 ether);
    }

    function test_NonPayableFunctionRejectsEther() public {
        vm.prank(alice);
        (bool ok,) = address(r).call{value: 1 ether}(abi.encodeWithSignature("ping()"));
        assertFalse(ok);
        assertEq(address(r).balance, 0);
    }

    function test_OnlyFallbackReceivesPlainTransfers() public {
        OnlyFallback f = new OnlyFallback();
        (bool ok,) = address(f).call{value: 1 ether}("");
        assertTrue(ok);
        assertEq(f.fallbackCalls(), 1);
    }

    function test_NoReceiveRejectsEther() public {
        NoReceive n = new NoReceive();
        (bool ok,) = address(n).call{value: 1 ether}("");
        assertFalse(ok);
    }

    function test_TransferToSimpleReceiver() public {
        sender.viaTransfer(payable(address(r)), 1 ether); // the event fits in 2300 gas
        assertEq(address(r).balance, 1 ether);
    }

    function test_TransferFailsWhenReceiveWritesStorage() public {
        CountingReceiver c = new CountingReceiver();
        vm.expectRevert();
        sender.viaTransfer(payable(address(c)), 1 ether);

        assertFalse(sender.viaSend(payable(address(c)), 1 ether));
        assertTrue(sender.viaCall(address(c), 1 ether));
        assertEq(c.totalReceived(), 1 ether);
    }
}
