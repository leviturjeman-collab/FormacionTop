#!/usr/bin/env bash
# Uses libpq PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD; never prints password.
set -euo pipefail
: "${PGDATABASE:?Set PGDATABASE}"
command -v pg_dump >/dev/null
command -v pg_restore >/dev/null
folder="${1:-./backups}"
umask 077
mkdir -p "$folder"
file="$folder/backup-$(date -u +%Y%m%dT%H%M%SZ)-$$.dump"
tmp="$file.partial"
trap 'rm -f -- "$tmp"' EXIT
pg_dump --format=custom --file="$tmp"
test -s "$tmp"
pg_restore --list "$tmp" >/dev/null
mv -- "$tmp" "$file"
echo "Archive created and readable: $file"
echo "Restore test still required in a separate disposable database before treating this as a proven backup."
