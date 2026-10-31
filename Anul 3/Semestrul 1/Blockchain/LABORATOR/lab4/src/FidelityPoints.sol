// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

// ex 1.1
interface ICatalog {
    function getPrice(bytes32 code) external view returns (uint);

    function decreaseStock(bytes32 code, uint amount) external;
}

/// @title FidelityPoints (starter version)
contract FidelityPoints {

    address public immutable admin;
    uint public pointValue;                  // slot 1
    uint totalPoints;                        // slot 2

    mapping(address => uint) public points;  // slot 3
    ICatalog public catalog;
    uint public nbCallsError;
    uint public nbCallsPanic;
    uint public nbCallsRevert;

    error NotAdmin(address caller);
    error CatalogNotSet();
    error InvalidQuantity();
    error InsufficientPoints(uint required, uint available);
    error ContractPaused();
    error ContractNotPaused();

    //2.1
    event PointsAdded(address indexed client, uint amount);
    event PointsSpent(address indexed client, uint amount);
    event PointValueChanged(uint oldValue, uint newValue);
    event PointsRedeemed(address indexed client, bytes32 indexed code, uint quantity, uint pointsSpent);
    event RedemptionFailed(address indexed client, bytes32 indexed code, bytes reason);
    error InvalidAmount(uint amount);

    //2.4 - storage
    struct Redemption {
        address client;
        bytes32 code;
        uint quantity;
        uint points;
    }

    Redemption[] public redemptions;

    bool public paused;


    // modifier onlyAdmin(){
    //     // require(msg.sender == admin, "Only admin");

    //      if (msg.sender != admin) {
    //         revert NotAdmin(msg.sender);
    //     }
    //     _;
    // }

    //3.5
    modifier onlyAdmin() {
        _checkAdmin();
        _;
    }

    function _checkAdmin() internal view {
        if (msg.sender != admin) {
            revert NotAdmin(msg.sender);
        }
    }

    //3.1
    modifier whenNotPaused() {
        if (paused) {
            revert ContractPaused();
        }
        _;
    }

    modifier whenPaused() {
        if (!paused) {
            revert ContractNotPaused();
        }
        _;
    }

    //3.2
    modifier validAmount(uint amount) {
        if (amount == 0) {
            revert InvalidAmount(amount);
        }
        _;
    }

    constructor(uint _pointValue) {
        admin = msg.sender;
        pointValue = _pointValue;
    }

    function setCatalog(address catalogAddress) public onlyAdmin {
        catalog = ICatalog(catalogAddress);
    }

    function addPoints(address client, uint _points) public whenNotPaused onlyAdmin validAmount(_points){
        points[client] += _points;

        _updateTotalPoints(_points, true);
        emit PointsAdded(client, _points);
    }

    //7.3
    function addPointsBatch(
        address[] calldata clients,
        uint[] calldata amounts
    ) external whenNotPaused onlyAdmin {
        require(clients.length == amounts.length, "Length mismatch");

        uint batchTotal;
        for (uint i = 0; i < clients.length; i++) {
            if (amounts[i] == 0) {
                revert InvalidAmount(amounts[i]);
            }

            points[clients[i]] += amounts[i];
            batchTotal += amounts[i];
            emit PointsAdded(clients[i], amounts[i]);
        }

        totalPoints += batchTotal;
    }

    function addPointsBatchMemory(
        address[] memory clients,
        uint[] memory amounts
    ) external whenNotPaused onlyAdmin {
        require(clients.length == amounts.length, "Length mismatch");

        uint batchTotal;
        for (uint i = 0; i < clients.length; i++) {
            if (amounts[i] == 0) {
                revert InvalidAmount(amounts[i]);
            }

            points[clients[i]] += amounts[i];
            batchTotal += amounts[i];
            emit PointsAdded(clients[i], amounts[i]);
        }

        totalPoints += batchTotal;
    }

    function setPointValue(uint _pointValue) public onlyAdmin  whenNotPaused{
        // require(msg.sender == admin, "Only admin");
        uint oldValue = pointValue;

        pointValue = _pointValue;

        emit PointValueChanged(oldValue, _pointValue);
    }


    function getTotalValue(address client) public view returns (uint totalValue) {
        totalValue = points[client] * pointValue;
    }


    //3.4
    function spendPoints(uint _points) external whenNotPaused validAmount(_points){
        uint available = points[msg.sender];

        if (available < _points) {
            revert InsufficientPoints(_points, available);
        }

        unchecked {
            points[msg.sender] = available - _points;
            totalPoints -= _points;
        }

        assert(totalPoints >= points[msg.sender]);

        emit PointsSpent(msg.sender, _points);
    }


    function _updateTotalPoints(uint amount, bool increase) internal {
        if (increase) {
            totalPoints += amount;
        } else {
            totalPoints -= amount;
        }
    }


    function getTotalPoints() public view returns (uint) {
        return totalPoints;
    }


    //1.2
    // function redeem(bytes32 code, uint quantity) external {
    //     // verificam catalogul si cantitatea
    //     if (address(catalog) == address(0)) {
    //         revert CatalogNotSet();
    //     }

    //     if (quantity == 0) {
    //         revert InvalidQuantity();
    //     }

    //     //pretul produsului
    //     uint price = catalog.getPrice(code);

    //     uint cost = price * quantity;
    //     uint requiredPoints = (cost + pointValue - 1) / pointValue;

    //     uint available = points[msg.sender];

    //     if (available < requiredPoints) {
    //         revert InsufficientPoints(requiredPoints, available);
    //     }

    //     points[msg.sender] -= requiredPoints;
    //     _updateTotalPoints(requiredPoints, false);

    //     catalog.decreaseStock(code, quantity);
    // }


    //1.6
    function redeem(bytes32 code, uint quantity) external  whenNotPaused validAmount(quantity) returns (bool) {
        if (address(catalog) == address(0)) {
            revert CatalogNotSet();
        }

        if (quantity == 0) {
            revert InvalidQuantity();
        }

        uint price = catalog.getPrice(code);

        //punctele necesare
        uint cost = price * quantity;
        uint requiredPoints = (cost + pointValue - 1) / pointValue;

        uint available = points[msg.sender];

        if (available < requiredPoints) {
            revert InsufficientPoints(requiredPoints, available);
        }

        unchecked {
            points[msg.sender] = available - requiredPoints;
            totalPoints -= requiredPoints;
        }

        assert(totalPoints >= points[msg.sender]);

        try catalog.decreaseStock(code, quantity) {
            //cumpararea a reusit
            redemptions.push(
                Redemption(msg.sender, code, quantity, requiredPoints)
            );

            emit PointsRedeemed(
                msg.sender,
                code,
                quantity,
                requiredPoints
            );

            return true;

        } catch Error(string memory reason) {
            nbCallsError++;

            emit RedemptionFailed(
                msg.sender,
                code,
                abi.encodeWithSignature("Error(string)", reason)
            );

        } catch Panic(uint errorCode) {
            nbCallsPanic++;


            emit RedemptionFailed(
                msg.sender,
                code,
                abi.encodeWithSignature("Panic(uint256)", errorCode)
            );

        } catch (bytes memory lowLevelData) {
            nbCallsRevert++; 

            emit RedemptionFailed(
                msg.sender,
                code,
                lowLevelData
            );
        }

        // daca reducerea stocului a esuat, restauram punctele clientului
        points[msg.sender] = available;
        totalPoints += requiredPoints;

        return false;
    }


    //2.4
    function getRedemptionsCount() external view returns (uint) {
        return redemptions.length;
    }


    //3.1
    function pause() external onlyAdmin whenNotPaused {
        paused = true;
    }


    function unpause() external onlyAdmin whenPaused {
        paused = false;
    }
}
