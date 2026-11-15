# 📘 Laborator 6 — Advanced Value-Based RL (Deep Q-Learning Extensions)

În acest laborator explorăm cele mai importante extensii moderne ale algoritmului DQN.  
Scopul este să înțelegem cum putem construi agenți **mai stabili, mai rapizi și mai inteligenți** prin îmbunătățiri aduse modului de învățare, explorare și estimare a valorilor.

---

## 🎯 Obiective

- Să implementăm și să comparăm cele mai populare variante avansate ale DQN.  
- Să înțelegem rolul fiecărei componente în stabilitatea și performanța agentului.  
- Să folosim TensorFlow/Keras pentru a construi rețele neurale moderne folosite în RL.

---

## 🧩 Algoritmii studiați

### **1. Dueling DQN**  
Separă estimarea valorii stării de estimarea avantajului acțiunilor → învață mai eficient în stări „ne-informative”.

### **2. Prioritized Experience Replay (PER)**  
Tranzițiile importante (cu TD-error mare) sunt eșantionate mai des → convergență mai rapidă.

### **3. Noisy DQN**  
Înlocuiește epsilon-greedy cu explorare prin zgomot în parametrii rețelei → explorare învățabilă.

### **4. Multi-Step DQN (N-step returns)**  
Propagă reward-ul mai repede, combinând beneficii de la TD și Monte Carlo.

### **5. C51 Distributional DQN**  
Învață distribuția completă a valorilor viitoare, nu doar media → agent mai robust.

### **6. Rainbow DQN**  
Combină toate tehnicile anterioare:
- Double DQN  
- Dueling  
- PER  
- Multi-step  
- Noisy Nets  
- C51  

→ unul dintre cei mai puternici algoritmi value-based.

---