#!/usr/bin/env sh
# ============================================================================
# seal-judge-tokens.sh — Stage & verify JWT + 5 judge tokens (POSIX shell)
# ----------------------------------------------------------------------------
# Purpose
#   - Validate the six required secrets (JWT_SECRET, JUDGE_1_TOKEN..JUDGE_5_TOKEN)
#     are present in the process environment (typically loaded from .env).
#   - Write a sealed manifest at scripts/.sealed-tokens.json containing only
#     token NAMES + SHA-256 hashes (NOT the values themselves).
#   - --generate prints 6 fresh secrets to stdout via openssl rand; never saved.
#
# Exit codes
#   0 — success
#   1 — one or more tokens missing from env
#   2 — duplicate token values detected
#   3 — token length below 32 chars
#
# Modes
#   --status   : print ALL_SEALED | PARTIAL | NONE
#   --verify   : validate tokens; if all 6 valid, write sealed manifest
#   --generate : print 6 fresh secrets to stdout; NEVER saved
#   (default)  : --verify
# ============================================================================
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MANIFEST_PATH="$SCRIPT_DIR/.sealed-tokens.json"

TOKEN_NAMES="JWT_SECRET JUDGE_1_TOKEN JUDGE_2_TOKEN JUDGE_3_TOKEN JUDGE_4_TOKEN JUDGE_5_TOKEN"

MODE="verify"
for arg in "$@"; do
    case "$arg" in
        --status)   MODE="status" ;;
        --verify)   MODE="verify" ;;
        --generate) MODE="generate" ;;
        --help|-h)
            sed -n '2,32p' "$0"
            exit 0
            ;;
        *) echo "Unknown flag: $arg" >&2; exit 64 ;;
    esac
done

# sha256_hex <string> -> lowercase hex digest
sha256_hex() {
    printf '%s' "$1" | openssl dgst -sha256 -hex | awk '{print $NF}'
}

# snapshot the process env into a temp file (avoids shell word-split on values)
SNAP="$(mktemp)"
trap 'rm -f "$SNAP"' EXIT
for name in $TOKEN_NAMES; do
    eval "val=\${$name-}"
    printf '%s\t%s\n' "$name" "$val" >> "$SNAP"
done

present_count() {
    awk -F'\t' 'NF==2 && $2 != "" {n++} END{print n+0}' "$SNAP"
}

status_label() {
    p=$(present_count)
    total=$(echo "$TOKEN_NAMES" | wc -w | tr -d ' ')
    if [ "$p" -eq 0 ]; then echo NONE; return; fi
    if [ "$p" -eq "$total" ]; then echo ALL_SEALED; return; fi
    echo PARTIAL
}

# --generate -----------------------------------------------------------------
if [ "$MODE" = "generate" ]; then
    echo "# Generated secrets — paste into .env. NEVER committed."
    echo "JWT_SECRET=$(openssl rand -hex 64)"
    i=1
    while [ "$i" -le 5 ]; do
        tok=$(openssl rand 32 | openssl base64 -A | tr '+/' '-_' | tr -d '=')
        echo "JUDGE_${i}_TOKEN=$tok"
        i=$((i + 1))
    done
    echo "# After pasting into .env, re-run this script with --verify"
    exit 0
fi

# --status -------------------------------------------------------------------
if [ "$MODE" = "status" ]; then
    p=$(present_count)
    total=$(echo "$TOKEN_NAMES" | wc -w | tr -d ' ')
    label=$(status_label)
    if [ -f "$MANIFEST_PATH" ]; then mf=yes; else mf=no; fi
    echo "STATUS=$label  PRESENT=$p/$total  MANIFEST=$mf"
    exit 0
fi

# --verify -------------------------------------------------------------------
# 1. presence
MISSING=""
while IFS= read -r name; do
    val=$(awk -F'\t' -v n="$name" '$1==n {print $2}' "$SNAP")
    if [ -z "$val" ]; then
        MISSING="$MISSING $name"
    fi
done <<EOF
$TOKEN_NAMES
EOF
if [ -n "$MISSING" ]; then
    echo "TOKENS_SEALED: no"
    echo "MISSING:$MISSING"
    echo "HINT: paste JWT_SECRET + JUDGE_1..5_TOKEN into .env, then re-run --verify"
    exit 1
fi

# 2. length
TOO_SHORT=""
while IFS= read -r name; do
    val=$(awk -F'\t' -v n="$name" '$1==n {print $2}' "$SNAP")
    # POSIX shell has no ${#var} portable across all shells; use expr fallback.
    len=$(printf '%s' "$val" | wc -c | tr -d ' ')
    # wc -c counts the trailing newline; subtract 1 for the actual char count.
    len=$((len - 1))
    if [ "$len" -lt 32 ]; then
        TOO_SHORT="$TOO_SHORT $name($len)"
    fi
done <<EOF
$TOKEN_NAMES
EOF
if [ -n "$TOO_SHORT" ]; then
    echo "TOKENS_SEALED: no"
    echo "TOO_SHORT:$TOO_SHORT"
    exit 3
fi

# 3. uniqueness
DUP_LINES=""
SEEN_FILE="$(mktemp)"
trap 'rm -f "$SNAP" "$SEEN_FILE"' EXIT
while IFS= read -r name; do
    val=$(awk -F'\t' -v n="$name" '$1==n {print $2}' "$SNAP")
    if grep -Fxq -- "$val" "$SEEN_FILE"; then
        DUP_LINES="$DUP_LINES $name"
    else
        printf '%s\n' "$val" >> "$SEEN_FILE"
    fi
done <<EOF
$TOKEN_NAMES
EOF
if [ -n "$DUP_LINES" ]; then
    echo "TOKENS_SEALED: no"
    echo "DUPLICATES:$DUP_LINES"
    exit 2
fi

# 4. build manifest (names + sha256 only — values NEVER written)
SEALED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
{
    echo "{"
    echo "  \"sealed_at\": \"$SEALED_AT\","
    echo "  \"schema_version\": 1,"
    echo "  \"mode\": \"verify\","
    echo "  \"count\": 6,"
    echo "  \"tokens\": {"
    first=1
    while IFS= read -r name; do
        val=$(awk -F'\t' -v n="$name" '$1==n {print $2}' "$SNAP")
        h=$(sha256_hex "$val")
        len=$(printf '%s' "$val" | wc -c | tr -d ' ')
        len=$((len - 1))
        if [ "$first" -eq 1 ]; then sep=""; first=0; else sep=","; fi
        printf '%s\n    "%s": { "sha256": "%s", "length": %s }' "$sep" "$name" "$h" "$len"
    done <<EOF
$TOKEN_NAMES
EOF
    echo ""
    echo "  }"
    echo "}"
} > "$MANIFEST_PATH"

echo "TOKENS_SEALED: yes"
echo "MANIFEST: $MANIFEST_PATH"
echo "SEALED_AT: $SEALED_AT"
exit 0