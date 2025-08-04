# Reg ex: a)multimea vid, lambda,e
# b)concatenare . , |
# c)reuniune +
# d)stelare
from idlelib.autocomplete_w import LISTUPDATE_SEQUENCE
from turtledemo.clock import datum


# 1.NFA - REGEX
#  - verif starea finala   validate_final_state()
# -verif starea initiala  validate_initial_state()
# -reunim tranzitiile trans:  K,S,ET(K,S)
#                             P,S,ET(P,S)
#                             P,K,ET(P,K)
# MATRICE :pe linie si coloana eticheta
# -eliminam tranz

# 2.REGEX - NFA
# cazuri:
# -LIT,NFA
# -NFA,Literal
# -Literal,  LiteraL
# -NFA,(NFA,LIT)

# FORMA POLONEZA: queue, stack

# 1
# class NFA:
#     def __init__(self):
#         # This specific NFA should generate ab*ab*a
#         self.states = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']
#         self.alphabet = ['a', 'b', 'lambda']
#         self.initial_state = 'q1'
#         self.final_states = ['q6']
#         self.transition = {
#             'q1': {'q1': [], 'q2': ['a'], 'q3': [], 'q4': [], 'q5': [], 'q6': []},
#             'q2': {'q1': [], 'q2': ['b'], 'q3': ['lambda'], 'q4': [], 'q5': [], 'q6': []},
#             'q3': {'q1': [], 'q2': [], 'q3': [], 'q4': ['a'], 'q5': [], 'q6': []},
#             'q4': {'q1': [], 'q2': [], 'q3': [], 'q4': ['b'], 'q5': ['lambda'], 'q6': []},
#             'q5': {'q1': [], 'q2': [], 'q3': [], 'q4': [], 'q5': [], 'q6': ['a']},
#             'q6': {'q1': [], 'q2': [], 'q3': [], 'q4': [], 'q5': [], 'q6': []}
#         }
#
#         # Alternative NFA for testing
#         # self.states = ['q1','q2','q3']
#         # self.alphabet=['a','b','lambda']
#         # self.initial_state = 'q1'
#         # self.final_states = ['q2','q3']
#         # self.transition = {
#         #     'q1': {'q1':['a'],'q2':['a'],'q3':['a','b']},
#         #     'q2': {'q1':[],'q2':['b'],'q3':['a']},
#         #     'q3': {'q1':[],'q2':[],'q3':[]}
#         # }
#
#     def concat(self):
#         """Concatenate multiple symbols on same transition with '+'"""
#         for src in self.transition:
#             for dest in self.transition[src]:
#                 simboluri = self.transition[src][dest]
#                 if simboluri:
#                     # Join multiple symbols with +
#                     self.transition[src][dest] = ['+'.join(simboluri)]
#         print("After concat:", self.transition)
#
#     def verif_stare_initiala(self):
#         """Add new initial state if needed"""
#         has_incoming = False
#         for state in self.transition:
#             if state != self.initial_state and self.initial_state in self.transition[state] and self.transition[state][
#                 self.initial_state]:
#                 has_incoming = True
#                 break
#
#         # If initial state has incoming transitions or is final, create new initial state
#         if has_incoming or self.initial_state in self.final_states:
#             new_init = 'q0'
#             # Create new initial state with lambda transition to old initial
#             self.transition[new_init] = {s: [] for s in self.states}
#             self.transition[new_init][self.initial_state] = ['lambda']
#             self.states.insert(0, new_init)
#             self.initial_state = new_init
#
#         print("After initial state check:", self.transition)
#
#     def verif_stare_finala(self):
#         """Add new final state if needed"""
#         # Check if any final state has outgoing transitions or multiple finals exist
#         needs_new_final = len(self.final_states) > 1
#         if not needs_new_final:
#             for final in self.final_states:
#                 for dest in self.transition[final]:
#                     if self.transition[final][dest]:
#                         needs_new_final = True
#                         break
#                 if needs_new_final:
#                     break
#
#         if needs_new_final:
#             new_final = 'qf'
#             # Create new state and lambda transitions from old finals
#             self.transition[new_final] = {s: [] for s in self.states}
#             self.states.append(new_final)
#
#             for final in self.final_states:
#                 self.transition[final][new_final] = ['lambda']
#
#             self.final_states = [new_final]
#
#         print("After final state check:", self.transition)
#
#     def eliminare_stari(self):
#         """Eliminate states to convert NFA to regex"""
#         import copy
#
#         # Get states to eliminate (non-initial, non-final states)
#         states_to_eliminate = [s for s in self.states if s != self.initial_state and s not in self.final_states]
#
#         print(f"States to eliminate: {states_to_eliminate}")
#         print(f"Initial state: {self.initial_state}")
#         print(f"Final states: {self.final_states}")
#
#         for state in states_to_eliminate:
#             # Find incoming and outgoing transitions
#             incoming = {}
#             for src in self.states:
#                 if src != state and state in self.transition[src] and self.transition[src][state]:
#                     incoming[src] = self.transition[src][state][0]
#
#             outgoing = {}
#             for dest in self.states:
#                 if dest != state and dest in self.transition[state] and self.transition[state][dest]:
#                     outgoing[dest] = self.transition[state][dest][0]
#
#             # Get loop expression if it exists
#             loop = ""
#             if state in self.transition[state] and self.transition[state][state]:
#                 loop_expr = self.transition[state][state][0]
#                 # Add parentheses if needed
#                 if '+' in loop_expr:
#                     loop = f"({loop_expr})*"
#                 else:
#                     loop = f"{loop_expr}*"
#
#             # Create new transitions bypassing the eliminated state
#             for src in incoming:
#                 for dest in outgoing:
#                     # Build the new expression: from->loop->to
#                     from_expr = incoming[src]
#                     to_expr = outgoing[dest]
#
#                     # Check if parentheses are needed
#                     if '+' in from_expr:
#                         from_expr = f"({from_expr})"
#                     if '+' in to_expr:
#                         to_expr = f"({to_expr})"
#
#                     # Create the new path expression
#                     if loop:
#                         new_expr = f"{from_expr}{loop}{to_expr}"
#                     else:
#                         new_expr = f"{from_expr}{to_expr}"
#
#                     # If there's already a direct path, add this as an alternative
#                     if dest in self.transition[src] and self.transition[src][dest]:
#                         existing = self.transition[src][dest][0]
#                         self.transition[src][dest] = [f"{existing}+{new_expr}"]
#                     else:
#                         self.transition[src][dest] = [new_expr]
#
#             # Remove all transitions to and from the eliminated state
#             for s in self.states:
#                 if state in self.transition[s]:
#                     self.transition[s][state] = []
#
#             print(f"After eliminating {state}: {self.transition}")
#
#         # Simplify expressions by removing lambda
#         for src in self.states:
#             for dest in self.states:
#                 if dest in self.transition[src] and self.transition[src][dest]:
#                     expr = self.transition[src][dest][0]
#                     # Replace 'lambda' with empty string
#                     expr = expr.replace('lambda', '')
#                     self.transition[src][dest] = [expr]
#
#     def get_regex(self):
#         """Get the final regex after state elimination"""
#         if self.final_states[0] in self.transition[self.initial_state] and self.transition[self.initial_state][
#             self.final_states[0]]:
#             regex = self.transition[self.initial_state][self.final_states[0]][0]
#             # Clean up unnecessary parentheses if possible
#             return regex
#         return ""
#
#     def simplify_regex(self, regex):
#         """Simplify the regex by removing unnecessary parentheses and simplifying expressions"""
#         # This is a placeholder - in a real implementation, you'd add regex simplification logic here
#         return regex
#
#
# if __name__ == "__main__":
#     # Create NFA for ab*ab*a
#     nfa = NFA()
#     nfa.concat()
#     nfa.verif_stare_initiala()
#     nfa.verif_stare_finala()
#     nfa.eliminare_stari()
#
#     final_regex = nfa.get_regex()
#     print("\nFinal Regular Expression:", final_regex)


