// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

/// FidelityPointsFinal.sol (Laboratory 3) extended with the events of
/// Laboratory 4, Exercise 2.1. The web application subscribes to them.
contract FidelityPoints {

    address public admin;
    uint public pointValue;

    mapping(address => uint) public points;

    uint totalPoints;

    error NotAdmin(address caller);

    event PointsAdded(address indexed client, uint amount);
    event PointsSpent(address indexed client, uint amount);
    event PointValueChanged(uint oldValue, uint newValue);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin(msg.sender);
        _;
    }

    constructor(uint _pointValue) {
        admin = msg.sender;
        pointValue = _pointValue;
    }

    function addPoints(address client, uint _points) public onlyAdmin {
        points[client] += _points;
        updateTotalPoints(_points, true);
        emit PointsAdded(client, _points);
    }

    function spendPoints(uint _points) external {
        points[msg.sender] -= _points;
        updateTotalPoints(_points, false);
        emit PointsSpent(msg.sender, _points);
    }

    function setPointValue(uint _pointValue) public onlyAdmin {
        emit PointValueChanged(pointValue, _pointValue);
        pointValue = _pointValue;
    }

    function getTotalValue(address client) public view returns (uint totalValue) {
        totalValue = points[client] * pointValue;
    }

    function getTotalPoints() external view returns (uint) {
        return totalPoints;
    }

    function updateTotalPoints(uint _points, bool added) internal {
        if (added) {
            totalPoints += _points;
        } else {
            totalPoints -= _points;
        }
    }
}
