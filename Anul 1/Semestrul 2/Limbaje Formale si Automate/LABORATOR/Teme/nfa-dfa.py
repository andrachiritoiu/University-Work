# Tema-lab1
# Chirițoiu Andra-Florentina, grupa 134

# transformare din nfa in dfa -> cod
class NFA:
    def __init__(self):
        self.states = ['q0','q1','q2','q3','q4']
        self.alphabet=['0','1']
        self.initial_state = 'q0'
        self.final_states = ['q3','q4']
        self.transition = {
            'q0': {'0':['q0','q1'], '1': ['q0','q2']},
            'q1': {'0':[],'1': ['q3']},
            'q2': {'0': ['q4'],'1':[]},
            'q3': {'0':[],'1':[]},
            'q4': {'0': [],'1':[]},
    }
        import copy
        self.new_transition=dict()
        self.new_transition[self.initial_state]=copy.deepcopy(self.transition[self.initial_state])
        self.dict={}
        self.dict[self.initial_state] =[self.initial_state]

    def concat(self):
        for cheie in self.transition:
            for transition in self.transition[cheie]:
                s_states = []
                new_state = 'q'
                for state in self.transition[cheie][transition]:
                    s_states.append(state)
                    new_state+=state[-1]
                if new_state!=state and new_state!='q':
                    if new_state not in self.new_transition:
                        self.dict[new_state] = s_states
                    else:
                        self.dict[new_state][transition] = s_states

    def reunion(self):
        for cheie in self.dict:
            aux0 = set()
            aux1 = set()
            self.new_transition[cheie] = {}
            for transition in self.dict[cheie]:
                aux0.update(self.transition[transition]['0'])
                aux1.update(self.transition[transition]['1'])

            aux0 = sorted(aux0)
            aux1 = sorted(aux1)
            new_state0 = 'q'
            for state in aux0:
                new_state0 += state[-1]
            new_state1 = 'q'
            for state in aux1:
                new_state1 += state[-1]

            self.new_transition[cheie]['0'] = new_state0
            self.new_transition[cheie]['1'] = new_state1


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

    def process_string(self, input_string):
        current_state = self.initial_state
        for symbol in input_string:
            if symbol not in self.alphabet:
                return False
            current_state=self.new_transition[current_state][symbol]
        return current_state in self.final_states


if __name__ == "__main__" :
    nfa = NFA()
    test_strings=["0","1","01","10","101","010","1010","0101","01011"]
    nfa.concat()
    nfa.reunion()
    nfa.new_states()
    nfa.reunion()
    nfa.new_finals()
    for string in test_strings:
        result = nfa.process_string(string)
        print(f"String {string} is {result}")


# transformare din nfa in dfa(direct)
# class NFA:
#     def __init__(self):
#         self.states = ['q0','q01','q02','q023','q014']
#         self.alphabet=['0','1']
#         self.initial_state = 'q0'
#         self.final_states = ['q023','q014']
#         self.transition = {
#             'q0': {'0': 'q01', '1': 'q02'},
#             'q01': {'0': 'q01', '1': 'q023'},
#             'q02': {'0': 'q014', '1': 'q02'},
#             'q023': {'0': 'q014', '1': 'q02'},
#             'q014': {'0': 'q01', '1': 'q023'}
#     }
#
#     def process_string(self, input_string):
#         current_state = self.initial_state
#         for symbol in input_string:
#             if symbol not in self.alphabet:
#                 return False
#             current_state=self.transition[current_state][symbol]
#         return current_state in self.final_states
#
# if __name__ == "__main__" :
#     nfa = NFA()
#     test_strings=["0","1","01","10","101","010","1010","0101","01011"]
#     for string in test_strings:
#         result = nfa.process_string(string)
#         print(f"String {string} is {result}")