# 2
# class NFAConstructor:
#     def __init__(self, regex):
#         self.regex = regex
#         self.state_id = 0
#         self.transitions = {}
#         self.start_state = None
#         self.final_state = None
#
#     def new_state(self):
#         state = f'q{self.state_id}'
#         self.state_id += 1
#         self.transitions[state] = {}
#         return state
#
#     def add_transition(self, from_state, symbol, to_state):
#         if symbol not in self.transitions[from_state]:
#             self.transitions[from_state][symbol] = []
#         self.transitions[from_state][symbol].append(to_state)
#
#     def build_from_symbol(self, symbol):
#         start = self.new_state()
#         end = self.new_state()
#         self.add_transition(start, symbol, end)
#         return start, end
#
#     def build_from_concat(self, nfa1, nfa2):
#         self.add_transition(nfa1[1], 'ε', nfa2[0])
#         return nfa1[0], nfa2[1]
#
#     def build_from_union(self, nfa1, nfa2):
#         start = self.new_state()
#         end = self.new_state()
#         self.add_transition(start, 'ε', nfa1[0])
#         self.add_transition(start, 'ε', nfa2[0])
#         self.add_transition(nfa1[1], 'ε', end)
#         self.add_transition(nfa2[1], 'ε', end)
#         return start, end
#
#     def build_from_star(self, nfa):
#         start = self.new_state()
#         end = self.new_state()
#         self.add_transition(start, 'ε', nfa[0])
#         self.add_transition(start, 'ε', end)
#         self.add_transition(nfa[1], 'ε', nfa[0])
#         self.add_transition(nfa[1], 'ε', end)
#         return start, end
#
#     def parse(self, regex):
#         stack = []
#         i = 0
#         while i < len(regex):
#             c = regex[i]
#             if c == '(':
#                 sub = ''
#                 balance = 1
#                 i += 1
#                 while i < len(regex) and balance > 0:
#                     if regex[i] == '(':
#                         balance += 1
#                     elif regex[i] == ')':
#                         balance -= 1
#                     if balance > 0:
#                         sub += regex[i]
#                     i += 1
#                 start, end = self.parse(sub)
#                 stack.append((start, end))
#                 continue
#             elif c == '*':
#                 nfa = stack.pop()
#                 stack.append(self.build_from_star(nfa))
#             elif c == '|':
#                 i += 1
#                 right = regex[i:]
#                 left_nfa = self.parse(regex[:i - 1])
#                 right_nfa = self.parse(right)
#                 return self.build_from_union(left_nfa, right_nfa)
#             else:
#                 stack.append(self.build_from_symbol(c))
#             i += 1
#
#         # Handle concatenation
#         while len(stack) > 1:
#             nfa2 = stack.pop()
#             nfa1 = stack.pop()
#             stack.append(self.build_from_concat(nfa1, nfa2))
#
#         return stack[0]
#
#     def build(self):
#         self.start_state, self.final_state = self.parse(self.regex)
#
#     def print_transitions(self):
#         print("NFA transitions:")
#         for state, transitions in self.transitions.items():
#             for symbol, targets in transitions.items():
#                 for target in targets:
#                     print(f"{state} --{symbol}--> {target}")
#         print(f"Start state: {self.start_state}")
#         print(f"Final state: {self.final_state}")
#
#
# if __name__ == "__main__":
#     regex = "(a|b)*abb"
#     nfa = NFAConstructor(regex)
#     nfa.build()
#     nfa.print_transitions()

