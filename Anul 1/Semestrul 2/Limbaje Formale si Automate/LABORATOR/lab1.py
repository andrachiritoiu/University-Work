#1-nr par de 0 si impar de 1
# class DFA:
#     #definim starile
#     def __init__(self):
#         # constructor
#         self.states = ['q1','q2','q3','q4']
#         self.alphabet=['0','1']
#         self.initial_state = 'q1'
#         self.final_states = ['q3']
#         self.transition = {
#             'q1': {'0': 'q2', '1': 'q3'},
#             'q2': {'0': 'q1', '1': 'q4'},
#             'q3': {'0': 'q4', '1': 'q1'},
#             'q4': {'0': 'q3', '1': 'q2'}
#     }
#
#     def process_string(self, input_string):
#         current_state = self.initial_state
#         for symbol in input_string:
#             if symbol not in self.alphabet:
#                 return False
#             current_state=self.transition[current_state][symbol]
#         # verifca daca este stare finala
#         return current_state in self.final_states
#
# if __name__ == "__main__" :
#     #testare daca a terminat procesarea tuturor functiilor pana a ajuns la main ul programului python
#     dfa = DFA()
#     test_strings=["0","1","01","10","101","010","1010","0101"]
#     for string in test_strings:
#         result = dfa.process_string(string)
#         print(f"String {string} is {result}")

#2
#nfa
