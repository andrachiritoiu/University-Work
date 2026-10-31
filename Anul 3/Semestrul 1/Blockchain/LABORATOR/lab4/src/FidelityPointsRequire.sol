// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

contract FidelityPointsRequire {
    address public immutable admin;
    mapping(address => uint) public points;
    uint public totalPoints;

    constructor() {
        admin = msg.sender;
    }

    function addPoints(address client, uint amount) external {
        require(msg.sender == admin, "Only admin");
        require(amount > 0, "Invalid amount");

        points[client] += amount;
        totalPoints += amount;
    }

    function spendPoints(uint amount) external {
        require(amount > 0, "Invalid amount");
        uint available = points[msg.sender];
        require(available >= amount, "Insufficient points");

        unchecked {
            points[msg.sender] = available - amount;
            totalPoints -= amount;
        }
    }
}
