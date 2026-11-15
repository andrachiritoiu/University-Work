"""Evaluator SISO, adaptat dupa ideea lui MacCormick, cap. 6, figura 6.1.

Prima functie de la nivelul modulului este intrarea programului.
Codul, intrarea si rezultatul sunt siruri ASCII. exec foloseste un namespace
explicit, pentru a functiona consecvent in Python 3.
"""
import ast


def universal(progString, inString):
    if not isinstance(progString, str) or not progString.isascii():
        raise ValueError("Source must be an ASCII string")
    if not isinstance(inString, str) or not inString.isascii():
        raise ValueError("Input must be an ASCII string")
    tree = ast.parse(progString)
    main = next((node.name for node in tree.body if isinstance(node, ast.FunctionDef)), None)
    if main is None:
        raise ValueError("No main function")
    namespace = {"__name__": "__siso__"}
    exec(compile(tree, "<SISO>", "exec"), namespace)
    answer = namespace[main](inString)
    if not isinstance(answer, str) or not answer.isascii():
        raise ValueError("Main did not return an ASCII string")
    return answer


if __name__ == "__main__":
    import argparse
    from pathlib import Path
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("program", type=Path)
    p.add_argument("input", nargs="?", default="")
    a = p.parse_args()
    print(universal(a.program.read_text(), a.input))
