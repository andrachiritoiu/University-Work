"""Impacheteaza sursa si intrarea intr-un singur sir JSON ASCII."""
import json
from universal import universal


def universal_siso(inString):
    data = json.loads(inString)
    return universal(data["program"], data["input"])
