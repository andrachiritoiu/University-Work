// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FidelityToken (FPT)
/// @notice Fungible fidelity points as an ERC-20 token. Unlike the `points` mapping
///         of Laboratory 2, the points can be transferred between clients and are
///         recognised by any wallet or application that supports ERC-20.
contract FidelityToken is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    /// @param initialOwner the account allowed to mint new points (the shop administrator)
    /// @param cap_         the maximum total supply, in the smallest unit (10^-18 FPT)
    constructor(address initialOwner, uint256 cap_)
        ERC20("Fidelity Points", "FPT")
        ERC20Capped(cap_)
        Ownable(initialOwner)
    {}

    /// @notice Awards `amount` points to `to`. Only the owner may mint.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @dev Both ERC20 and ERC20Capped define `_update`; Solidity requires the
    ///      contract to state explicitly which implementations it overrides.
    ///      `super._update` runs the chain ERC20Capped -> ERC20 (C3 linearisation).
    ///      It is `virtual` so that derived contracts (Exercise 2) can override it again.
    function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
