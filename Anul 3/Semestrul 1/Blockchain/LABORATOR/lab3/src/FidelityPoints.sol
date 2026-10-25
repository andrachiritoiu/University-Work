// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

/// @title FidelityPoints (starter version)
contract FidelityPoints {

    address public admin;                    // slot 0
    uint public pointValue;                  // slot 1
    uint totalPoints;                        // slot 2

    mapping(address => uint) public points;  // slot 3

    error NotAdmin(address caller);

    modifier onlyAdmin(){
        // require(msg.sender == admin, "Only admin");

         if (msg.sender != admin) {
            revert NotAdmin(msg.sender);
        }
        _;
    }

    constructor(uint _pointValue) {
        admin = msg.sender;
        pointValue = _pointValue;
    }

    function addPoints(address client, uint _points) public onlyAdmin{
        points[client] += _points;

        _updateTotalPoints(_points, true);
    }

    function setPointValue(uint _pointValue) public onlyAdmin{
        // require(msg.sender == admin, "Only admin");
        pointValue = _pointValue;
    }

    function getTotalValue(address client) public view returns (uint totalValue) {
        totalValue = points[client] * pointValue;
    }

    //ex1
    function spendPoints(uint _points) external {
        points[msg.sender] -= _points;

        _updateTotalPoints(_points, false);
    }

    function _updateTotalPoints(uint amount, bool increase) internal {
        if (increase) {
            totalPoints += amount;
        } else {
            totalPoints -= amount;
        }
    }

    function getTotalPoints() public view returns (uint) {
        return totalPoints;
    }
}
