#include <SFML/Graphics.hpp>
#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <unordered_map>

#include "player.h"
#include "obstacles.h"
#include "car.h"
#include "building.h"
#include "garbage.h"
#include "collision.h"

int Obstacles::count = 0;

int main() {
    sf::RenderWindow window(sf::VideoMode(1400, 700), "Game");
    window.setFramerateLimit(60);

    const float platformTop = 560.f;

  
    sf::Texture bgTexture;
    bool bgOk = bgTexture.loadFromFile("fundal2.png");
    if (!bgOk) {
        std::cerr << "[WARN] Nu pot incarca fundal2.png — folosesc fallback culoare.\n";
    }
    bgTexture.setRepeated(true);

    sf::RectangleShape background(
        sf::Vector2f(static_cast<float>(window.getSize().x),
                     static_cast<float>(window.getSize().y)));

    if (bgOk) {
        background.setTexture(&bgTexture);
        background.setTextureRect(sf::IntRect(0, 0,
            static_cast<int>(window.getSize().x),
            static_cast<int>(window.getSize().y)));
    } else {
        background.setFillColor(sf::Color(30, 30, 30));
    }

    float bgScroll = 0.f;   
    const float bgScrollSpeed = 80.f; 

    // Obstacole
    std::vector<Obstacles*> obstacole;
    std::unordered_map<Obstacles*, bool> jumpedCandidate; 

    float timpIntreObstacole = 2.5f;
    float timer = 0.0f;

    std::srand(static_cast<unsigned>(std::time(nullptr)));

    // Player
    Player player("playerboy.png", 100.f, 380.f, 200, "Player1", 500.f, 0.f, 980.f);
    player.getSkin().setScale(0.5f, 0.5f);
    {   const auto pB = player.getSkin().getGlobalBounds();
        player.setY(platformTop - pB.height);
        player.setVelocityY(0.f);
        player.setIsJumping(false);
    }

    float scrollSpeed = 200.f;

    int score = 0;                      
    const int pointsPerObstacle = 1;

    sf::Font uiFont;
    if (!uiFont.loadFromFile("C:\\Windows\\Fonts\\arial.ttf")) {
        std::cerr << "[ERROR] Nu pot incarca fontul: C:\\Windows\\Fonts\\arial.ttf\n";
        return -1; 
    }

    sf::Text scoreText;
    scoreText.setFont(uiFont);
    scoreText.setCharacterSize(32);
    scoreText.setString("0");
    scoreText.setFillColor(sf::Color::White);
    scoreText.setOutlineColor(sf::Color::Black);
    scoreText.setOutlineThickness(3.f);
    auto sb = scoreText.getLocalBounds();
    scoreText.setOrigin(sb.left + sb.width, sb.top); // ancoră pe dreapta-sus
    scoreText.setPosition(static_cast<float>(window.getSize().x) - 20.f, 20.f);

    auto refreshScoreText = [&](int s) {
        scoreText.setString(std::to_string(s));
        auto b = scoreText.getLocalBounds();
        scoreText.setOrigin(b.left + b.width, b.top);
        scoreText.setPosition(static_cast<float>(window.getSize().x) - 20.f, 20.f);
    };

    // Timp
    sf::Clock clock;

    // Loop principal
    while (window.isOpen()) {
        float dt = clock.restart().asSeconds();
        timer += dt;

        // Evenimente
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
            if (event.type == sf::Event::Resized) {
                background.setSize(sf::Vector2f(
                    static_cast<float>(window.getSize().x),
                    static_cast<float>(window.getSize().y)));
                if (bgOk) {
                    background.setTextureRect(sf::IntRect(
                        0, 0,
                        static_cast<int>(window.getSize().x),
                        static_cast<int>(window.getSize().y)));
                }
                refreshScoreText(score);
            }
        }

       
        player.handleInput(window);

        if (bgOk) {
            bgScroll += bgScrollSpeed * dt;
            int texW = static_cast<int>(bgTexture.getSize().x);
            if (texW <= 0) texW = 1;
            int left = static_cast<int>(bgScroll) % texW;
            background.setTextureRect(sf::IntRect(-left, 0,
                static_cast<int>(window.getSize().x),
                static_cast<int>(window.getSize().y)));
        }

        if (timer >= timpIntreObstacole) {
            timer = 0.f;

            int random = std::rand() % 3;
            Obstacles* obstacol = nullptr;

            const float xStart = static_cast<float>(window.getSize().x);

            switch (random) {
                case 0: obstacol = new Car(xStart, 0.f);      break;
                case 1: obstacol = new Building(xStart, 0.f); break;
                case 2: obstacol = new Garbage(xStart, 0.f);  break;
            }

            if (obstacol) {
                const auto oB = obstacol->getBounds();
                obstacol->setY(platformTop - oB.height); 
                obstacol->setX(xStart);
                obstacol->setSpeed(-scrollSpeed);        
                jumpedCandidate[obstacol] = false;       
                obstacole.push_back(obstacol);
            }
        }

        for (auto* obs : obstacole)
            obs->update(dt);

        for (size_t i = 0; i < obstacole.size();) {
            Obstacles* obs = obstacole[i];
            const auto b = obs->getBounds();
            if (b.left + b.width < 0.f) {
                jumpedCandidate.erase(obs);
                delete obs;
                obstacole.erase(obstacole.begin() + i);
            } else { ++i; }
        }

        player.update(dt);
        {
            const auto pB = player.getSkin().getGlobalBounds();
            if (pB.top + pB.height > platformTop) {
                player.setY(platformTop - pB.height);
                player.setVelocityY(0.f);
                player.setIsJumping(false);
            }
        }

        resolvePlayerVsObstacles(player, obstacole);

        {
            const auto pB = player.getSkin().getGlobalBounds();
            const float playerLeft   = pB.left;
            const float playerRight  = pB.left + pB.width;
            const float playerBottom = pB.top + pB.height;

            for (auto* obs : obstacole) {
                if (obs->isScored()) continue;

                const auto oB = obs->getBounds();
                const float obstacleLeft  = oB.left;
                const float obstacleRight = oB.left + oB.width;
                const float obstacleTop   = oB.top;

                const bool overlapX = !(playerRight < obstacleLeft || playerLeft > obstacleRight);
                const bool above    = (playerBottom <= obstacleTop - 2.f); 

                if (overlapX && above) {
                    jumpedCandidate[obs] = true; 
                }
            }
        }

        
        {
            const auto pB = player.getSkin().getGlobalBounds();
            const float playerLeft = pB.left;

            for (auto* obs : obstacole) {
                if (obs->isScored()) continue;

                const auto oB = obs->getBounds();
                const float obstacleRight = oB.left + oB.width;

                const bool passedLeft = (obstacleRight < playerLeft);

                if (passedLeft && jumpedCandidate[obs]) {
                    score += pointsPerObstacle;
                    obs->markScored();
                    jumpedCandidate.erase(obs);
                    refreshScoreText(score); 
                }
                else if (passedLeft && !jumpedCandidate[obs]) {
                    obs->markScored();
                    jumpedCandidate.erase(obs);
                }
            }
        }

        window.clear();
        window.draw(background);     
        for (auto* obs : obstacole)
            obs->draw(window);
        player.draw(window);
        window.draw(scoreText);
        window.display();
    }

    for (auto* obs : obstacole) delete obs;

    return 0;
}
