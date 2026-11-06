// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {FidelityToken} from "../src/FidelityToken.sol";

contract FidelityTokenTest is Test {
    FidelityToken internal fpt;

    address internal admin = makeAddr("admin");
    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    uint256 internal constant CAP = 1_000_000 ether; // 1,000,000 FPT (18 decimals)

    function setUp() public {
        fpt = new FidelityToken(admin, CAP);
        vm.prank(admin);
        fpt.mint(alice, 100 ether);
    }

    // ---------------------------------------------------------------- metadata

    function test_Metadata() public view {
        assertEq(fpt.name(), "Fidelity Points");
        assertEq(fpt.symbol(), "FPT");
        assertEq(fpt.decimals(), 18);
        assertEq(fpt.cap(), CAP);
        assertEq(fpt.owner(), admin);
    }

    // ---------------------------------------------------------------- minting

    function test_Mint_IncreasesBalanceAndSupply() public {
        vm.prank(admin);
        fpt.mint(bob, 25 ether);
        assertEq(fpt.balanceOf(bob), 25 ether);
        assertEq(fpt.totalSupply(), 125 ether);
    }

    function test_Mint_EmitsTransferFromZero() public {
        vm.expectEmit(true, true, false, true, address(fpt));
        emit IERC20.Transfer(address(0), bob, 1 ether);
        vm.prank(admin);
        fpt.mint(bob, 1 ether);
    }

    function test_RevertWhen_NonOwnerMints() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        fpt.mint(alice, 1 ether);
    }

    function test_RevertWhen_MintExceedsCap() public {
        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(ERC20Capped.ERC20ExceededCap.selector, CAP + 100 ether, CAP));
        fpt.mint(bob, CAP);
    }

    // ---------------------------------------------------------------- transfers

    function test_Transfer() public {
        vm.prank(alice);
        bool ok = fpt.transfer(bob, 30 ether);
        assertTrue(ok);
        assertEq(fpt.balanceOf(alice), 70 ether);
        assertEq(fpt.balanceOf(bob), 30 ether);
        assertEq(fpt.totalSupply(), 100 ether); // a transfer does not change the supply
    }

    function test_RevertWhen_TransferExceedsBalance() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientBalance.selector, alice, 100 ether, 101 ether)
        );
        // forge-lint: disable-next-line(erc20-unchecked-transfer)
        fpt.transfer(bob, 101 ether);
    }

    function test_RevertWhen_TransferToZeroAddress() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InvalidReceiver.selector, address(0)));
        // forge-lint: disable-next-line(erc20-unchecked-transfer)
        fpt.transfer(address(0), 1 ether);
    }

    // ---------------------------------------------------------------- allowances

    function test_ApproveAndTransferFrom() public {
        vm.prank(alice);
        fpt.approve(bob, 40 ether);
        assertEq(fpt.allowance(alice, bob), 40 ether);

        vm.prank(bob);
        assertTrue(fpt.transferFrom(alice, bob, 15 ether));

        assertEq(fpt.balanceOf(bob), 15 ether);
        assertEq(fpt.allowance(alice, bob), 25 ether); // the allowance is consumed
    }

    function test_RevertWhen_TransferFromExceedsAllowance() public {
        vm.prank(alice);
        fpt.approve(bob, 10 ether);

        vm.prank(bob);
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, bob, 10 ether, 11 ether)
        );
        // forge-lint: disable-next-line(erc20-unchecked-transfer)
        fpt.transferFrom(alice, bob, 11 ether);
    }

    function test_InfiniteApprovalIsNotConsumed() public {
        vm.prank(alice);
        fpt.approve(bob, type(uint256).max);

        vm.prank(bob);
        assertTrue(fpt.transferFrom(alice, bob, 50 ether));
        assertEq(fpt.allowance(alice, bob), type(uint256).max);
    }

    // ---------------------------------------------------------------- burning

    function test_Burn_DecreasesSupply() public {
        vm.prank(alice);
        fpt.burn(40 ether);
        assertEq(fpt.balanceOf(alice), 60 ether);
        assertEq(fpt.totalSupply(), 60 ether);
    }

    // ---------------------------------------------------------------- fuzzing

    /// @dev Forge calls this function with many random values of `amount`.
    function testFuzz_TransferPreservesSupply(uint256 amount) public {
        amount = bound(amount, 0, 100 ether);
        vm.prank(alice);
        assertTrue(fpt.transfer(bob, amount));
        assertEq(fpt.balanceOf(alice) + fpt.balanceOf(bob), 100 ether);
        assertEq(fpt.totalSupply(), 100 ether);
    }
}
