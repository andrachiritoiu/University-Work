#ifndef GARBAGE_H
#define GARBAGE_H

#include "obstacles.h"

class Garbage : public Obstacles {
public:
    // constructors
    Garbage(float x, float y);
    
    // methods
    void draw(sf::RenderWindow &window) const override;
    void update(float dt) override;
    
    ~Garbage() override = default;
};

#endif