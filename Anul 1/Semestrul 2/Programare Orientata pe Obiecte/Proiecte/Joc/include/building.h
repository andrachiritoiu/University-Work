#ifndef BUILDING_H
#define BUILDING_H

#include "obstacles.h"

class Building : public Obstacles {
public:
    // constructors
    Building(float x, float y);
    
    // methods
    void draw(sf::RenderWindow &window) const override;
    void update(float dt) override;
    
    ~Building() override = default;
};

#endif