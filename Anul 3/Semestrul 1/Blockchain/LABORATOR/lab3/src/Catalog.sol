// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

contract Catalog {

    enum State { Active, Expired }

    struct Promo{
        State state;
        uint start;
        uint end;
        uint percent;
    }

    struct Product{
        bytes32 code;
        string description;
        uint price;
        bool inStock;
        uint stock;
    }

    Product[] public products;
    Promo public generalPromo;
    mapping(bytes32 => Promo) public productPromos;
    address admin;

    constructor(){
        admin = msg.sender;
    }

    function addProduct(bytes32 code, string memory description, uint price, uint stock) public {
        products.push(Product({
            code: code,
            description: description,
            price: price,
            inStock: true,
            stock: stock
        }));
    }

    function startPromo(uint ndays, uint percent) external{
        generalPromo = Promo({
            start: block.timestamp,
            end: block.timestamp +  (ndays * 24 * 60 * 60),
            state: State.Active,
            percent: percent
        }) ;
    }

    function endPromo() external {
        generalPromo.end = block.timestamp;
        generalPromo.state = State.Expired;
    }

    // ex 4
    function findProductIndex(bytes32 code) internal view returns (uint) {
        for (uint i = 0; i < products.length; i++) {
            if (products[i].code == code) {
                return i;
            }
        }

        revert("Product not found");
    }

    function increaseStock(bytes32 code, uint amount) external {
        uint index = findProductIndex(code);

        Product storage p = products[index];

        p.stock += amount;
        p.inStock = p.stock > 0;
    }

    function decreaseStock(bytes32 code, uint amount) external {
        uint index = findProductIndex(code);

        Product storage p = products[index];

        p.stock -= amount;
        p.inStock = p.stock > 0;
    }


    // 5
    function _startProductPromo(bytes32 code, uint ndays, uint percent) internal {
        findProductIndex(code);

        require(ndays > 0, "Invalid duration");
        require(percent <= 100, "Invalid percent");

        productPromos[code] = Promo({
            state: State.Active,
            start: block.timestamp,
            end: block.timestamp + ndays * 1 days,
            percent: percent
        });
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

    // 6
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
    function getProducts(bool inStock, bool inPromo) public view returns (Product[] memory)
    {
        uint count = 0;

        // numaram produsele care respecta filtrele
        for (uint i = 0; i < products.length; i++) {
            Product storage p = products[i];

            if ((!inStock || p.inStock) && (!inPromo || hasActivePromo(p.code))) {
                count++;
            }
        }

        Product[] memory result = new Product[](count);

        uint index = 0;

        // copiem produsele filtrate
        for (uint i = 0; i < products.length; i++) {
            Product storage p = products[i];

            if ((!inStock || p.inStock) && (!inPromo || hasActivePromo(p.code))) {
                result[index] = p;
                index++;
            }
        }

        return result;
    }

    //7 - calcularea pretului unui produs dupa aplicarea unei reduceri procentuale
    function discountedPrice(uint price, uint percent) public pure returns (uint)
    {
        require(percent <= 100, "Invalid percent");

        return price * (100 - percent) / 100;
    }

}