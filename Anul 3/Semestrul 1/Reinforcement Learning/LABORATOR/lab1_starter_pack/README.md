# Laboratorul 1 — Setup mediu de lucru + Recapitulare ML (Supervised & Unsupervised) + Intro Gymnasium

**Durată:** 2h  

**Obiectiv:** Setarea unui mediu de lucru stabil ( Python - local sau Google Colab)

**Ce conține?:**
- un notebook de verificare pentru mediul creat;
- exerciții recapitulative de inteligență artificială (clasificare, regresie, clustering, PCA);
- un scurt demo cu `gymnasium` (fără algoritmi RL încă).

---

## 0. Mediul de lucru
1. **Google Colab** (recomandat pentru simplitate)
   - Upload fișiere în Google Colab.
   - Rulează secțiunea „Colab Setup” din notebook-ul `lab1_setup.ipynb`.
2. **Local (Windows/Mac/Linux)**
   - **Conda** (recomandat) sau **venv** (Python 3.10+).

---

## 1. Setup cu Conda/Mamba (recomandat)

```bash
# Clonare / copiere arhivă
cd lab1_starter_pack

# Creează mediul
conda env create -f environment.yml

# Activează mediul
conda activate rl-intro-lab1

# Verifică instalarea
python scripts/verify_env.py
```

### Notă CUDA (opțional)
Dacă aveți GPU NVIDIA și doriți PyTorch cu suport CUDA, instalați ulterior potrivit versiunii voastre:
- Consultați: https://pytorch.org/get-started/locally/ (alegeți combinația Python/CUDA corespunzătoare)
- Pentru laboratorul 1 și pentru majoritatea laboratoarelor puteți utiliza PyTorch / TensorFlow / etc. doar pe CPU.

### Notă pentru Apple Silicon (M1/M2/M3/M4 - nu, nu sunt linii de metrou) sau orice stație de lucru cu arhitectura ARM pentru procesor
`torch` CPU funcționează, dar pentru performanță mai bună puteți folosi iarăși ghidul PyTorch (versiune pentru macOS/Metal). Nu este obligatoriu. 

---

## 2. Setup cu venv (alternativă)

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

python scripts/verify_env.py
```

> Dacă pe Windows apar erori la `box2d-py`/`swig`, **ignorați deocamdată** sau comentați pachetul din `requirements.txt`.
> Pentru laboratorul 1 nu avem nevoie de Box2D.

---

## 3. Rulare notebook-uri

```bash
jupyter notebook
# deschideți: lab1_setup.ipynb, lab1_ml_recap.ipynb, lab1_gym_intro.ipynb
```

### Ordinea recomandată
1. `lab1_setup.ipynb` — verificare versiuni + test rapid `gymnasium` (random policy).
2. `lab1_ml_recap.ipynb` — exerciții practice:
   - Clasificare (Iris, Digits)
   - Regresie (California Housing)
   - Clustering (KMeans pe Iris)
   - PCA (vizualizare 2D/3D)
3. `lab1_gym_intro.ipynb` — lucrăm cu un mediu Gym:
   - `CartPole-v1`: `reset`, `step`, `render(mode="rgb_array")`
   - spații de acțiuni și observații
   - rulare agent random.

---

## 4. Troubleshooting (cele mai frecvente)
- **ImportError: No module named X** → Re-activare mediu + `pip install -r requirements.txt`
- **Box2D/SWIG errors (Windows)** → comentați `box2d-py` din `requirements.txt`. Nu e necesar azi. Ce este Box2D? Un engine pentru fizica din jocuri, va fi folosit în cadrul laboratoarelor la implementarea mediilor de lucru. Mai multe referințe aici: https://github.com/erincatto/box2d
- **Colab: render Gym** → folosiți `render_mode="rgb_array"` și afișați frame-urile cu `matplotlib`.
- **Jupyter nu pornește** → `python -m pip install notebook jupyterlab`. Incantații???

---



Succes! 🎓
