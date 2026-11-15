// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/// Shows which function is executed when ether and/or calldata are sent to a contract.
contract Receiver {

    event ViaDeposit(address sender, uint256 value);
    event ViaReceive(address sender, uint256 value);
    event ViaFallback(address sender, uint256 value, bytes data);

    // A payable constructor accepts ether at deployment (forge create --value ...).
    constructor() payable {}

    // A payable function: msg.value is added to the balance of the contract.
    function deposit() external payable {
        emit ViaDeposit(msg.sender, msg.value);
    }

    // A non-payable function: a call with msg.value > 0 reverts.
    function ping() external pure returns (string memory) {
        return "pong";
    }

    // Executed for calls with EMPTY calldata (plain ether transfers).
    receive() external payable {
        emit ViaReceive(msg.sender, msg.value);
    }

    // Executed when no function matches the selector,
    // or when the calldata is empty and there is no receive function.
    fallback() external payable {
        emit ViaFallback(msg.sender, msg.value, msg.data);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

/// Has only a fallback function: it receives plain transfers as well.
contract OnlyFallback {
    uint256 public fallbackCalls;

    fallback() external payable {
        fallbackCalls += 1;
    }
}

/// Has neither receive nor a payable fallback: plain transfers revert.
contract NoReceive {
    function hello() external pure returns (string memory) {
        return "hello";
    }
}

/// A receive function that writes to storage: it needs more than 2300 gas.
contract CountingReceiver {
    uint256 public totalReceived;

    // 2.2: Un contract poate fi bidder
    function placeBid(address auction) external payable {
        (bool success,) = auction.call{value: msg.value}(abi.encodeWithSignature("placeBid()"));
        require(success);
    }

    function withdrawFromAuction(address auction) external {
        (bool success,) = auction.call(abi.encodeWithSignature("withdraw()"));
        require(success);
    }

    receive() external payable {
        totalReceived += msg.value;
    }
}

/// Sends ether with the three mechanisms offered by address.
contract Sender {
    constructor() payable {}

    // Forwards 2300 gas, reverts on failure.
    function viaTransfer(address payable to, uint256 amount) external {
        to.transfer(amount);
    }

    // Forwards 2300 gas, returns false on failure.
    function viaSend(address payable to, uint256 amount) external returns (bool ok) {
        ok = to.send(amount);
    }

    // Forwards all the remaining gas (by default), returns false on failure.
    function viaCall(address to, uint256 amount) external returns (bool ok) {
        (ok,) = to.call{value: amount}("");
    }
}
