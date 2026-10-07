#!/usr/bin/env bash
# Called only by the website publishing job; no VPS admin or Docker access.
set -euo pipefail
: "${WEBSITE_SSH_HOST:?Missing WEBSITE_SSH_HOST}"
: "${WEBSITE_SSH_USER:?Missing WEBSITE_SSH_USER}"
: "${WEBSITE_SSH_PRIVATE_KEY:?Missing WEBSITE_SSH_PRIVATE_KEY}"
: "${WEBSITE_SSH_KNOWN_HOSTS:?Missing WEBSITE_SSH_KNOWN_HOSTS}"
: "${GITHUB_SHA:?Missing commit}"
: "${GITHUB_RUN_NUMBER:?Missing run generation}"
[[ "$WEBSITE_SSH_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]] || { echo "Invalid SSH hostname" >&2; exit 1; }
[[ "$WEBSITE_SSH_USER" == achichorro-publish ]] || { echo "Use the dedicated restricted publisher account" >&2; exit 1; }
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ && "$GITHUB_RUN_NUMBER" =~ ^[0-9]{1,19}$ ]] || { echo "Invalid release identity" >&2; exit 1; }
[[ $# -eq 1 && -f "$1" ]] || { echo "Usage: $0 COMPLETE_ARCHIVE.tar.gz" >&2; exit 1; }
folder="$(mktemp -d)"
trap 'rm -rf "$folder"' EXIT
umask 077
printf '%s\n' "$WEBSITE_SSH_PRIVATE_KEY" > "$folder/key"
printf '%s\n' "$WEBSITE_SSH_KNOWN_HOSTS" > "$folder/known_hosts"
ssh -T -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
  -o UserKnownHostsFile="$folder/known_hosts" -o ConnectTimeout=15 \
  -i "$folder/key" "$WEBSITE_SSH_USER@$WEBSITE_SSH_HOST" \
  "publish $GITHUB_SHA $GITHUB_RUN_NUMBER" < "$1"
