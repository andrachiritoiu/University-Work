#include "GestiuneProgramari.h"

#include "ConsultatieInitiala.h"
#include "ConsultatieUrmarire.h"

//getter
const std::vector<Programare>& GestiuneProgramari :: getProgramari()const {
    return this->programari;
}

//methods
bool GestiuneProgramari :: adaugaProgramare(const Programare &programare){
    std::string data_programare=programare.getData();
    std::pair<int,int> interval_programare=std::make_pair(programare.getOraInceput(),programare.getOraSfarsit());
    const auto& medic=programare.getMedic();

    for (const auto &p:this->programari) {
        if (p.getMedic()==medic && p.getData()==data_programare) {
            std::pair<int,int> interval=std::make_pair(p.getOraInceput(),p.getOraSfarsit());
            if (interval_programare.first<interval.second && interval_programare.second>interval.first)
                std::cout<<"Acest interval este deja ocupat. Alegeti alt interval.\n";
            return false;
        }
    }

    this->programari.push_back(programare);
    return true;
}


void GestiuneProgramari::afiseazaProgramariFacute(const std::shared_ptr<Medic>& medic) const {
    std::cout<<"Programul medicului "<<medic->getNume()<<" "<<medic->getPrenume()<<":\n";
    bool gasit=false;

    for (const auto &programare:this->programari) {
        if (programare.getMedic()==medic) {
            gasit=true;
            std::cout<<"Data: "<<programare.getData()<<"\n";
            std::cout<<"Interval: "<<programare.getOraInceput()<<":00-"<<programare.getOraSfarsit()<<":00\n";
            std::cout<<"Pacient: "<<programare.getPacient()->getNume()<<" "<<programare.getPacient()->getPrenume()<<"\n";

            auto consultatie=programare.getConsultatie();
            if (auto initiala=std::dynamic_pointer_cast<ConsultatieInitiala>(consultatie)) {
                std::cout<<"Tip: Consultatie initiala\n";
            }
            else if (auto urmarire=std::dynamic_pointer_cast<ConsultatieUrmarire>(consultatie)) {
                    std::cout<<"Tip: Consultatie de urmarire\n";
            }
            else {
                std::cout<<"Cosnultatie generala\n";
            }
        }
    }

    if (!gasit) {
        std::cout<<"Nu exista programari.";
    }
}
