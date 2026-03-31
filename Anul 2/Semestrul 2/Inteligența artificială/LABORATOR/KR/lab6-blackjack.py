import random

class Blackjack:
    def __init__(self, carti, upcard):
        self.carti = carti[:]

        # cartea vizibila a dealerului
        self.upcard = upcard

        # 11 = As
        self.carti_posibile = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

        # 10 reprezinta 10/J/Q/K
        self.prob = {
            2: 1/13,
            3: 1/13,
            4: 1/13,
            5: 1/13,
            6: 1/13,
            7: 1/13,
            8: 1/13,
            9: 1/13,
            10: 4/13,
            11: 1/13
        }

    def valoare_mana(self, carti):
        total = sum(carti)
        nr_asi = carti.count(11)

        # daca depasim 21, transformam As din 11 in 1
        while total > 21 and nr_asi > 0:
            total -= 10
            nr_asi -= 1

        return total

    def blackjack_natural(self, carti):
        return len(carti) == 2 and self.valoare_mana(carti) == 21

    def dealer_play(self, dealer_carti):

        dealer_carti = dealer_carti[:]

        while self.valoare_mana(dealer_carti) < 17:
            carte_noua = random.choices(
                self.carti_posibile,
                weights=[self.prob[c] for c in self.carti_posibile],
                k=1
            )[0]
            dealer_carti.append(carte_noua)

        return dealer_carti

    def eval_stand(self):

        player_total = self.valoare_mana(self.carti)

        if player_total > 21:
            return -1

        scor_asteptat = 0

        # dealerul are upcard + o carte ascunsa necunoscuta
        for hidden in self.carti_posibile:
            p_hidden = self.prob[hidden]
            dealer_start = [self.upcard, hidden]

            # tratam blackjack natural
            if self.blackjack_natural(self.carti) and not self.blackjack_natural(dealer_start):
                scor_asteptat += p_hidden * 1
                continue

            if self.blackjack_natural(dealer_start) and not self.blackjack_natural(self.carti):
                scor_asteptat += p_hidden * (-1)
                continue

            dealer_final = self.dealer_play(dealer_start)
            dealer_total = self.valoare_mana(dealer_final)

            if dealer_total > 21:
                scor_asteptat += p_hidden * 1
            elif player_total > dealer_total:
                scor_asteptat += p_hidden * 1
            elif player_total < dealer_total:
                scor_asteptat += p_hidden * (-1)
            else:
                scor_asteptat += p_hidden * 0

        return scor_asteptat

    def expectimax(self, adancime):

        player_total = self.valoare_mana(self.carti)

        # stare terminala: player bust
        if player_total > 21:
            return -1, "bust"

        # cand am ajuns la adancime 0, evaluam simplu prin stand
        if adancime == 0:
            return self.eval_stand(), "stand"

        # stand
        valoare_stand = self.eval_stand()

        # hit
        valoare_hit = 0

        for carte in self.carti_posibile:
            p = self.prob[carte]
            mana_noua = self.carti + [carte]

            joc_nou = Blackjack(mana_noua, self.upcard)
            valoare_copil, _ = joc_nou.expectimax(adancime - 1)

            valoare_hit += p * valoare_copil

        if valoare_hit > valoare_stand:
            return valoare_hit, "hit"
        else:
            return valoare_stand, "stand"

    def play(self, adancime=3):
        print("Cartile playerului:", self.carti, "| total =", self.valoare_mana(self.carti))
        print("Upcard dealer:", self.upcard)

        while True:
            valoare, actiune = self.expectimax(adancime)
            print("Expectimax recomanda:", actiune, "| valoare asteptata =", round(valoare, 3))

            if actiune == "stand":
                break

            carte_noua = random.choices(
                self.carti_posibile,
                weights=[self.prob[c] for c in self.carti_posibile],
                k=1
            )[0]

            self.carti.append(carte_noua)
            print("Player trage:", carte_noua)
            print("Mana player:", self.carti, "| total =", self.valoare_mana(self.carti))

            if self.valoare_mana(self.carti) > 21:
                print("Player bust. Dealer castiga.")
                return

        # dealerul primeste o carte ascunsa aleatoare
        hidden = random.choices(
            self.carti_posibile,
            weights=[self.prob[c] for c in self.carti_posibile],
            k=1
        )[0]

        dealer_carti = [self.upcard, hidden]
        print("Dealer incepe cu:", dealer_carti, "| total =", self.valoare_mana(dealer_carti))

        dealer_final = self.dealer_play(dealer_carti)
        dealer_total = self.valoare_mana(dealer_final)
        player_total = self.valoare_mana(self.carti)

        print("Dealer final:", dealer_final, "| total =", dealer_total)
        print("Player final:", self.carti, "| total =", player_total)

        if dealer_total > 21:
            print("Dealer bust. Player castiga.")
        elif player_total > dealer_total:
            print("Player castiga.")
        elif player_total < dealer_total:
            print("Dealer castiga.")
        else:
            print("Egalitate.")

joc = Blackjack([10, 6], 5)
joc.play(3)