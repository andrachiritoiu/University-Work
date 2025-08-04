# Tema-lab1
# Chirițoiu Andra-Florentina, grupa 134
#2.Construiți un NFA pentru limbajul L = { w | w se termină cu subșirul "01" sau "10"}.

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

    def process_string(self, input_string):
        current_states = [self.initial_state]
        for symbol in input_string:
            if symbol not in self.alphabet:
                return False
            next_states=[]
            for state in current_states:
                next_states.extend(self.transition[state][symbol])
            current_states=next_states
        return current_states[-1] in self.final_states

if __name__ == "__main__" :
    # initializare obiect
    nfa = NFA()
    test_strings=["0","1","01","10","101","010","1010","0101","01011"]
    for string in test_strings:
        result = nfa.process_string(string)
        print(f"String {string} is {result}")

