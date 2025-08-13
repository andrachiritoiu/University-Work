// garbage.cpp
#include "garbage.h"

void Garbage::draw(sf::RenderWindow &window) const {   
    window.draw(shape);
}

void Garbage::update(float dt) {                       
    x += speed * dt;
    shape.setPosition(x, y);
}
