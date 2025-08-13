// car.cpp
#include "car.h"

void Car::draw(sf::RenderWindow &window) const {      
    window.draw(shape);
}

void Car::update(float dt) {                           
    x += speed * dt;
    shape.setPosition(x, y);
}
