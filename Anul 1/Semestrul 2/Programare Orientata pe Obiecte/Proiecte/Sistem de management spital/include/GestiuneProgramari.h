#ifndef GESTIUNEPROGRAMARI_H
#define GESTIUNEPROGRAMARI_H
#include<memory>
#include<vector>
#include "Medic.h"
#include "Programare.h"

class GestiuneProgramari {
  private:
  //obj direct - nu are mosteniri
    std::vector<Programare> programari;
  public:
    //getter
    [[nodiscard]] const std::vector<Programare>& getProgramari()const;

    //methods
    bool adaugaProgramare(const Programare &programare);
    void afiseazaProgramariFacute(const std::shared_ptr<Medic>& medic) const;

};


#endif //GESTIUNEPROGRAMARI_H
