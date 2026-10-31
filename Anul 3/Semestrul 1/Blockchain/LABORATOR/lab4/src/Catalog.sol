// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

contract Catalog {

    enum State { Active, Expired }

    // struct Promo{
    //     State state;
    //     uint start;
    //     uint end;
    //     uint percent;
    // }

    //5.2
    struct Promo {
        State state;
        uint40 start;
        uint40 end;
        uint8 percent;
    }

    // struct Product{
    //     bytes32 code;
    //     string description;
    //     uint price;
    //     bool inStock;
    //     uint stock;
    // }

    //5.2
    // struct Product {
    //     bytes32 code;
    //     string description;
    //     uint128 price;
    //     uint64 stock;
    //     bool inStock;
    // }

    //5.6
    struct Product {
        bytes32 code;
        string description;
        uint128 price;
        uint64 stock;
    }

    Product[] public products;
    mapping(bytes32 => uint) public productIndex;
    Promo public generalPromo;
    mapping(bytes32 => Promo) public productPromos;
    address admin;
    address public fidelityProgram;

    event ProductAdded(bytes32 indexed code, uint price, uint stock);
    event StockChanged(bytes32 indexed code, uint newStock);
    event PromoStarted(bytes32 indexed code, uint end, uint percent);

    error PriceTooLarge(uint price);
    error StockTooLarge(uint stock);
    error ProductAlreadyExists(bytes32 code);

    constructor(){
        admin = msg.sender;
    }


    //1.3
    function setFidelityProgram(address _fidelityProgram) external {
        require(msg.sender == admin, "Only admin");

        fidelityProgram = _fidelityProgram;
    }

    modifier onlyAdminOrFidelity() {
        require(
            msg.sender == admin || msg.sender == fidelityProgram,
            "Not authorized"
        );
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    // function addProduct(bytes32 code, string memory description, uint price, uint stock) public {
    //     products.push(Product({
    //         code: code,
    //         description: description,
    //         price: uint128(price),
    //         stock: uint64(stock),
    //         inStock: true
    //     }));

    //     emit ProductAdded(code, price, stock);
    // }

    //5.4
    function addProduct(bytes32 code, string memory description, uint price, uint stock) public {
        //6.2
        if (productIndex[code] != 0) {
            revert ProductAlreadyExists(code);
        }

        if (price > type(uint128).max) {
            revert PriceTooLarge(price);
        }

        if (stock > type(uint64).max) {
            revert StockTooLarge(stock);
        }

        products.push(Product({
            code: code,
            description: description,
            price: uint128(price),
            stock: uint64(stock)
            // inStock: stock > 0
        }));
        productIndex[code] = products.length;

        emit ProductAdded(code, price, stock);
    }

    function startPromo(uint ndays, uint percent) external{
        generalPromo = Promo({
            state: State.Active,
            start: uint40(block.timestamp),
            end: uint40(block.timestamp + ndays * 1 days),
            percent: uint8(percent)
        });

        emit PromoStarted(bytes32(0), generalPromo.end, percent);
    }

    function endPromo() external {
        generalPromo.end = uint40(block.timestamp);
        generalPromo.state = State.Expired;
    }

  
    function findProductIndex(bytes32 code) internal view returns (uint) {
        uint index = productIndex[code];
        require(index != 0, "Product not found");
        return index - 1;
    }

    //6.3
    function removeProduct(bytes32 code) external onlyAdmin {
        uint index = findProductIndex(code);
        uint lastIndex = products.length - 1;

        if (index != lastIndex) {
            bytes32 lastCode = products[lastIndex].code;
            products[index] = products[lastIndex];
            productIndex[lastCode] = index + 1;
        }

        delete productIndex[code];
        delete productPromos[code];
        products.pop();
    }

    // function increaseStock(bytes32 code, uint amount) external {
    //     uint index = findProductIndex(code);

    //     Product storage p = products[index];

    //     p.stock = uint64(uint256(p.stock) + amount);
    //     p.inStock = p.stock > 0;

    //     emit StockChanged(code, p.stock);
    // }

    function increaseStock(bytes32 code, uint amount) external {
        uint index = findProductIndex(code);

        Product storage p = products[index];

        // verificam daca noul stoc ar depasi uint64
        if (amount > uint256(type(uint64).max) - p.stock) {
            revert StockTooLarge(amount);
        }

        p.stock += uint64(amount);
        // p.inStock = p.stock > 0;

        emit StockChanged(code, p.stock);
    }

    function decreaseStock(bytes32 code, uint amount) external onlyAdminOrFidelity{
        uint index = findProductIndex(code);

        Product storage p = products[index];

        p.stock = uint64(uint256(p.stock) - amount);
        // p.inStock = p.stock > 0;

        emit StockChanged(code, p.stock);
    }


  
    function _startProductPromo(bytes32 code, uint ndays, uint percent) internal {
        findProductIndex(code);

        require(ndays > 0, "Invalid duration");
        require(percent <= 100, "Invalid percent");

        productPromos[code] = Promo({
            state: State.Active,
            start: uint40(block.timestamp),
            end: uint40(block.timestamp + ndays * 1 days),
            percent: uint8(percent)
        });

        emit PromoStarted(code, productPromos[code].end, percent);
    }

    function startProductPromo(bytes32 code, uint ndays, uint percent) external {
        _startProductPromo(code, ndays, percent);
    }

    
    function startPromoBatch(
        bytes32[] calldata codes,
        uint ndays,
        uint percent
    ) external {
        for (uint i = 0; i < codes.length; i++) {
            _startProductPromo(codes[i], ndays, percent);
        }
    }

    
    // function isProductPromoActive(bytes32 code) external view returns (bool) {
    //     findProductIndex(code);

    //     Promo storage promo = productPromos[code];

    //     return (
    //         promo.state == State.Active &&
    //         block.timestamp >= promo.start &&
    //         block.timestamp < promo.end
    //     );
    // }

 
    function hasActivePromo(bytes32 code) internal view returns (bool) {
        Promo storage promo = productPromos[code];

        return (
            promo.state == State.Active &&
            block.timestamp >= promo.start &&
            block.timestamp < promo.end
        );
    }

    function isProductPromoActive(bytes32 code) external view returns (bool) {
        findProductIndex(code);
        return hasActivePromo(code);
    }

    //getProducts(false, false) -> utilizatorul nu vrea sortare dupa stock(prima paranteza va da mereu true si daca este si daca nu este produsul in stoc)
    //
    // function getProducts(bool inStock, bool inPromo) public view returns (Product[] memory)
    // {
    //     uint count = 0;

    //     // numaram produsele care respecta filtrele
    //     for (uint i = 0; i < products.length; i++) {
    //         Product storage p = products[i];

    //         if ((!inStock || p.inStock) && (!inPromo || hasActivePromo(p.code))) {
    //             count++;
    //         }
    //     }

    //     Product[] memory result = new Product[](count);

    //     uint index = 0;

    //     // copiem produsele filtrate
    //     for (uint i = 0; i < products.length; i++) {
    //         Product storage p = products[i];

    //         if ((!inStock || p.inStock) && (!inPromo || hasActivePromo(p.code))) {
    //             result[index] = p;
    //             index++;
    //         }
    //     }

    //     return result;
    // }

    //5.6
    function getProducts(bool inStock, bool inPromo) public view returns (Product[] memory){
        uint count = 0;

        for (uint i = 0; i < products.length; i++) {
            Product storage p = products[i];

            if ((!inStock || p.stock > 0) &&
                (!inPromo || hasActivePromo(p.code))) {
                count++;
            }
        }

        Product[] memory result = new Product[](count);

        uint index = 0;

        for (uint i = 0; i < products.length; i++) {
            Product storage p = products[i];

            if ((!inStock || p.stock > 0) &&
                (!inPromo || hasActivePromo(p.code))) {
                result[index] = p;
                index++;
            }
        }

        return result;
    }

    //6.4
    function getProducts(uint offset, uint limit)
        public
        view
        returns (Product[] memory)
    {
        if (offset >= products.length || limit == 0) {
            return new Product[](0);
        }

        uint end = offset + limit;
        if (end < offset || end > products.length) {
            end = products.length;
        }

        Product[] memory result = new Product[](end - offset);
        for (uint i = offset; i < end; i++) {
            result[i - offset] = products[i];
        }

        return result;
    }

    // calcularea pretului unui produs dupa aplicarea unei reduceri procentuale
    function discountedPrice(uint price, uint percent) public pure returns (uint)
    {
        require(percent <= 100, "Invalid percent");

        return price * (100 - percent) / 100;
    }


    //1.2
    function getPrice(bytes32 code) external view returns (uint) {
        uint index = findProductIndex(code);

        Product storage p = products[index];

        uint bestPercent = 0;

        // promotia generala
        if (
            generalPromo.state == State.Active &&
            block.timestamp >= generalPromo.start &&
            block.timestamp < generalPromo.end
        ) {
            bestPercent = generalPromo.percent;
        }

        // promotia produsului
        if (hasActivePromo(code)) {
            if (productPromos[code].percent > bestPercent) {
                bestPercent = productPromos[code].percent;
            }
        }

        return discountedPrice(p.price, bestPercent);
    }

}