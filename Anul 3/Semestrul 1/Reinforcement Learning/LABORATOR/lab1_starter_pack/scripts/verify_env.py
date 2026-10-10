import sys, platform, importlib

print("=== Python & Platform ===")
print(f"Python: {sys.version}")
print(f"Platform: {platform.platform()}")

print("\n=== Packages ===")
for p in ["numpy", "pandas", "matplotlib", "sklearn", "gymnasium"]:
    try:
        m = importlib.import_module(p if p != "sklearn" else "sklearn")
        print(f"{p:12s}: OK (v{getattr(m,'__version__','?')})")
    except Exception as e:
        print(f"{p:12s}: MISSING/ERROR -> {e}")

try:
    import torch
    print(f"torch        : OK (v{torch.__version__})")
    import torch.cuda as tc
    print("CUDA available:", tc.is_available())
except Exception:
    print("torch        : not installed (optional)")

# Gym sanity check
try:
    import gymnasium as gym
    env = gym.make("CartPole-v1")
    obs, info = env.reset()
    print(f"Gym check OK: obs type={type(obs)}; action_space={env.action_space}")
    env.close()
except Exception as e:
    print("Gym check ERROR:", e)
