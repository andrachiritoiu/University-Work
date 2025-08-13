#pragma once
#include <SFML/Graphics.hpp>
#include <string>

class Player {
public:
    Player(const std::string& texturePath, float x, float y, int speed,
           const std::string& name, float jumpHeight, float velocityY, float gravity);
    Player(const Player& p);
    Player& operator=(const Player& p);

    // Getters
    float getX() const;
    float getY() const;
    int   getSpeed() const;
    const std::string& getName() const;
    bool  getIsJumping() const;
    float getJumpHeight() const;
    float getVelocityY() const;
    sf::Sprite& getSkin();

    // Setters
    void setTexture(const std::string &texturePath);
    void setSpeed(int speed);
    void setName(const std::string &name);
    void setIsJumping(bool isJumping);
    void setJumpHeight(float jumpHeight);
    void setVelocityY(float v);
    void setX(float nx);
    void setY(float ny);
    void setPosition(float nx, float ny);

    // Methods
    void move(float dx, const sf::RenderWindow &window); 
    void jump(float height);
    void update(float dt);                               
    void handleInput(const sf::RenderWindow &window);
    void draw(sf::RenderWindow &window);
    sf::FloatRect getBounds() const;

private:
    float x{}, y{};
    int   speed{};
    std::string name;
    bool  isJumping{};
    float jumpHeight{};
    float velocityY{};
    float gravity{};

    sf::Texture texture;
    sf::Sprite  skin;
};
