#ifndef CAR_H
#define CAR_H

#include "obstacles.h"

class Car : public Obstacles {
public:
    // constructors
    Car(float x, float y);
    
    // methods
    void draw(sf::RenderWindow &window) const override;
    void update(float dt) override;
    
    ~Car() override = default;
};

#endif