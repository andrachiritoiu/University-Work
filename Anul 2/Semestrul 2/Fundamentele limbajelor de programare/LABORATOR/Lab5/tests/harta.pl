harta(AL, AD, AT, BY, BE, BA, BG, HR, CZ, DK, EE, FI, FR, DE, GR, HU, IE, IT, LV, LI, LT, LU, MD, MC, ME, NL, MK, NO, PL, PT, RO, RU, SM, RS, SK, SI, ES,
    SE, CH, TR, UA, GB, VA) :-
  vecin(RO,RS), vecin(RO,UA), vecin(RO,MD), vecin(RO,BG), vecin(RO,HU),
  vecin(UA,MD), vecin(UA, HU), vecin(UA, SK), vecin(UA, PL), vecin(UA, BY), vecin(UA, RU),
  vecin(BG,RS), vecin(BG, TR), vecin(BG, MK), vecin(BG, GR),
  vecin(TR, GR),
  vecin(GR, MK), vecin(GR, AL),
  vecin(MK, AL), vecin(MK, RS),
  vecin(AL, RS), vecin(AL, ME),
  vecin(RS,HU), vecin(RS, BA), vecin(RS, HR), vecin(RS, ME),
  vecin(BA, HR), vecin(BA, ME),
  vecin(HR, HU), vecin(HR, SI), vecin(HR, ME),
  vecin(HU, SK), vecin(HU, AU), vecin(HU, SI),
  vecin(SK, AT), vecin(SK, CZ), vecin(SK, PL),
  vecin(PL, DE), vecin(PL, RU), vecin(PL, LT), vecin(PL, BY),
  vecin(BY, LT), vecin(BY, RU), vecin(BY, LV),
  vecin(RU, LV), vecin(RU, EE), vecin(RU, FI), vecin(RU, NO), vecin(RU, LT), 
  vecin(FI, NO), vecin(FI, SE),
  vecin(SE, NO),
  vecin(EE, LV),
  vecin(LV, LT),
  vecin(CZ, DE), vecin(CZ, AT),
  vecin(AT, SI), vecin(AT, IT), vecin(AT, CH), vecin(AT, DE), vecin(AT, LI),
  vecin(IT, CH), vecin(IT, FR), vecin(IT, VA), vecin(IT, SM),
  vecin(CH, FR), vecin(CH, DE), vecin(CH, LI),
  vecin(DE, FR), vecin(DE, LU), vecin(DE, BE), vecin(DE, NL), vecin(DE, DK),
  vecin(NL, BE),
  vecin(BE, FR), vecin(BE, LU),
  vecin(FR, ES), vecin(FR, AD), vecin(FR, MC), vecin(FR, LU),
  vecin(ES, PT), vecin(ES, AD),
  vecin(GB, IE)
  .
                            
vecin(albastru, rosu).
vecin(albastru, verde).
vecin(albastru, galben).
vecin(rosu, albastru).
vecin(rosu, verde).
vecin(rosu, galben).
vecin(verde, albastru).
vecin(verde, rosu).
vecin(verde, galben).
vecin(galben, albastru).
vecin(galben, rosu).
vecin(galben, verde).