// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// 4.1: Refundul este trimis in timpul placeBid
contract PushAuction {
    address public highestBidder;
    uint256 public highestBid;

    function placeBid() external payable {
        require(msg.value > highestBid, "Bid not high enough");

        if (highestBidder != address(0)) {
            (bool success,) = highestBidder.call{value: highestBid}("");
            require(success, "Refund failed");
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }
}

// 4.1: Recipient care refuza refundul
contract MaliciousRejecter {
    function bid(address auction) external payable {
        (bool success,) = auction.call{value: msg.value}(abi.encodeWithSignature("placeBid()"));
        require(success);
    }

    function withdraw(address auction) external {
        (bool success,) = auction.call(abi.encodeWithSignature("withdraw()"));
        require(success);
    }

    receive() external payable {
        revert("Rejecting refund");
    }
}

// 4.2: Refundurile sunt pastrate pentru retragere ulterioara
contract PullAuction {
    address public immutable seller;
    address public highestBidder;
    uint256 public highestBid;
    bool public auctionEnded;
    mapping(address => uint256) public pendingReturns;

    constructor(address sellerAddress) {
        seller = sellerAddress;
    }

    function placeBid() external payable {
        require(!auctionEnded, "Auction ended");
        require(msg.value > highestBid, "Bid not high enough");

        if (highestBidder != address(0)) {
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function withdraw() external {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No pending return");
        pendingReturns[msg.sender] = 0;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function endAuction() external {
        require(!auctionEnded, "Auction ended");
        auctionEnded = true;
    }

    function claim() external {
        require(auctionEnded, "Auction not ended");
        require(msg.sender == seller, "Only seller");
        uint256 amount = highestBid;
        require(amount > 0, "Already claimed");
        highestBid = 0;

        (bool success,) = seller.call{value: amount}("");
        require(success, "Claim failed");
    }
}
