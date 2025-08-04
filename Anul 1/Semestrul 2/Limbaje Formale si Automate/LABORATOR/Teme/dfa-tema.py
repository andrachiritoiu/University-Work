# Tema-lab1
# Chirițoiu Andra-Florentina, grupa 134

#1.Construiți un DFA care recunoaște limbajul L = { w | w conține un număr par de 0-uri și un număr impar de 1-uri }.

class DFA:
    def __init__(self):
        self.states = ['q0','q1','q2','q3']
        self.alphabet=['0','1']
        self.initial_state = 'q0'
        self.final_states = ['q1']
        self.transition = {
            'q0': {'0': 'q2', '1': 'q1'},
            'q1': {'0': 'q3', '1': 'q0'},
            'q2': {'0': 'q0', '1': 'q3'},
            'q3': {'0': 'q1', '1': 'q2'}
        }

    def process_string(self, input_string):
        current_state = self.initial_state
        for symbol in input_string:
            if symbol not in self.alphabet:
                return False
            current_state=self.transition[current_state][symbol]
        return current_state in self.final_states

if __name__ == "__main__" :
    dfa = DFA()
    test_strings=["0","1","01","10","101","010","1010","0101"]
    for string in test_strings:
        result = dfa.process_string(string)
        print(f"String {string} is {result}")

