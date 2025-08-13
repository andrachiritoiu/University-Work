#pragma once
#include <SFML/Graphics.hpp>
#include <string>

class Obstacles {
public:
    static int count;

    Obstacles(float x, float y);
    Obstacles(const std::string& texturePath, float x, float y);
    Obstacles& operator=(const Obstacles& o);

    // Destructor VIRTUAL ca să poți șterge derivatele via pointer la bază
    virtual ~Obstacles() = default;

    // getters
    float getX() const;
    float getY() const;
    float getSpeed() const;
    sf::FloatRect getBounds() const;

    // setters
    void setTexture(const std::string &texturePath);
    void setX(float x);
    void setY(float y);
    void setSpeed(float speed);

    // scoring
    bool isScored() const { return scored; }
    void markScored() { scored = true; }

    // logic
    virtual void update(float dt);
    virtual void draw(sf::RenderWindow& window) const;

    static int getCount();

protected:
    float x{}, y{};
    float speed{};
    sf::Texture texture;
    sf::Sprite  shape;

private:
    bool scored = false;
};
