// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/// @title FidelityPoints (starter version)
contract FidelityPoints {

    address public admin;                    // slot 0
    uint public pointValue;                  // slot 1

    mapping(address => uint) public points;  // slot 2

    constructor(uint _pointValue) {
        admin = msg.sender;
        pointValue = _pointValue;
    }

    function addPoints(address client, uint _points) public {
        points[client] += _points;
    }

    function setPointValue(uint _pointValue) public {
        pointValue = _pointValue;
    }

    function getTotalValue(address client) public view returns (uint totalValue) {
        totalValue = points[client] * pointValue;
    }
}
