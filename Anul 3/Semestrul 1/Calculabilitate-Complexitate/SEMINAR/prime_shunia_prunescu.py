"""Demo pentru Shunia--Prunescu, arXiv:2610.13365v1 (9 octombrie 2026).

Pornire: python prime_shunia_prunescu.py --serve
Calcul:  python prime_shunia_prunescu.py --n 4
Secventa: python prime_shunia_prunescu.py --sequence 8

Pune acest fisier langa demo_curs2.py si inlocuieste demo/index.html.
Functiile factorial, G0, G1, nu2_binom, nth_prime si odd_primes sunt
transcrise din anexa C a lucrarii. Formulele si ordinea calculelor sunt
pastrate. Codul de afisare, masurare si servire a paginii este adaugat.

Cele 166 de operatii apartin programului aritmetic din anexa B.3,
cu reutilizarea registrelor; nu sunt un numar de instructiuni Python.
Implementarea din anexa C.2 foloseste pow modular, &, bit_count si o
bucla pentru factorial. Nu necesita biblioteci externe (Python >= 3.10).

Sursa: Joseph M. Shunia, Mihai Prunescu, Short Recurrences and
Straight-Line Programs for Primes. https://arxiv.org/abs/2610.13365
Lucrarea este distribuita sub licenta CC BY 4.0.
"""
import argparse
from functools import partial
import inspect
import json
from pathlib import Path
import subprocess
import sys
import time
import webbrowser


# Anexa C.2: programul autorilor, cu aceleasi expresii.
def factorial(n):
    f = 1
    for i in range(2, n + 1):
        f *= i
    return f


def G0(x, k):
    if k == 0:
        return 0
    return (x**k - 1) // (x - 1)


def G1(x, m):
    # m is the number of terms; m >= 1
    z = x**m
    num = ((m - 1)*x*z + x) - m*z
    return num // (x - 1)**2


def nu2_binom(upper, lower):
    other = upper - lower
    return (lower.bit_count()
            + other.bit_count()
            - upper.bit_count())


