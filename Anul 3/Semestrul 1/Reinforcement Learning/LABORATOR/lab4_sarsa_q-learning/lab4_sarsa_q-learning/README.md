# 🧠 Laborator RL — SARSA vs Q-Learning

## 📘 Scopul laboratorului
Acest laborator urmărește înțelegerea diferențelor conceptuale și practice dintre doi algoritmi fundamentali de Reinforcement Learning:

- **SARSA** (State-Action-Reward-State-Action) – algoritm *on-policy*
- **Q-Learning** – algoritm *off-policy*

Prin parcurgerea laboratorului, vei învăța:
- cum funcționează cele două metode de actualizare Q-value;
- cum se antrenează agenții pe același mediu;
- cum diferă comportamentul rezultat;
- cum să vizualizezi traiectoriile și să compari politicile învățate.

---

## 🧩 Medii de lucru

### 🪜 CliffWalking-v0
Vom folosi mediul `CliffWalking-v0` din biblioteca `gymnasium`, deoarece ilustrează perfect diferențele de comportament dintre SARSA și Q-Learning:
- agentul trebuie să ajungă de la **S (Start)** la **G (Goal)**;
- zona **# (Cliff)** oferă penalizare mare (`−100`);
- pas normal = `−1`.

SARSA tinde să evite prăpastia (strategie sigură),  
Q-Learning caută traseul optim teoretic, dar riscă penalizări.

![cliff walk](images/cliff_walking.gif)

---

### 🛸 LunarLander-v2
După înțelegerea conceptelor de bază, vom trece la un mediu mai complex: **`LunarLander-v2`**, care face parte din categoria *Box2D environments*.

Scopul este de a ateriza o navetă spațială între doi markeri, controlând motoarele laterale și principale, astfel încât:
- să atingi solul cu o viteză și un unghi sigure,
- să nu te răstorni sau să te prăbușești,
- să optimizezi consumul de combustibil.

**Caracteristici principale:**
- **Spațiu de stare continuu:** 8 dimensiuni (poziție, viteză, unghi, contact cu solul);
- **Spațiu de acțiune discret:** 4 acțiuni (no thrust, main engine, left engine, right engine);
- **Recompense:**
  - +100 până la +140 pentru aterizare corectă;
  - −100 dacă se prăbușește;
  - +10 pentru contact parțial;
  - penalizări pentru combustibil și mișcare excesivă.

Acest mediu necesită **discretizarea spațiului de stări** pentru a putea fi abordat prin Q-Learning clasic, iar ulterior oferă o bună tranziție spre **Deep Q-Learning (DQL)**.

![lunar lander](images/lunar_lander.gif)

---

## ⚙️ Configurarea mediului de lucru



```bash
# Creează mediul
conda env create -f environment.yml

# Activare mediu
conda activate irl-lab4

# Instalare gym-box2d
conda install -c conda-forge gym-box2d
```
