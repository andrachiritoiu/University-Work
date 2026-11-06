// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LoyaltyBadge} from "../src/LoyaltyBadge.sol";

/// @dev A contract that does NOT implement IERC721Receiver.
contract NotAReceiver {}

/// @dev A contract that accepts ERC-721 tokens.
contract GoodReceiver is IERC721Receiver {
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}

contract LoyaltyBadgeTest is Test {
    LoyaltyBadge internal badge;

    address internal admin = makeAddr("admin");
    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    string internal constant GOLD = "ipfs://bafy-example/gold.json";

    function setUp() public {
        badge = new LoyaltyBadge(admin);
    }

    function _mintToAlice() internal returns (uint256 id) {
        vm.prank(admin);
        id = badge.safeMint(alice, GOLD);
    }

    // ---------------------------------------------------------------- metadata

    function test_Metadata() public view {
        assertEq(badge.name(), "Loyalty Badge");
        assertEq(badge.symbol(), "BADGE");
        assertEq(badge.owner(), admin);
    }

    function test_SupportsInterfaces() public view {
        assertTrue(badge.supportsInterface(0x80ac58cd)); // ERC-721
        assertTrue(badge.supportsInterface(0x5b5e139f)); // ERC-721 Metadata
        assertTrue(badge.supportsInterface(0x01ffc9a7)); // ERC-165
        assertFalse(badge.supportsInterface(0x36372b07)); // ERC-20 is not supported
    }

    // ---------------------------------------------------------------- minting

    function test_SafeMint() public {
        uint256 id = _mintToAlice();
        assertEq(id, 0);
        assertEq(badge.ownerOf(0), alice);
        assertEq(badge.balanceOf(alice), 1);
        assertEq(badge.tokenURI(0), GOLD);
        assertEq(badge.nextTokenId(), 1);
    }

    function test_SafeMint_IdsAreSequential() public {
        vm.startPrank(admin);
        assertEq(badge.safeMint(alice, "a"), 0);
        assertEq(badge.safeMint(bob, "b"), 1);
        assertEq(badge.safeMint(alice, "c"), 2);
        vm.stopPrank();
        assertEq(badge.balanceOf(alice), 2);
    }

    function test_RevertWhen_NonOwnerMints() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        badge.safeMint(alice, GOLD);
    }

    function test_RevertWhen_MintToNonReceiverContract() public {
        NotAReceiver nr = new NotAReceiver();
        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721InvalidReceiver.selector, address(nr)));
        badge.safeMint(address(nr), GOLD);
    }

    function test_SafeMint_ToReceiverContract() public {
        GoodReceiver gr = new GoodReceiver();
        vm.prank(admin);
        badge.safeMint(address(gr), GOLD);
        assertEq(badge.ownerOf(0), address(gr));
    }

    // ---------------------------------------------------------------- queries

    function test_RevertWhen_QueryNonexistentToken() public {
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 42));
        badge.ownerOf(42);
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 42));
        badge.tokenURI(42);
    }

    // ---------------------------------------------------------------- transfers

    function test_TransferFrom_ByOwner() public {
        uint256 id = _mintToAlice();

        vm.expectEmit(true, true, true, false, address(badge));
        emit IERC721.Transfer(alice, bob, id);

        vm.prank(alice);
        badge.transferFrom(alice, bob, id);

        assertEq(badge.ownerOf(id), bob);
        assertEq(badge.balanceOf(alice), 0);
        assertEq(badge.balanceOf(bob), 1);
    }

    function test_RevertWhen_TransferWithoutApproval() public {
        uint256 id = _mintToAlice();
        vm.prank(bob);
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721InsufficientApproval.selector, bob, id));
        badge.transferFrom(alice, bob, id);
    }

    function test_Approve_SingleToken() public {
        uint256 id = _mintToAlice();
        vm.prank(alice);
        badge.approve(bob, id);
        assertEq(badge.getApproved(id), bob);

        vm.prank(bob);
        badge.transferFrom(alice, bob, id);
        assertEq(badge.ownerOf(id), bob);
        assertEq(badge.getApproved(id), address(0)); // the approval is cleared on transfer
    }

    function test_SetApprovalForAll_Operator() public {
        _mintToAlice();
        vm.prank(admin);
        badge.safeMint(alice, "second");

        vm.prank(alice);
        badge.setApprovalForAll(bob, true);
        assertTrue(badge.isApprovedForAll(alice, bob));

        vm.startPrank(bob);
        badge.transferFrom(alice, bob, 0);
        badge.transferFrom(alice, bob, 1);
        vm.stopPrank();
        assertEq(badge.balanceOf(bob), 2);
    }

    function test_RevertWhen_SafeTransferToNonReceiverContract() public {
        uint256 id = _mintToAlice();
        NotAReceiver nr = new NotAReceiver();
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721InvalidReceiver.selector, address(nr)));
        badge.safeTransferFrom(alice, address(nr), id);
    }

    function test_TransferFrom_ToNonReceiverContractSucceeds() public {
        // transferFrom performs no receiver check: the token may be locked forever.
        uint256 id = _mintToAlice();
        NotAReceiver nr = new NotAReceiver();
        vm.prank(alice);
        badge.transferFrom(alice, address(nr), id);
        assertEq(badge.ownerOf(id), address(nr));
    }
}
