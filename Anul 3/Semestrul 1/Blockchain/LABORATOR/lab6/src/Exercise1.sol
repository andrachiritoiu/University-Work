// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// 1.1: Receiver fara receive()
contract ReceiverWithoutReceive {
    event ViaFallback(address sender, uint256 value, bytes data);

    fallback() external payable {
        emit ViaFallback(msg.sender, msg.value, msg.data);
    }
}

// 1.1: Receiver cu fallback non-payable
contract ReceiverNonPayableFallback {
    event ViaReceive(address sender, uint256 value);
    event ViaFallback(address sender, uint256 value, bytes data);

    receive() external payable {
        emit ViaReceive(msg.sender, msg.value);
    }

    fallback() external {
        emit ViaFallback(msg.sender, 0, msg.data);
    }
}

// 1.2: Fallback-ul in forma cu calldata returneaza bytes necodificati
contract Echo {
    fallback(bytes calldata input) external returns (bytes memory) {
        return input;
    }
}

// 1.3: selfdestruct poate forta etherul intr-un contract care il respinge
contract ForceSend {
    constructor(address payable target) payable {
        selfdestruct(target);
    }
}
