#ifndef MAINMENU_H
#define MAINMENU_H
#include <SFML/Graphics.hpp>
#include <string>



class MainMenu {
    private:
        int MainMenuSelected;
        sf::Font font;
        sf::Text mainMenu[2];

    public:
    //constructors
        MainMenu(float width, float height);

    //methods
        void draw(sf::RenderWindow &window); 
        void moveUp(); 
        void moveDown(); 
        int MainMenuPressed() { return MainMenuSelected; } 

    //destructor
        ~MainMenu();

};

#endif // MAINMENU_H