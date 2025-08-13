#include "collision.h"
#include "player.h"
#include "obstacles.h"
#include <SFML/Graphics.hpp>
#include <algorithm>

static constexpr float LAND_EPS = 6.f;  

void resolvePlayerVsObstacles(Player& player, const std::vector<Obstacles*>& obstacles)
{
    sf::Sprite& skin = player.getSkin();

    for (const auto* obs : obstacles)
    {
        if (!obs) continue;

        sf::FloatRect pB = skin.getGlobalBounds();
        const sf::FloatRect oB = obs->getBounds();

        if (!pB.intersects(oB)) continue;

        const float vY = player.getVelocityY();
        const float playerBottom = pB.top + pB.height;
        const float obstacleTop  = oB.top;

        const float overlapLeft   = (pB.left + pB.width) - oB.left;
        const float overlapRight  = (oB.left + oB.width) - pB.left;
        const float overlapTop    = (pB.top + pB.height) - oB.top;
        const float overlapBottom = (oB.top + oB.height) - pB.top;

        const float penX = std::min(overlapLeft, overlapRight);
        const float penY = std::min(overlapTop,  overlapBottom);

        const bool wantLand   = (vY > 0.f) && ((playerBottom - obstacleTop) <= (LAND_EPS + std::max(0.f, penY)));
        const bool hitCeiling = (vY < 0.f) && (pB.top <= oB.top + oB.height) && (overlapBottom <= penY + 0.1f);

        if (wantLand) {
            const float newY = oB.top - pB.height;
            player.setY(newY);
            player.setVelocityY(0.f);
            player.setIsJumping(false);
        }
        else if (hitCeiling) {
            const float newY = oB.top + oB.height;
            player.setY(newY);
            player.setVelocityY(0.f);
        }
        else {
            if (overlapLeft < overlapRight) {
                const float newX = oB.left - pB.width; 
                player.setX(newX);
            } else {
                const float newX = oB.left + oB.width; 
                player.setX(newX);
            }
        }

        pB = skin.getGlobalBounds();
    }
}
