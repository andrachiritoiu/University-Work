// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Receiver, OnlyFallback, NoReceive} from "../src/EtherReceiver.sol";
import {
    ReceiverWithoutReceive,
    ReceiverNonPayableFallback,
    Echo,
    ForceSend
} from "../src/Exercise1.sol";

contract Exercise1Test is Test {
    Receiver receiver;
    OnlyFallback onlyFallback;
    NoReceive noReceive;
    ReceiverWithoutReceive withoutReceive;
    ReceiverNonPayableFallback nonPayableFallback;

    function setUp() public {
        receiver = new Receiver();
        onlyFallback = new OnlyFallback();
        noReceive = new NoReceive();
        withoutReceive = new ReceiverWithoutReceive();
        nonPayableFallback = new ReceiverNonPayableFallback();

        vm.deal(address(this), 20 ether);
    }

    function checkCall(
        address target,
        bytes memory data,
        uint256 amount,
        bool shouldSucceed
    ) internal {
        (bool success,) = target.call{value: amount}(data);
        assertEq(success, shouldSucceed);
    }

    // 1.1: Receiver: receive pentru calldata gol, fallback pentru selector necunoscut
    function test_Receiver() public {
        vm.expectEmit(address(receiver));
        emit Receiver.ViaReceive(address(this), 0);
        checkCall(address(receiver), "", 0, true);

        vm.expectEmit(address(receiver));
        emit Receiver.ViaReceive(address(this), 1 ether);
        checkCall(address(receiver), "", 1 ether, true);

        bytes memory unknown = hex"12345678";
        vm.expectEmit(address(receiver));
        emit Receiver.ViaFallback(address(this), 0, unknown);
        checkCall(address(receiver), unknown, 0, true);

        vm.expectEmit(address(receiver));
        emit Receiver.ViaFallback(address(this), 1 ether, unknown);
        checkCall(address(receiver), unknown, 1 ether, true);
    }

    // 1.1: OnlyFallback: toate cele patru cazuri ajung in fallback payable
    function test_OnlyFallback() public {
        checkCall(address(onlyFallback), "", 0, true);
        checkCall(address(onlyFallback), "", 1 ether, true);
        checkCall(address(onlyFallback), hex"12345678", 0, true);
        checkCall(address(onlyFallback), hex"12345678", 1 ether, true);
        assertEq(onlyFallback.fallbackCalls(), 4);
    }

    // 1.1: Fara receive si fara fallback payable, orice apel de aici reverta
    function test_NoReceive() public {
        checkCall(address(noReceive), "", 0, false);
        checkCall(address(noReceive), "", 1 ether, false);
        checkCall(address(noReceive), hex"12345678", 0, false);
        checkCall(address(noReceive), hex"12345678", 1 ether, false);
    }

    // 1.1: Fara receive, fallback-ul payable preia si calldata gol
    function test_WithoutReceive() public {
        bytes memory empty = hex"";
        bytes memory unknown = hex"12345678";

        vm.expectEmit(address(withoutReceive));
        emit ReceiverWithoutReceive.ViaFallback(address(this), 0, empty);
        checkCall(address(withoutReceive), empty, 0, true);

        vm.expectEmit(address(withoutReceive));
        emit ReceiverWithoutReceive.ViaFallback(address(this), 1 ether, empty);
        checkCall(address(withoutReceive), empty, 1 ether, true);

        vm.expectEmit(address(withoutReceive));
        emit ReceiverWithoutReceive.ViaFallback(address(this), 0, unknown);
        checkCall(address(withoutReceive), unknown, 0, true);

        vm.expectEmit(address(withoutReceive));
        emit ReceiverWithoutReceive.ViaFallback(address(this), 1 ether, unknown);
        checkCall(address(withoutReceive), unknown, 1 ether, true);
    }

    // 1.1: fallback non-payable accepta zero wei, dar reverta la calldata necunoscuta cu ether.
    function test_NonPayableFallback() public {
        bytes memory empty = hex"";
        bytes memory unknown = hex"12345678";

        vm.expectEmit(address(nonPayableFallback));
        emit ReceiverNonPayableFallback.ViaReceive(address(this), 0);
        checkCall(address(nonPayableFallback), empty, 0, true);

        vm.expectEmit(address(nonPayableFallback));
        emit ReceiverNonPayableFallback.ViaReceive(address(this), 1 ether);
        checkCall(address(nonPayableFallback), empty, 1 ether, true);

        vm.expectEmit(address(nonPayableFallback));
        emit ReceiverNonPayableFallback.ViaFallback(address(this), 0, unknown);
        checkCall(address(nonPayableFallback), unknown, 0, true);

        checkCall(address(nonPayableFallback), unknown, 1 ether, false);
    }

    // 1.2: Return-ul fallback-ului este raw: nu contine offset si lungime ABI.
    function test_EchoReturnsInputUnchanged() public {
        Echo echo = new Echo();
        bytes memory input = hex"12345678";
        (bool success, bytes memory output) = address(echo).call(input);

        assertTrue(success);
        assertEq(output, input);
    }

    // 1.3: Etherul poate fi fortat in NoReceive prin selfdestruct.
    function test_ForceSendToNoReceive() public {
        new ForceSend{value: 1 ether}(payable(address(noReceive)));

        assertEq(address(noReceive).balance, 1 ether);
    }
}
