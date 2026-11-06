// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {FidelityToken} from "../src/FidelityToken.sol";
import {LoyaltyBadge} from "../src/LoyaltyBadge.sol";
import {BadgeShop} from "../src/BadgeShop.sol";

contract BadgeShopTest is Test {
    FidelityToken internal fpt;
    LoyaltyBadge internal badge;
    BadgeShop internal shop;

    address internal alice = makeAddr("alice");
    uint256 internal constant PRICE = 50 ether;

    function setUp() public {
        // The test contract is the admin of all three contracts.
        fpt = new FidelityToken(address(this), 1_000_000 ether);
        badge = new LoyaltyBadge(address(this));
        shop = new BadgeShop(fpt, badge, PRICE);

        // The shop must own the badge contract to be able to mint.
        badge.transferOwnership(address(shop));

        fpt.mint(alice, 120 ether);
    }

    function test_Redeem() public {
        vm.startPrank(alice);
        fpt.approve(address(shop), PRICE);
        uint256 id = shop.redeem("ipfs://bafy-example/silver.json");
        vm.stopPrank();

        assertEq(badge.ownerOf(id), alice);
        assertEq(fpt.balanceOf(alice), 70 ether);
        assertEq(fpt.totalSupply(), 70 ether); // the points were burned
        assertEq(fpt.allowance(alice, address(shop)), 0);
    }

    function test_Redeem_EmitsEvent() public {
        vm.prank(alice);
        fpt.approve(address(shop), PRICE);

        vm.expectEmit(true, true, false, true, address(shop));
        emit BadgeShop.BadgeRedeemed(alice, 0, PRICE);
        vm.prank(alice);
        shop.redeem("x");
    }

    function test_RevertWhen_RedeemWithoutApproval() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, address(shop), 0, PRICE)
        );
        shop.redeem("x");
    }

    function test_RevertWhen_RedeemWithInsufficientBalance() public {
        address poor = makeAddr("poor");
        fpt.mint(poor, 10 ether);
        vm.startPrank(poor);
        fpt.approve(address(shop), PRICE);
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientBalance.selector, poor, 10 ether, PRICE)
        );
        shop.redeem("x");
        vm.stopPrank();
    }

    function test_SetPrice() public {
        shop.setPrice(10 ether);
        assertEq(shop.price(), 10 ether);
    }

    function test_RevertWhen_NonOwnerSetsPrice() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        shop.setPrice(0);
    }

    function test_RevertWhen_AdminMintsBadgeAfterHandover() public {
        // After transferOwnership, the original admin can no longer mint directly.
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, address(this)));
        badge.safeMint(alice, "x");
    }
}
