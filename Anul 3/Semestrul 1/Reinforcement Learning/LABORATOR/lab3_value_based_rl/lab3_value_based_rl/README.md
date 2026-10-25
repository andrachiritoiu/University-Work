# 🧮 Laborator 3 — Agenți Value-Based în Reinforcement Learning

## 🎯 Obiective

În acest laborator explorăm algoritmi clasici de RL, de tip **value-based**, prin experimente practice folosind librăria `gymnasium`.  
Scopul este să înțelegem cum pot fi estimate valorile stărilor și acțiunilor, și cum pot fi folosite pentru a ghida deciziile unui agent RL.

---

## 📘 Conținutul laboratorului

|  Algoritm / Concept | Mediul folosit | Tip învățare | Observații |
|-------------------|----------------|---------------|-------------|
| **Value Iteration** | GridWorld (custom) | Model-based | Programare dinamică |
| **Monte Carlo** | FrozenLake-v1 | Model-free, episodic | Învață din episoade complete |
| **Q-learning (ε-Greedy)** | MountainCar-v0 | Explorare controlată | Agent activ cu ε-decay |
| **Multi-Armed Bandit** | Simulat (10 brațe) | Simplificat, non-MDP | Ilustrează trade-off-ul explorare/exploatare |
| **Temporal Difference** | CartPole-v1 | Model-free, online | Învață incremental, fără a aștepta sfârșitul episodului |

---

## 📊 Analiză comparativă a algoritmilor

| Algoritm | Necesită model? | Episodic? | Online? | Puncte forte | Limitări |
|-----------|----------------|-----------|----------|---------------|-----------|
| **Value Iteration** | ✅ | ❌ | ❌ | Convergență exactă, clar teoretic | Scalabilitate redusă |
| **Monte Carlo** | ❌ | ✅ | ❌ | Bias redus, concept intuitiv | Necesită episoade complete |
| **Q-learning** | ❌ | ◐ | ✅ | Off-policy, general, robust | Necesită discretizare și fine tuning |
| **Bandit ε-Greedy** | ❌ | — | ✅ | Exemplu clar de explorare | Nu are noțiunea de stare |
| **Temporal Difference** | ❌ | ◐ | ✅ | Învață din tranziții parțiale, rapid | Bias și sensibilitate la α |

---

## 💬 Discuții și concluzii

- Algoritmii **value-based** reprezintă fundamentul Reinforcement Learning-ului clasic.  
- **Value Iteration** oferă o soluție exactă, dar doar pentru medii mici și complet cunoscute.  
- **Monte Carlo** și **TD(0)** sunt primele forme de *learning by experience* — agentul învață direct din interacțiune.  
- **Q-learning** este cel mai utilizat algoritm tabular, fiind *off-policy* și capabil să învețe comportamente optime prin explorare controlată.  
- **Multi-Armed Bandits** oferă o analogie simplificată pentru problema explorare–exploatare, fără complexitatea MDP-urilor.

---

## 🧠 Exerciții propuse

1. Modificați parametrii **ε** (*inițial*, *decay*, *min*) în **MountainCar** și observați efectul asupra traiectoriei.  
2. În **FrozenLake**, setați `is_slippery=False` și comparați convergența valorilor obținute prin algoritmul Monte Carlo.  
3. În **CartPole**, măriți **α** la `0.5` și observați dacă învățarea devine instabilă.  
4. În **Bandit**, implementați un **ε reward-based decay** — reduceți ε mai repede dacă reward-urile recente cresc.  
5. În **GridWorld**, modificați pozițiile stărilor terminale și observați schimbarea valorilor `V(s)`.

---

## 🧱 Observații finale

- Laboratorul poate fi extins cu versiuni **policy-based** (ex. *REINFORCE*) sau **actor-critic**, abordate în cursurile viitoare.  
- Exemplele sunt compatibile cu `gymnasium >= 0.29` și `Python 3.10+`.  
- Toate seed-urile sunt controlate prin `rng = np.random.default_rng(42)` pentru rezultate reproductibile.

---

## 📘 Fișiere incluse

| Fișier | Descriere |
|---------|------------|
| **lab3_value_based_agents.ipynb** | Notebook complet cu implementările agenților și vizualizări grafice |
| **README.md** | Fișierul explicativ al laboratorului |
| **environment.yml** | Specificația mediului Conda necesar pentru rulare |
