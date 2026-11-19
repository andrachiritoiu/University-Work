// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

import {Script, console} from "forge-std/Script.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {FidelityPoints} from "../src/FidelityPoints.sol";

/// Deploys FidelityPoints and exports the ABI and the address to the
/// frontend (../src/contracts).
///
/// Local network (anvil), from the contracts/ directory:
///   forge script script/DeployFidelityPoints.s.sol --rpc-url localhost --broadcast \
///     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
///
/// Custom value of a point:
///   POINT_VALUE=10 forge script ...
contract DeployFidelityPoints is Script {
    string internal constant FRONTEND_DIR = "../src/contracts/";

    function run() external returns (FidelityPoints fp) {
        uint256 pointValue = vm.envOr("POINT_VALUE", uint256(10));

        vm.startBroadcast();
        (, address deployer,) = vm.readCallers();
        fp = new FidelityPoints(pointValue);
        vm.stopBroadcast();

        console.log("Admin (deployer):", deployer);
        console.log("FidelityPoints deployed to:", address(fp));
        console.log("Point value:", pointValue);

        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            _exportToFrontend(fp, deployer, pointValue);
        } else {
            console.log("Dry run: frontend files not updated (add --broadcast).");
        }
    }

    /// Writes ../src/contracts/addresses.json and ../src/contracts/FidelityPoints.json,
    /// the two files imported by src/utils/EthersUtils.js.
    function _exportToFrontend(FidelityPoints fp, address deployer, uint256 pointValue) internal {
        string memory obj = "deployment";
        vm.serializeAddress(obj, "fidelityPoints", address(fp));
        vm.serializeAddress(obj, "admin", deployer);
        vm.serializeUint(obj, "pointValue", pointValue);
        vm.serializeUint(obj, "chainId", block.chainid);
        string memory json = vm.serializeUint(obj, "fromBlock", block.number);

        vm.writeJson(json, string.concat(FRONTEND_DIR, "addresses.json"));
        vm.writeFile(
            string.concat(FRONTEND_DIR, "FidelityPoints.json"),
            vm.readFile("out/FidelityPoints.sol/FidelityPoints.json")
        );

        console.log("ABI and address exported to", FRONTEND_DIR);
    }
}
