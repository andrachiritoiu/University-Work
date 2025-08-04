# Tema-lab2
# Chirițoiu Andra-Florentina, grupa 134

# transformare din LAMBDA NFA in DFA -> cod(fara lambda-inchidereile date)
class NFA:
    def __init__(self):
        self.states = ['q0','q1','q2','q3','q4','q5','q6']
        self.alphabet=['f','d','p','r','v','e','lambda']
        self.initial_state = 'q0'
        self.final_states = ['q6']
        self.transition = {
            'q0': {'f':['q1'], 'd': [], 'p': [], 'r': [], 'v': [], 'e': [], 'lambda': ['q2','q3']},
            'q1': {'f':['q2'], 'd': ['q3'], 'p': [], 'r': [], 'v': [], 'e': [], 'lambda': ['q4']},
            'q2': {'f':['q3','q5'], 'd': [], 'p': ['q4'], 'r': [], 'v': [], 'e': [], 'lambda': []},
            'q3': {'f':['q2','q4'], 'd': ['q5'], 'p': [], 'r': [], 'v': [], 'e': [], 'lambda': []},
            'q4': {'f':['q5'], 'd': [], 'p': ['q6'], 'r': ['q0'], 'v': [], 'e': [], 'lambda': []},
            'q5': {'f':[], 'd': [], 'p': [], 'r': [], 'v': ['q6'], 'e': ['q1','q3'], 'lambda': []},
            'q6': {'f':[], 'd': [], 'p': [], 'r': [], 'v': ['q4'], 'e': [], 'lambda': ['q0']}
    }
        import copy
        self.new_transition=dict()
        self.new_transition[self.initial_state]=copy.deepcopy(self.transition[self.initial_state])
        #dictionar aux
        self.dict=dict()
        self.dict[self.initial_state] =[self.initial_state]

    def lambdaclose(self):
        for cheie in self.transition:
            # lambda si dupa o alta tranzitie
            if self.transition[cheie]['lambda']!=[]:
                for transition in self.transition[cheie]['lambda']:
                    current_statesf = transition
                    current_statesd = transition
                    current_statesp = transition
                    current_statesr = transition
                    current_statesv = transition
                    current_statese = transition

                    next_statesf = self.transition[transition]['f']
                    self.transition[cheie]['f'].extend(next_statesf)
                    self.transition[cheie]['f']=sorted(self.transition[cheie]['f'])

                    # while "lambda" in  next_statesf:
                    #     next_statesf =self.transition[transition]['f']

                    next_statesd = self.transition[transition]['d']
                    self.transition[cheie]['d'].extend(next_statesd)
                    self.transition[cheie]['d'] = sorted(self.transition[cheie]['d'])

                    next_statesp = self.transition[transition]['p']
                    self.transition[cheie]['p'].extend(next_statesp)
                    self.transition[cheie]['p'] = sorted(self.transition[cheie]['p'])

                    next_statesr = self.transition[transition]['r']
                    self.transition[cheie]['r'].extend(next_statesr)
                    self.transition[cheie]['r'] = sorted(self.transition[cheie]['r'])

                    next_statesv = self.transition[transition]['v']
                    self.transition[cheie]['v'].extend(next_statesv)
                    self.transition[cheie]['v'] = sorted(self.transition[cheie]['v'])

                    next_statese = self.transition[transition]['e']
                    self.transition[cheie]['e'].extend(next_statese)
                    self.transition[cheie]['e'] = sorted(self.transition[cheie]['e'])

            for state in self.transition[cheie]:
                if self.transition[cheie][state]!=[]:
                    for transition in self.transition[cheie][state]:
                        if self.transition[transition]['lambda']:
                            for l in self.transition[transition]['lambda']:
                                if l not in  self.transition[cheie][state]:
                                    self.transition[cheie][state].append(l)
                            self.transition[cheie][state] = sorted(self.transition[cheie][state])

        for i in self.transition.items():
            print(i)

    def concat(self):
        for cheie in self.transition:
            for transition in self.transition[cheie]:
                s_states = []
                new_state = 'q'
                if transition!='lambda':
                    for state in self.transition[cheie][transition]:
                        s_states.append(state)
                        new_state+=state[-1]

                if new_state!='q':
                    if new_state not in self.new_transition:
                        self.dict[new_state] = s_states
                    else:
                        self.dict[new_state][transition] = s_states
        # print(self.dict)

    def reunion(self):
        chei_del = set()
        for cheie in list(self.dict):
            auxf = set()
            auxd = set()
            auxp = set()
            auxr = set()
            auxv = set()
            auxe = set()
            self.new_transition[cheie] = {}
            if cheie in self.dict:
                for transition in self.dict[cheie]:
                    auxf.update(self.transition[transition]['f'])
                    auxd.update(self.transition[transition]['d'])
                    auxp.update(self.transition[transition]['p'])
                    auxr.update(self.transition[transition]['r'])
                    auxv.update(self.transition[transition]['v'])
                    auxe.update(self.transition[transition]['e'])

                auxf = sorted(auxf)
                auxd = sorted(auxd)
                auxp = sorted(auxp)
                auxr = sorted(auxr)
                auxv = sorted(auxv)
                auxe = sorted(auxe)

                new_statef = 'q'
                for state in auxf:
                    new_statef += state[-1]
                new_stated = 'q'
                for state in auxd:
                    new_stated += state[-1]
                new_statep = 'q'
                for state in auxp:
                    new_statep += state[-1]
                new_stater = 'q'
                for state in auxr:
                    new_stater += state[-1]
                new_statev = 'q'
                for state in auxv:
                    new_statev += state[-1]
                new_statee = 'q'
                for state in auxe:
                    new_statee += state[-1]

                if new_statef != 'q':
                    self.new_transition[cheie]['f'] = new_statef
                if new_stated != 'q':
                    self.new_transition[cheie]['d'] = new_stated
                if new_statep != 'q':
                    self.new_transition[cheie]['p'] = new_statep
                if new_stater != 'q':
                    self.new_transition[cheie]['r'] = new_stater
                if new_statev != 'q':
                    self.new_transition[cheie]['v'] = new_statev
                if new_statee!='q':
                    self.new_transition[cheie]['e'] = new_statee

            for cheie in list(self.dict):
                found=False
                for transition in self.new_transition.values():
                    if cheie not in self.dict:
                        self.dict[cheie].append(transition)
                    if cheie in transition.values():
                        found=True
                        break
                if found==False :
                    chei_del.add(cheie)
                elif cheie in chei_del:
                    chei_del.remove(cheie)

        if self.initial_state in chei_del:
            chei_del.remove(self.initial_state)

        for cheie in chei_del:
            if cheie in self.new_transition:
                self.new_transition.pop(cheie)

        # for i in self.new_transition.items():
        #     print(*i)

    def new_states(self):
        for cheie in self.new_transition:
            for transition in self.new_transition[cheie]:
                if self.new_transition[cheie][transition] not in self.dict:
                    i = 1
                    states = []
                    while self.new_transition[cheie][transition][-i] != 'q':
                        states.append('q' + self.new_transition[cheie][transition][-i])
                        i += 1
                    states = sorted(states)
                    self.dict[self.new_transition[cheie][transition]] = states


    def new_finals(self):
        L=[]
        for state in self.final_states:
            L.append(state[-1])
        # print(L)
        self.final_states=[]
        for cheie in self.new_transition:
            i=1
            while cheie[-i] != 'q':
                if cheie[-i] in L:
                    self.final_states.append(cheie)
                i+=1
        # afisare
        for i in self.new_transition.items():
            print(*i)


    def process_string(self, input_string):
        current_state = self.initial_state
        for symbol in input_string:
            if symbol not in self.alphabet:
                return False
            current_state=self.new_transition[current_state][symbol]
        return current_state in self.final_states


if __name__ == "__main__" :
    nfa = NFA()
    print("Transformare de la lambda-NFA la NFA")
    nfa.lambdaclose()
    print()
    print("Transformare de la NFA la DFA")
    nfa.concat()
    nfa.reunion()
    nfa.new_states()
    nfa.reunion()
    nfa.new_finals()





