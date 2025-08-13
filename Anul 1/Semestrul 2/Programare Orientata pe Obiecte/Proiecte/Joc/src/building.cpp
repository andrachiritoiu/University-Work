// building.cpp
#include "building.h"

void Building::draw(sf::RenderWindow &window) const {  
    window.draw(shape);
}

void Building::update(float dt) {                      
    x += speed * dt;
    shape.setPosition(x, y);
}
