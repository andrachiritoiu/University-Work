// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

import "forge-std/Test.sol";

contract HistoryGasDemo {
    struct Redemption {
        address client;
        bytes32 code;
        uint quantity;
        uint points;
    }

    Redemption[] public redemptions;

    event PointsRedeemed(
        address indexed client,
        bytes32 indexed code,
        uint quantity,
        uint pointsSpent
    );

    function saveToStorage() external {
        redemptions.push(
            Redemption(msg.sender, "HIST25", 1, 6)
        );
    }

    function saveAsEvent() external {
        emit PointsRedeemed(msg.sender, "HIST25", 1, 6);
    }
}

contract HistoryGasTest is Test {
    HistoryGasDemo history;

    function setUp() public {
        history = new HistoryGasDemo();
    }

    function test_Storage() public {
        history.saveToStorage();
    }

    function test_Event() public {
        history.saveAsEvent();
    }
}