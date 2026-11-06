// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FidelityToken} from "./FidelityToken.sol";


//ex 1
contract FidelityPoints {

    address public admin;

    // mapping(address => uint256) public points;
    // uint256 public totalPoints;
    FidelityToken public token;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address tokenAddress) {
        admin = msg.sender;
        token = FidelityToken(tokenAddress);
    }

    function addPoints(address user, uint256 amount)
        external
        onlyAdmin
    {
        token.mint(user, amount);
    }

    function spendPoints(uint256 amount) external {
        token.burnFrom(msg.sender, amount);
    }
}