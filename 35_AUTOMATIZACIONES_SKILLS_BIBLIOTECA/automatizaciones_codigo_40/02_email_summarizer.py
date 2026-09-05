"""Resume un email y extrae acciones sin ocultar los datos que faltan.

Uso rapido:
    python 02_email_summarizer.py --demo
    echo '{"subject":"...", "body":"..."}' | python 02_email_summarizer.py

La version local no necesita una API. Hace una primera clasificacion
determinista para que el alumno pueda probar el flujo y comprobar la salida.
En produccion se puede sustituir `build_summary` por una llamada a un modelo,
manteniendo la misma entrada, salida y validaciones.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from typing import Any


REQUIRED_FIELDS = ("body",)
ACTION_PATTERN = re.compile(
    r"(?:^|\s)(?:accion|acción|tarea|pendiente|hacer|necesito|please|need to)\b[:\s-]*(.+)",
    re.IGNORECASE,
)


def validate_email(data: dict[str, Any]) -> dict[str, str]:
    """Devuelve los campos normalizados o lanza un error explicable."""
    if not isinstance(data, dict):
        raise ValueError("La entrada debe ser un objeto JSON.")

    missing = [field for field in REQUIRED_FIELDS if not str(data.get(field, "")).strip()]
    if missing:
        raise ValueError(f"Faltan campos obligatorios: {', '.join(missing)}.")

    return {
        "id": str(data.get("id", "demo-email")).strip(),
        "sender": str(data.get("sender", "desconocido")).strip(),
        "subject": str(data.get("subject", "Sin asunto")).strip(),
        "body": " ".join(str(data["body"]).split()),
    }


def split_sentences(text: str) -> list[str]:
    return [part.strip() for part in re.split(r"(?<=[.!?])\s+", text) if part.strip()]


def extract_actions(text: str) -> list[str]:
    """Extrae frases que parecen pedir una tarea, sin inventar ninguna."""
    actions: list[str] = []
    for line in re.split(r"[\n.;!?]+", text):
        clean = line.strip(" -*\t")
        match = ACTION_PATTERN.search(clean)
        if match:
            action = match.group(1).strip(" -*")
            if action and action not in actions:
                actions.append(action)
    return actions[:5]


def build_summary(email: dict[str, str]) -> str:
    """Crea un resumen reproducible para la demo local."""
    sentences = split_sentences(email["body"])
    if not sentences:
        return "El email no contiene texto suficiente para resumirlo."
    first = " ".join(sentences[:2])
    return first[:360].rstrip() + ("..." if len(first) > 360 else "")


def run(data: dict[str, Any]) -> dict[str, Any]:
    """Procesa un email y devuelve siempre una estructura apta para n8n."""
    try:
        email = validate_email(data)
    except ValueError as error:
        return {
            "ok": False,
            "status": "needs_review",
            "error": "invalid_input",
            "message": str(error),
            "actions": [],
        }

    actions = extract_actions(email["body"])
    return {
        "ok": True,
        "status": "processed",
        "email_id": email["id"],
        "sender": email["sender"],
        "subject": email["subject"],
        "summary": build_summary(email),
        "actions": actions,
        "action_count": len(actions),
        "needs_human_review": not bool(actions),
    }


def demo_payload() -> dict[str, str]:
    return {
        "id": "demo-001",
        "sender": "ana@ejemplo.com",
        "subject": "Entrega del proyecto",
        "body": "La primera version esta lista para revisar. Accion: confirmar la fecha de entrega. Necesito que alguien compruebe el enlace antes del viernes.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Resume emails y extrae acciones.")
    parser.add_argument("--demo", action="store_true", help="ejecuta un caso de prueba incluido")
    args = parser.parse_args()

    if args.demo:
        payload = demo_payload()
    else:
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as error:
            print(json.dumps({"ok": False, "status": "needs_review", "error": "invalid_json", "message": str(error)}, ensure_ascii=False))
            return 1

    print(json.dumps(run(payload), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
