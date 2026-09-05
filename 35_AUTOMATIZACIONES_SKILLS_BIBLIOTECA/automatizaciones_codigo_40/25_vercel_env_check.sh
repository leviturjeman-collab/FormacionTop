#!/usr/bin/env bash
# Local required-variable check; never prints secret values.
set -euo pipefail
if [ "$#" -eq 0 ]; then echo "Usage: bash 25_vercel_env_check.sh VARIABLE_NAME [...]" >&2; exit 2; fi
missing=0
for name in "$@"; do
  if [[ ! "$name" =~ ^[A-Z_][A-Z0-9_]*$ ]]; then echo "Invalid variable name" >&2; exit 2; fi
  if [[ -z "${!name:-}" ]]; then echo "MISSING: $name" >&2; missing=1; else echo "PRESENT: $name"; fi
done
exit "$missing"
