// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FidelityToken} from "./FidelityToken.sol";

//ex 2
contract FeeToken is FidelityToken {

    constructor(address initialOwner, uint256 cap_)
        FidelityToken(initialOwner, cap_)
    {}

    function _update(address from, address to, uint256 value)
        internal
        override
    {
        // Nu aplicam taxa la mint sau burn
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        // Calculam taxa de 1%
        uint256 fee = value / 100;

        // Trimitem taxa proprietarului
        if (fee > 0) {
            super._update(from, owner(), fee);
        }

        // Trimitem restul destinatarului
        super._update(from, to, value - fee);
    }
}