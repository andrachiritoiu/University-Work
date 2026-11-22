# Laborator 7 – Policy Gradients & REINFORCE

Acest laborator introduce conceptele fundamentale necesare pentru tranziția de la metode value-based la metode policy-based în Reinforcement Learning. Laboratorul este împărțit în două părți principale.

---

## 1. Logaritmi și Derivate Parțiale în Machine Learning

În această secțiune am studiat:

- de ce funcția de pierdere `-log(p)` este standard în clasificare și RL,
- cum derivata sa,  
  $$ \frac{d}{dp}[-\log(p)] = -\frac{1}{p}, $$
  produce update-uri mai puternice atunci când modelul greșește,
- comportamentul diferit dintre învățarea cu și fără log,
- modul în care derivatele parțiale afectează actualizarea parametrilor unui model:

  $$
  \frac{\partial L}{\partial w_i} = (p - y) \cdot x_i.
  $$

Prin exemple vizuale și mini-experimente am demonstrat că log-loss oferă un gradient stabil și util pentru optimizare.

---

## 2. Algoritmul REINFORCE (Policy Gradient)

Partea practică a laboratorului implementează primul algoritm policy-based: **REINFORCE**, utilizând PyTorch.

Principalele etape:

1. Politica este o rețea neuronală care produce o distribuție de acțiuni (softmax).
2. La fiecare pas se extrage o acțiune prin sampling din distribuție.
3. Se colectează log-probabilitățile și rewardurile.
4. Se calculează returnurile discountate:

   $$
   G_t = r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \dots
   $$

5. Se aplică funcția de pierdere specifică REINFORCE:

   $$
   L(\theta) = -\sum_t G_t \cdot \log \pi_\theta(a_t \mid s_t).
   $$

Agentul a fost antrenat pe `CartPole-v1`, iar performanța a fost vizualizată folosind un grafic smoothed (moving average).

---

## Concluzie

Acest laborator stabilește baza teoretică și practică pentru metodele policy-based:

- înțelegerea log-probabilităților și a derivatelor,
- implementarea unui algoritm complet de tip policy gradient.

Conceptelor introduse aici vor fi extinse în laboratoarele următoare: Actor-Critic, Advantage Actor-Critic (A2C/A3C) și PPO.
