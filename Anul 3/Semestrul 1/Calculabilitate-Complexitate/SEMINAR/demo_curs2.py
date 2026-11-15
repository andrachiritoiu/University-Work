"""Demo-uri Cursul 2. Ruleaza: python demo_curs2.py. Oprire: Ctrl+C."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import subprocess
import sys
import webbrowser

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "python"))
import loop
import pr
from cantor_fibonacci import fibonacci_rows, unpair
from ackermann_iterativ import ackermann


SISO_EXAMPLES = {
    "gaga": {"name": "Cauta GAGA", "input": "GTTGAGA", "source": "def containsGAGA(inString):\n    return 'yes' if 'GAGA' in inString else 'no'\n"},
    "length": {"name": "Lungimea textului", "input": "Cantor", "source": "def length(inString):\n    return str(len(inString))\n"},
    "addition": {"name": "Adunare simulata in Python", "input": "3 4", "source": "def add(inString):\n    x, y = [int(v) for v in inString.split()]\n    if x < 0 or y < 0:\n        raise ValueError('natural numbers required')\n    z = x\n    for _ in range(y):\n        z += 1\n    return str(z)\n"},
    "helper": {"name": "Main foloseste o functie ajutatoare", "input": "abc", "source": "def main(inString):\n    return twice(inString)\n\ndef twice(s):\n    return s + s\n"},
    "infinite": {"name": "Bucla infinita", "input": "", "source": "def forever(inString):\n    while True:\n        pass\n"},
    "exception": {"name": "Exceptie", "input": "abc", "source": "def faulty(inString):\n    return str(1 // 0)\n"},
    "number": {"name": "Rezultat care nu este SISO", "input": "abc", "source": "def number(inString):\n    return 42\n"},
}
SISO_EXAMPLES["nested"] = {"name": "Evaluatorul ruleaza un evaluator", "source": (ROOT / "python/universal_siso.py").read_text(),
    "input": json.dumps({"program": SISO_EXAMPLES["gaga"]["source"], "input": "GTTGAGA"})}


def run_siso(source, instring, timeout=1.5):
    try:
        proc = subprocess.run([sys.executable, "-I", str(ROOT / "python/siso_worker.py")],
                              input=json.dumps({"source": source, "input": instring}), text=True,
                              capture_output=True, timeout=timeout, cwd=ROOT)
    except subprocess.TimeoutExpired:
        return {"status": "budget", "message": "Buget de timp epuizat. Acest test nu decide daca programul se opreste."}
    if proc.returncode != 0:
        return {"status": "budget", "message": "Procesul s-a oprit la o limita a demonstratiei."}
    try:
        return json.loads(proc.stdout)
    except json.JSONDecodeError:
        return {"status": "undefined", "message": "Programul nu a produs un rezultat SISO in acest test."}


def search_diophantine(name, limit):
    predicates = {"pell": lambda x, y: x > 1 and y > 0 and x*x - 2*y*y == 1,
                  "circle": lambda x, y: x*x + y*y == 25,
                  "three": lambda x, y: x*x + y*y == 3}
    if name not in predicates:
        raise ValueError("Exemplu necunoscut.")
    def integer(n): return n // 2 if n % 2 == 0 else -(n + 1) // 2
    tested = []
    for code in range(limit):
        a, b = unpair(code)
        x, y = integer(a), integer(b)
        if code < 25:
            tested.append([code, x, y])
        if predicates[name](x, y):
            return {"status": "found", "solution": [x, y], "tested": code + 1, "prefix": tested,
                    "message": "Am gasit o solutie care indeplineste conditia."}
    return {"status": "budget", "tested": limit, "prefix": tested,
            "message": "Nicio solutie in perechile testate. Cautarea finita nu demonstreaza inexistenta unei solutii."}


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

    def respond(self, data, status=200):
        payload = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if self.path == "/api/examples":
            self.respond({"loop": loop.EXAMPLES, "siso": SISO_EXAMPLES,
                          "pr": {k: v[0] for k, v in pr.CATALOG.items()}})
        elif self.path == "/":
            self.send_response(302)
            self.send_header("Location", "/demo/index.html")
            self.end_headers()
        else: super().do_GET()

    def do_POST(self):
        try:
            origin = self.headers.get("Origin")
            port = self.server.server_port
            if origin and origin not in {f"http://127.0.0.1:{port}", f"http://localhost:{port}"}:
                self.respond({"error": "Cererea trebuie sa vina din pagina locala."}, 403)
                return
            if self.headers.get("Content-Type", "").split(";", 1)[0] != "application/json":
                raise ValueError("Cererea trebuie sa fie JSON.")
            size = int(self.headers.get("Content-Length", "0"))
            if not 0 < size <= 30000:
                raise ValueError("Cerere prea mare.")
            data = json.loads(self.rfile.read(size))
            route = self.path
            if route == "/api/loop":
                source = data["source"]
                if not isinstance(source, str) or len(source) > 10000:
                    raise ValueError("Program prea lung.")
                program = loop.parse(source)
                inputs = [int(x) for x in data.get("inputs", "").split()]
                if len(inputs) > 30 or any(x < 0 or x.bit_length() > 2048 for x in inputs):
                    raise ValueError("Intrarile depasesc limitele demo-ului.")
                result = loop.run(program, inputs, max_steps=20000)
                measured, timer = loop.instrument(program)
                result.update({"instrumented": "\n".join(loop.pretty(measured)), "timer": timer,
                               "python": loop.translate(program), "instrumented_depth": loop.depth(measured)})
                if result["status"] == "complete":
                    check = loop.run(measured, inputs, max_steps=80000, trace_limit=0)
                    result["timer_value"] = check["registers"][timer] if check["status"] == "complete" else None
                self.respond(result)
            elif route == "/api/fibonacci":
                self.respond({"rows": fibonacci_rows(int(data["n"]))})
            elif route == "/api/diophantine":
                limit = int(data.get("limit", 3000))
                if not 1 <= limit <= 20000: raise ValueError("Bugetul este intre 1 si 20000.")
                self.respond(search_diophantine(data["name"], limit))
            elif route == "/api/pr":
                x = int(data.get("x", 5))
                if not 0 <= x <= 20: raise ValueError("Demo: x este intre 0 si 20.")
                label, term = pr.CATALOG[data["name"]]
                e = pr.encode(term)
                budget = pr.Budget()
                try:
                    value = pr.universal_pr(e, x, budget)
                    status, message = "complete", "Descrierea a fost evaluata."
                except pr.BudgetExceeded as exc:
                    value, status, message = None, "budget", str(exc)
                self.respond({"name": label, "code": pr.code_label(e), "bits": e.bit_length(),
                              "output": str(value) if value is not None else None,
                              "status": status, "message": message, "calls": budget.calls})
            elif route == "/api/universal":
                source, input_string = data["source"], data.get("input", "")
                if not isinstance(source, str) or len(source) > 10000 or not isinstance(input_string, str) or len(input_string) > 10000:
                    raise ValueError("Text prea lung.")
                self.respond(run_siso(source, input_string))
            elif route == "/api/ackermann":
                m, n = int(data["m"]), int(data["n"])
                if not (0 <= m <= 3 and 0 <= n <= 6): raise ValueError("Demo: m<=3, n<=6.")
                value, steps = ackermann(m, n)
                self.respond({"value": str(value), "steps": steps})
            else:
                self.respond({"error": "Ruta inexistenta."}, 404)
        except (ValueError, KeyError, TypeError, RecursionError, RuntimeError) as exc:
            self.respond({"error": str(exc)}, 400)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--port", type=int, default=8765)
    p.add_argument("--no-browser", action="store_true")
    a = p.parse_args()
    handler = partial(Handler, directory=str(ROOT))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", a.port), handler)
    except OSError as exc:
        p.exit(2, f"Nu pot porni serverul: {exc}\nOpreste demo-ul Cursului 1 sau foloseste --port 8766.\n")
    url = f"http://127.0.0.1:{a.port}/demo/index.html"
    print(f"Demo-uri Cursul 2: {url}\nOprire: Ctrl+C.", flush=True)
    if not a.no_browser: webbrowser.open(url)
    try: server.serve_forever()
    except KeyboardInterrupt: print("\nDemonstratiile s-au oprit.")
    finally: server.server_close()


if __name__ == "__main__": main()
