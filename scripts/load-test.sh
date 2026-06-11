#!/usr/bin/env bash
set -euo pipefail

URL="${1:?Uso: bash scripts/load-test.sh <url> [solicitudes]}"
REQUESTS="${2:-500}"
CONCURRENCY="${CONCURRENCY:-20}"

echo "Enviando $REQUESTS solicitudes a $URL con concurrencia $CONCURRENCY"
seq "$REQUESTS" | xargs -P "$CONCURRENCY" -I {} curl -fsS -o /dev/null "$URL/health"
echo "Prueba terminada. Revisa: kubectl -n innovatech get hpa"
