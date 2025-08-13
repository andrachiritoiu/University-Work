#include "obstacles.h"

int Obstacles::count = 0; 

//constructor
Obstacles::Obstacles(float x, float y) {
    this->x = x;
    this->y = y;
    this->speed = 0.f; 
    count++;
}

Obstacles::Obstacles(const std::string& texturePath, float x, float y) {
    this->x = x;
    this->y = y;
    this->speed = 0.f; 
    if (!texture.loadFromFile(texturePath)) {
        throw std::runtime_error("Failed to load texture from " + texturePath);
    }
    shape.setTexture(texture);
    shape.setPosition(x, y);
    count++;
}

//operator
Obstacles& Obstacles::operator=(const Obstacles& o){
    if(this!=&o){
        this->x = o.x;
        this->y = o.y;
        this->speed = o.speed;
        this->texture = o.texture;
        this->shape.setTexture(this->texture);
        this->shape.setPosition(o.x, o.y);
    }
    return *this;
}

//getters
float Obstacles::getX() const {
    return x;
}

float Obstacles::getY() const {
    return y;
}

float Obstacles::getSpeed() const {
    return speed;
}

//setters
void Obstacles::setTexture(const std::string &texturePath) {
    if (!texture.loadFromFile(texturePath)) {
        throw std::runtime_error("Failed to load texture from " + texturePath);
    }
    shape.setTexture(texture);
}

void Obstacles::setX(float x) {
    this->x = x;
    shape.setPosition(x, y);
}

void Obstacles::setY(float y) {
    this->y = y;
    shape.setPosition(x, y);
}

void Obstacles::setSpeed(float speed) {
    this->speed = speed;
}

//methods
int Obstacles::getCount() {
    return count;
}

sf::FloatRect Obstacles::getBounds() const {
    return shape.getGlobalBounds();
}

void Obstacles::update(float dt) {
    x += speed * dt;
    shape.setPosition(x, y);
}

void Obstacles::draw(sf::RenderWindow& window) const {
    window.draw(shape);
}