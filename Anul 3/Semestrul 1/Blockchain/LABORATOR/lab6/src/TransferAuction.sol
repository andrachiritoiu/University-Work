// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// 2.3: send este folosit fara verificarea rezultatului
contract CarelessBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).send(amount);
    }
}

// 2.3
contract SafeBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        bool success = payable(msg.sender).send(amount);
        require(success, "Transfer failed");
    }
}

contract RejectingClient {
    receive() external payable {
        revert("Rejecting ether");
    }

    function deposit(address bank) external payable {
        (bool success,) = bank.call{value: msg.value}(abi.encodeWithSignature("deposit()"));
        require(success);
    }

    function withdraw(address bank, uint256 amount) external {
        (bool success,) = bank.call(abi.encodeWithSignature("withdraw(uint256)", amount));
        require(success);
    }
}
