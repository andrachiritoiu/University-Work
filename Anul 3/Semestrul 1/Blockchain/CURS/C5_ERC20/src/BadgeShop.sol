// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {FidelityToken} from "./FidelityToken.sol";
import {LoyaltyBadge} from "./LoyaltyBadge.sol";

/// @title BadgeShop
/// @notice Clients redeem FPT for a LoyaltyBadge. The shop must own the LoyaltyBadge
///         contract to mint, and must be approved by the client to pull the FPT.
contract BadgeShop is Ownable {
    FidelityToken public immutable token;
    LoyaltyBadge public immutable badge;

    /// @notice Price of one badge, in the smallest unit of FPT.
    uint256 public price;

    event BadgeRedeemed(address indexed client, uint256 indexed tokenId, uint256 price);
    event PriceChanged(uint256 oldPrice, uint256 newPrice);

    constructor(FidelityToken token_, LoyaltyBadge badge_, uint256 price_) Ownable(msg.sender) {
        token = token_;
        badge = badge_;
        price = price_;
    }

    function setPrice(uint256 newPrice) external onlyOwner {
        emit PriceChanged(price, newPrice);
        price = newPrice;
    }

    /// @notice Burns `price` FPT from the caller and mints a badge with metadata `uri`.
    /// @dev Requires a prior `token.approve(address(this), price)` by the caller:
    ///      `burnFrom` spends the allowance, exactly like `transferFrom`.
    function redeem(string calldata uri) external returns (uint256 tokenId) {
        token.burnFrom(msg.sender, price);
        tokenId = badge.safeMint(msg.sender, uri);
        emit BadgeRedeemed(msg.sender, tokenId, price);
    }
}
