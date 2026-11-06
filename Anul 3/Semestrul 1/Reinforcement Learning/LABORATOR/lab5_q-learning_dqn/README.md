# 🧠 Lab 5 – Deep Q-Learning vs Q-Learning

## 🎯 Obiective
În acest laborator vom explora diferențele dintre algoritmul **Q-Learning** (clasic, tabular) și **Deep Q-Learning (DQN)** — o versiune care folosește rețele neuronale pentru a aproxima funcția de valoare \( Q(s, a) \).

La finalul laboratorului, studenții vor putea:
- înțeleagă ideea de **approximation function** în RL;
- implementeze un **agent DQN** folosind **PyTorch**;
- compare performanțele între Q-learning tabular și Deep Q-learning;
- înțeleagă avantajele și limitările celor două abordări.

---

## ⚙️ 1️⃣ Q-Learning vs. Deep Q-Learning

| Aspect | Q-Learning (Tabular) | Deep Q-Learning (DQN) |
|--------|----------------------|------------------------|
| **Reprezentarea funcției Q** | Tabel (matrice) \( Q[s, a] \) | Rețea neuronală care aproximează \( Q(s, a) \) |
| **Spațiul de stare** | Discret (necesită discretizare manuală) | Poate gestiona stări continue |
| **Generalizare** | Inexistentă (învățare separată pentru fiecare stare) | Generalizează între stări similare |
| **Viteză de antrenare** | Foarte rapid | Mai lent, necesită backpropagation |
| **Scalabilitate** | Limitată (exploadează dimensional) | Scalabil la probleme complexe |
| **Stabilitate** | Stabil (valoare exactă) | Poate fi instabil → de aceea se folosesc *Replay Buffer* + *Target Network* |

> 💡 *Intuitiv:* DQN înlocuiește tabelul Q cu un “aproximator” învățabil (neural network) care poate generaliza și învăța din experiență.

---

## 📘 2️⃣ Parcursul laboratorului

1. **Recapitulare Q-Learning clasic:**
   - Reîmprospătăm principiul Q-learning: actualizarea \( Q(s,a) \) pe baza recompensei și a valorii maxime viitoare.
   - Implementăm un agent tabular pe un mediu discret (`CartPole-v1`, discretizat).

2. **Introducere în Deep Q-Learning:**
   - Înlocuim tabelul cu o rețea neuronală simplă (PyTorch).
   - Implementăm experiența de învățare cu *Replay Buffer* și *Target Network*.

3. **Comparație:**
   - Observăm curbele de învățare pentru ambele abordări.
   - Analizăm stabilitatea, viteza și performanța.

4. **Experiment:**
   - Rulăm DQN pe `CartPole-v1`.
   - Opțional: rulați pe `LunarLander-v2` pentru o problemă continuă, mai complexă.

---

## 🧩 3️⃣ Despre bibliotecile Torch și TensorFlow

### 🔹 **PyTorch**
- Framework dezvoltat de Facebook (Meta AI).
- Bazat pe conceptul de **computație dinamică**: rețeaua se construiește “din mers” în timpul execuției (imperativ).
- Ușor de înțeles, intuitiv, foarte popular în cercetare și prototipare.
- API familiar cu Python și suport excelent pentru GPU (`cuda`) și Apple MPS (Metal).

### 🔹 **TensorFlow**
- Framework dezvoltat de Google.
- Inițial bazat pe **computație statică** (graf de execuție declarat înainte de rulare), acum oferă și mod dinamic prin `tf.function`.
- Integrare puternică cu ecosistemul Google (Colab, TPU, Keras).
- Folosit frecvent în producție, dar mai puțin intuitiv pentru experimente rapide.

| Aspect | PyTorch | TensorFlow |
|--------|----------|------------|
| Sintaxă | Pythonic, intuitivă | Bazată pe grafuri și Keras |
| Execuție | Dinamică (define-by-run) | Statică sau semi-dinamică |
| Curba de învățare | Simplă | Mai abruptă |
| Utilizare tipică | Cercetare, prototipare | Producție, deploy |
| Compatibilitate GPU | CUDA / MPS | CUDA / TPU |
| Ecosistem | TorchVision, TorchRL, Lightning | Keras, TF Agents, TFX |

> 💬 În laborator vom folosi **PyTorch**, deoarece oferă control complet asupra antrenării și este mai ușor de explicat pas cu pas.

## 💻 4️⃣ Detectare automată device

În codul laboratorului se detectează automat resursa optimă disponibilă (CPU, GPU CUDA sau MPS pe Mac):

```python
if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

print(f"Using device: {device}")

```

---

## 🧠 5️⃣ Sfaturi pentru rulare eficientă

- Folosește **CartPole-v1** pentru rezultate rapide (antrenare în 2–3 minute).  
- Nu depăși **200–300 episoade** pentru test.  
- Folosește **batch-uri mici (32–64)** pentru a evita blocarea procesorului.  
- Dacă folosești un **Mac ARM**, `MPS` poate fi mai lent decât `CPU` pentru modele mici — testează ambele opțiuni.  
- Înlocuiește `plt.show()` cu `plt.savefig()` în notebook pentru a evita blocajele grafice.


## 📚 6️⃣ Resurse utile

- *Mnih et al. (2015): [Human-level control through deep reinforcement learning](https://www.nature.com/articles/nature14236)*  
  Articolul original DeepMind care introduce algoritmul **Deep Q-Network (DQN)**.

- [PyTorch Reinforcement Learning Documentation](https://docs.pytorch.org/tutorials/intermediate/reinforcement_q_learning.html)  
  Documentația oficială PyTorch – include exemple de implementare a rețelelor neuronale și suport GPU.

- [OpenAI Gymnasium Environments](https://gymnasium.farama.org/)  
  Biblioteca standard pentru medii de antrenament în RL (CartPole, LunarLander, etc.).

- [DeepMind x UCL RL Lectures](https://www.deepmind.com/learning-resources)  
  Seria de prelegeri video gratuite despre fundamentele Reinforcement Learning.

- [Stable-Baselines3](https://stable-baselines3.readthedocs.io/en/master/)  
  Framework modern pentru antrenarea rapidă a agenților DQN, PPO, A2C, etc.

> 💡 Recomandare: începeți cu implementările proprii din laborator, apoi comparați performanța cu agenții predefiniți din `stable-baselines3`.
