#ifndef COLLISION_H
#define COLLISION_H

#include "player.h"
#include "obstacles.h"
#include <vector>

void resolvePlayerVsObstacles(Player& player, const std::vector<Obstacles*>& obstacles);

#endif