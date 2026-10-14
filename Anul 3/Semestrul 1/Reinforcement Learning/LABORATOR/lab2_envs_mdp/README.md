# Laborator 2 — Gymnasium Environments Tour + MDP Basics

**Durată:** 2h  
**Obiectiv:**  
1. Explorăm câteva medii Gymnasium (inițializare, particularități, seeding, wrappers, agent aleator).  
2. Introducem conceptul **MDP (Markov Decision Process)**

---


## 🧠 Context teoretic

În RL, un **agent** interacționează cu un **mediu**, pornind de la observații / stări, luând acțiuni și primind recompense / feedback.  
Scopul agentului este să învețe o **strategie (politică)** care maximizează recompensa cumulativă pe termen lung.

Matematic vorbind, această interacțiune este formalizată printr-un **Proces Decizional Markov (MDP)**:
\[
MDP = (S, A, P, R, γ)
\]
unde:
- `S` — mulțimea stărilor posibile,
- `A` — mulțimea acțiunilor disponibile,
- `P(s'|s,a)` — probabilitățile de tranziție între stări,
- `R(s,a,s')` — recompensele primite,
- `γ (gamma)` — factorul de discount care modelează importanța viitorului.

În acest laborator vom explora atât medii cât mai simple, dar și o implementare de la zero a unui mic **GridWorld** pentru a observa modul de calcul pentru valorile stărilor S, sub forma vectorială V[s].

---

## 🗂️ Fișiere incluse

- `lab2_envs.ipynb` — CartPole, MountainCar, FrozenLake (+ opțional LunarLander).  
- `lab2_mdp.ipynb` — MDP: definiții, GridWorld, simulare episoade.  
- `environment.yml` — fișierul de mediu (Conda).  

---

## ⚙️ Quickstart (Conda)

```bash
conda env create -f environment.yml
conda activate irl-lab2
```

---