def nth_prime(n):
    C = n*(n + 1)
    F = factorial(n + 1)
    h = (n + 2)**2
    D = 1 << h
    H = 1 << (n + 1)
    B = D*H
    A = B**(C + 1)
    E = A**(n + 1)
    U = G0(B, C + 1)
    mod = E*E
    R = (mod + 1 - pow(A - 1, E*F, mod))//E - F*A
    kappa = (D + F - 1)//F
    mask = D*(H - 1)*G0(B, (C + 1)*(n + 1))
    Q = ((kappa*R*G1(B, C + 1)) & mask)//D
    W = Q % (A - 1)
    Delta = ((A - B + 1)*W) % A - B*B*G0(B, n - 1)
    P = U - 1 - B - (((Delta + (H - 1)*U) & (H*U))//H)
    S = (P*U) % A
    val = nu2_binom(S + (2*H - n)*U, H*U)
    return C + 1 - val


# Anexa C.1: generatorul autorilor (primele impare).
def odd_primes():
    T = 8
    while True:
        p = (T & -T).bit_length() - 1
        yield p
        L = T.bit_length() - 2
        M = (1 << (L * p)) - 1
        U = T * (M // ((1 << L) - 1))
        V = M // ((1 << p) - 1)
        T = U - (U & V)


ROOT = Path(__file__).resolve().parent
DIRECT_MAX = 5
SEQUENCE_MAX = 8
PAPER = "https://arxiv.org/abs/2610.13365"
REGISTER_LABELS = {
    "C": "limita candidatilor n(n+1)", "F": "(n+1)!",
    "h": "exponentul latimii campului", "D": "2^h", "H": "2^(n+1)",
    "B": "baza unui camp", "A": "bloc de candidati", "E": "baza pentru impachetare",
    "U": "repunit in baza B", "mod": "modulul E^2", "R": "reciproce impachetate",
    "kappa": "factor de scalare", "mask": "masca de campuri", "Q": "campuri selectate",
    "W": "informatii despre divizori", "Delta": "marcajele compuselor",
    "P": "indicatorii numerelor prime", "S": "numarari prefixate", "val": "valuatia binomiala"
}


def positive_integer(value, maximum):
    # Do not silently truncate fractions or accept booleans as an index.
    if isinstance(value, bool) or not isinstance(value, int):
        raise ValueError("Indicele trebuie sa fie un numar intreg.")
    if not 1 <= value <= maximum:
        raise ValueError(f"Pentru demo, valoarea trebuie sa fie intre 1 si {maximum}.")
    return value


def evaluate_packed(n):
    positive_integer(n, DIRECT_MAX)
    registers = {}

    def trace(frame, event, arg):
        if frame.f_code is nth_prime.__code__ and event in {"line", "return"}:
            for name, value in frame.f_locals.items():
                if name in REGISTER_LABELS and name not in registers:
                    registers[name] = {"name": name, "label": REGISTER_LABELS[name],
                                       "bits": value.bit_length(),
                                       "value": str(value) if value.bit_length() <= 40 else None}
        return trace

    previous = sys.gettrace()
    started = time.perf_counter()
    try:
        sys.settrace(trace)
        value = nth_prime(n)
    finally:
        sys.settrace(previous)
    elapsed = time.perf_counter() - started
    return {"status": "complete", "mode": "direct", "n": n, "prime": value,
            "seconds": elapsed, "paper_operations": 166,
            "max_register_bits": max(row["bits"] for row in registers.values()),
            "registers": list(registers.values())}


def evaluate_sequence(count):
    positive_integer(count, SEQUENCE_MAX)
    started = time.perf_counter()
    gen = odd_primes()
    rows = [{"index": 1, "prime": 2, "state_bits": None, "state": None,
             "binary": None, "period": None}]
    try:
        for index in range(2, count + 1):
            prime = next(gen)
            state = gen.gi_frame.f_locals["T"]
            bits = state.bit_length()
            preview = (bin(state)[2:] if bits <= 64 else
                       bin(state >> (bits - 32))[2:] + " ... " + format(state & ((1 << 32) - 1), "032b"))
            rows.append({"index": index, "prime": prime, "state_bits": bits,
                         "state": str(state) if bits <= 40 else None,
                         "binary": preview, "period": bits - 2})
    finally:
        gen.close()
    return {"status": "complete", "mode": "sequence", "count": count, "rows": rows,
            "seconds": time.perf_counter() - started, "paper_operations": 99}


def source_info():
    return {"paper": PAPER, "direct_max": DIRECT_MAX, "sequence_max": SEQUENCE_MAX,
            "direct_source": "\n\n".join(inspect.getsource(f).rstrip() for f in
                (factorial, G0, G1, nu2_binom, nth_prime)),
            "sequence_source": inspect.getsource(odd_primes)}


def run_worker(data, timeout=20):
    try:
        proc = subprocess.run([sys.executable, "-I", str(Path(__file__).resolve()), "--worker"],
                              input=json.dumps(data), capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        return {"status": "budget", "message": "Bugetul de timp al demonstratiei a expirat. Alege o intrare mai mica."}
    if proc.returncode != 0:
        return {"status": "budget", "message": "Calculul s-a oprit la o limita a demonstratiei."}
    return json.loads(proc.stdout)


def worker_main():
    try:
        try:
            import resource
            resource.setrlimit(resource.RLIMIT_AS, (512 * 1024**2, 512 * 1024**2))
        except (ImportError, ValueError, OSError):
            pass
        data = json.load(sys.stdin)
        if not isinstance(data, dict):
            raise ValueError("Cererea trebuie sa fie un obiect JSON.")
        mode = data.get("mode", "direct")
        if mode == "direct":
            result = evaluate_packed(data["n"])
        elif mode == "sequence":
            result = evaluate_sequence(data["n"])
        else:
            raise ValueError("Mod de demonstratie necunoscut.")
        print(json.dumps(result))
    except (ValueError, KeyError, TypeError, MemoryError) as exc:
        print(json.dumps({"status": "error", "message": str(exc)}))


def serve(port, open_browser):
    # Reuse the existing server, keeping all previously supplied demonstrations.
    if not (ROOT / "demo_curs2.py").is_file():
        raise ValueError("Pune prime_shunia_prunescu.py in acelasi folder cu demo_curs2.py.")
    sys.path.insert(0, str(ROOT))
    import demo_curs2

    class PrimeHandler(demo_curs2.Handler):
        def do_GET(self):
            if self.path == "/api/prime/info":
                self.respond(source_info())
            else:
                super().do_GET()

        def do_POST(self):
            if self.path != "/api/prime":
                return super().do_POST()
            try:
                origin = self.headers.get("Origin")
                current_port = self.server.server_port
                if origin and origin not in {f"http://127.0.0.1:{current_port}", f"http://localhost:{current_port}"}:
                    self.respond({"error": "Cererea trebuie sa vina din pagina locala."}, 403)
                    return
                if self.headers.get("Content-Type", "").split(";", 1)[0] != "application/json":
                    raise ValueError("Cererea trebuie sa fie JSON.")
                size = int(self.headers.get("Content-Length", "0"))
                if not 0 < size <= 4096:
                    raise ValueError("Cerere prea mare.")
                data = json.loads(self.rfile.read(size))
                if not isinstance(data, dict):
                    raise ValueError("Cererea trebuie sa fie un obiect JSON.")
                mode = data.get("mode", "direct")
                if mode not in {"direct", "sequence"}:
                    raise ValueError("Mod necunoscut.")
                positive_integer(data.get("n"), DIRECT_MAX if mode == "direct" else SEQUENCE_MAX)
                self.respond(run_worker(data))
            except (ValueError, TypeError, KeyError) as exc:
                self.respond({"error": str(exc)}, 400)

    server = demo_curs2.ThreadingHTTPServer(("127.0.0.1", port), partial(PrimeHandler, directory=str(ROOT)))
    url = f"http://127.0.0.1:{port}/demo/index.html#prime"
    print(f"Demo Cursul 2 + prime: {url}\nOprire: Ctrl+C.", flush=True)
    if open_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    choices = parser.add_mutually_exclusive_group()
    choices.add_argument("--serve", action="store_true")
    choices.add_argument("--n", type=int, help="Calculeaza p_n (demo: n=1,...,5).")
    choices.add_argument("--sequence", type=int, help="Afiseaza primele k prime (demo: k=1,...,8).")
    choices.add_argument("--worker", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    try:
        if args.worker:
            worker_main()
        elif args.serve:
            serve(args.port, not args.no_browser)
        elif args.n is not None or args.sequence is not None:
            mode = "direct" if args.n is not None else "sequence"
            n = args.n if mode == "direct" else args.sequence
            positive_integer(n, DIRECT_MAX if mode == "direct" else SEQUENCE_MAX)
            result = run_worker({"mode": mode, "n": n})
            if result["status"] != "complete":
                parser.exit(1, result["message"] + "\n")
            if mode == "direct":
                print(f"p_{n} = {result['prime']}\nTimp Python: {result['seconds']:.4f} s")
                print(f"Cel mai mare registru observat: {result['max_register_bits']} biti")
            else:
                print([row["prime"] for row in result["rows"]])
        else:
            parser.print_help()
    except (ValueError, OSError) as exc:
        parser.exit(2, str(exc) + "\n")


if __name__ == "__main__":
    main()
