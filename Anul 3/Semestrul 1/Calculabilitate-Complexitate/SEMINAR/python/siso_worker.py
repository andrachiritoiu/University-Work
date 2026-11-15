"""Proces separat pentru demonstratii SISO cu buget de timp extern."""
import contextlib
import io
import json
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from universal import universal


def main():
    data = json.load(sys.stdin)
    # Limitele procesului sunt ale demo-ului, nu ale modelului matematic.
    try:
        import resource
        resource.setrlimit(resource.RLIMIT_CPU, (3, 3))
        resource.setrlimit(resource.RLIMIT_AS, (384 * 1024**2, 384 * 1024**2))
    except (ImportError, ValueError, OSError):
        pass
    class QuietOutput(io.TextIOBase):
        def write(self, text): return len(text)
    try:
        with contextlib.redirect_stdout(QuietOutput()), contextlib.redirect_stderr(QuietOutput()):
            answer = universal(data["source"], data["input"])
        if len(answer) > 10000:
            result = {"status": "budget", "message": "Rezultat prea lung pentru demonstratie."}
        else:
            result = {"status": "returned", "output": answer, "message": "Functia main a returnat un sir ASCII."}
    except BaseException as exc:
        result = {"status": "undefined", "message": type(exc).__name__ + ": " + str(exc)[:300]}
    print(json.dumps(result, ensure_ascii=True))


if __name__ == "__main__":
    main()
