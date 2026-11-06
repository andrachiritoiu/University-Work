// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title LoyaltyBadge (BADGE)
/// @notice Non-fungible loyalty badges as ERC-721 tokens. Every badge has a unique
///         identifier and its own metadata URI (e.g. "Gold member", "Coffee lover").
contract LoyaltyBadge is ERC721, ERC721URIStorage, Ownable {
    /// @notice Identifier of the next badge to be minted (ids start at 0).
    uint256 public nextTokenId;

    constructor(address initialOwner) ERC721("Loyalty Badge", "BADGE") Ownable(initialOwner) {}

    /// @notice Mints a new badge to `to`, with the metadata URI `uri`.
    /// @dev `_safeMint` checks that a contract recipient implements IERC721Receiver.
    function safeMint(address to, string calldata uri) external onlyOwner returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // ---- Overrides required by Solidity (both bases define these functions) ----

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
