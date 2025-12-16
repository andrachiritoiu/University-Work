#ex1
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

np.random.seed(42)

p = 0.3
m = 10
lam_poisson = 20
lam_exp = 1.0
a, b = 0, 10

# Cheie: Nume, Valoare: (Funcție Generare, Medie Teoretică, Varianță Teoretică)
distributii = {
    "Bernoulli": (
        lambda n: np.random.binomial(1, p, n),
        p,
        p * (1 - p)
    ),
    "Binomiala": (
        lambda n: np.random.binomial(m, p, n),
        m * p,
        m * p * (1 - p)
    ),
    "Geometrica": (
        # Numpy geometric este numărul de încercări (1, 2, ...)
        lambda n: np.random.geometric(p, n),
        1 / p,
        (1 - p) / (p ** 2)
    ),
    "Poisson": (
        lambda n: np.random.poisson(lam_poisson, n),
        lam_poisson,
        lam_poisson
    ),
    "Uniforma": (
        lambda n: np.random.uniform(a, b, n),
        (a + b) / 2,
        ((b - a) ** 2) / 12
    ),
    "Exponentiala": (
        # Numpy foloseste scale = 1/lambda
        lambda n: np.random.exponential(1 / lam_exp, n),
        1 / lam_exp,
        1 / (lam_exp ** 2)
    )
}
import matplotlib as plt
import numpy as np

def cerinta_1_si_2_LLN():
    # N merge pana la 100.000 conform
    # Generăm o singură dată un eșantion mare și folosim sume cumulative
    # pentru a simula evoluția erorii pas cu pas (mult mai rapid decât buclă).
    N_max = 100000
    n_values = np.arange(1, N_max + 1)

    fig, axes = plt.subplots(3, 2, figsize=(15, 12))
    axes = axes.flatten()

    for i, (nume, (gen_func, mu_theo, var_theo)) in enumerate(distributii.items()):
        sigma_theo = np.sqrt(var_theo)
        print(f"{nume}: Mu={mu_theo:.4f}, Var={var_theo:.4f}")

        X = gen_func(N_max)

        # Calculăm mediile parțiale (Running Mean)
        # Suma cumulativă / numărul de elemente
        medii_partiale = np.cumsum(X) / n_values

        # Calculăm eroarea absolută față de media teoretică
        eroare_medie = np.abs(medii_partiale - mu_theo)

        ax = axes[i]
        # Plotăm doar 1 din 100 puncte pentru a nu supraîncărca graficul, dar păstrăm trendul
        step = 100
        ax.plot(n_values[::step], eroare_medie[::step], label=f'Eroare |X_n - {mu_theo}|', color='blue', alpha=0.7)

        # Estimare margine conform Cebishev/LLN (Opțional vizual, descreștere cu 1/sqrt(n))
        # ax.plot(n_values[::step], 3*sigma_theo/np.sqrt(n_values[::step]), 'r--', label='Bound (heuristic)')

        ax.set_title(f"{nume} (LLN)")
        ax.set_xlabel("N (Număr simulări)")
        ax.set_ylabel("Eroare absolută")
        ax.set_yscale('log')  # Scară logaritmică pentru a vedea convergența mai bine
        ax.legend()
        ax.grid(True, which="both", ls="-", alpha=0.4)

    plt.tight_layout()
    plt.show()


def cerinta_3_CLT():
    print("\n--- CERINȚA #3: Teorema Limită Centrală (CLT) ---")

    K = 10000  # Numărul de puncte din histogramă
    N_esantion = 1000  # Dimensiunea eșantionului pe care facem media

    fig, axes = plt.subplots(3, 2, figsize=(15, 12))
    axes = axes.flatten()

    x_pdf = np.linspace(-4, 4, 1000)
    y_pdf = norm.pdf(x_pdf, 0, 1)  # Normala Standard N(0,1)

    for i, (nume, (gen_func, mu, var)) in enumerate(distributii.items()):
        sigma = np.sqrt(var)

        # Generăm matricea (K, N)

        data = gen_func(K * N_esantion).reshape(K, N_esantion)
        means = np.mean(data, axis=1)  # Media fiecărui set de N simulări

        # Z = sqrt(N) * (Mean_N - mu) / sigma
        Z = (np.sqrt(N_esantion) / sigma) * (means - mu)

        ax = axes[i]
        ax.hist(Z, bins=60, density=True, alpha=0.6, color='green', label='Simulare CLT')

        # Suprapunere densitate N(0,1) [cite: 56]
        ax.plot(x_pdf, y_pdf, 'r-', lw=2, label='N(0, 1) Teoretic')

        ax.set_title(f"{nume} (CLT, N={N_esantion})")
        ax.legend()
        ax.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.show()


cerinta_1_si_2_LLN()
cerinta_3_CLT()

# lab 9