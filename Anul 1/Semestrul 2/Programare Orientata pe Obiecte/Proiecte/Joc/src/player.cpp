#include "player.h"
#include <stdexcept>
#include <SFML/Window/Keyboard.hpp>

// constructor 
Player::Player(const std::string& texturePath, float x, float y, int speed,
               const std::string& name, float jumpHeight, float velocityY, float gravity) {
    this->x = x;
    this->y = y;
    this->speed = speed;
    this->name = name;
    this->isJumping = false;
    this->jumpHeight = jumpHeight;
    this->velocityY = velocityY;
    this->gravity = gravity;

    if (!texture.loadFromFile(texturePath)) {
        throw std::runtime_error("Failed to load texture from " + texturePath);
    }
    skin.setTexture(texture);
    skin.setPosition(x, y);
}


// Getters
float Player::getX() const { return x; }
float Player::getY() const { return y; }
int   Player::getSpeed() const { return speed; }
const std::string& Player::getName() const { return name; }
bool  Player::getIsJumping() const { return isJumping; }
float Player::getJumpHeight() const { return jumpHeight; }
float Player::getVelocityY() const { return velocityY; }
sf::Sprite& Player::getSkin() { return skin; }

// Setters
void Player::setTexture(const std::string &texturePath){
    if (!texture.loadFromFile(texturePath)) {
        throw std::runtime_error("Failed to load texture from " + texturePath);
    }
    skin.setTexture(texture);
}
void Player::setSpeed(int speed){ this->speed=speed; }
void Player::setName(const std::string &name){ this->name=name; }
void Player::setIsJumping(bool isJumping){ this->isJumping=isJumping; }
void Player::setJumpHeight(float jumpHeight){ this->jumpHeight=jumpHeight; }
void Player::setVelocityY(float v){ velocityY = v; }
void Player::setX(float nx){ x = nx; skin.setPosition(x, y); }
void Player::setY(float ny){ y = ny; skin.setPosition(x, y); }
void Player::setPosition(float nx, float ny){ x = nx; y = ny; skin.setPosition(x, y); }

void Player::move(float dx, const sf::RenderWindow &window) {
    x += dx;

    const float w = skin.getGlobalBounds().width;
    if (x + w > window.getSize().x) x = window.getSize().x - w;
    if (x < 0) x = 0;

    skin.setPosition(x, y);
}

void Player::jump(float height) {
    if (!isJumping) {
        isJumping = true;
        velocityY = -height;
    }
}

void Player::update(float dt){
    if (isJumping) {
        velocityY += gravity * dt;
        y += velocityY * dt;
        skin.setPosition(x, y);
    }
}

void Player::handleInput(const sf::RenderWindow &window) {
    if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left))  move(-static_cast<float>(speed), window);
    if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) move( static_cast<float>(speed), window);
    if (sf::Keyboard::isKeyPressed(sf::Keyboard::Up) && !isJumping) jump(jumpHeight);
}

void Player::draw(sf::RenderWindow &window) { window.draw(skin); }
sf::FloatRect Player::getBounds() const { return skin.getGlobalBounds(); }
