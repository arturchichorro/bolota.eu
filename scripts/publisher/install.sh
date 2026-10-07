#!/usr/bin/env bash
# Run deliberately as root on the VPS, never as part of routine website CI.
set -euo pipefail
[[ "$EUID" -eq 0 ]] || { echo "Run this installer with sudo on the VPS." >&2; exit 1; }
[[ "$(uname -s)" == Linux ]] || { echo "This installer is for the Linux VPS, not your Mac." >&2; exit 1; }
[[ $# -eq 1 && -f "$1" ]] || { echo "Usage: sudo $0 PUBLIC_KEY_FILE" >&2; exit 1; }
repo_dir="$(cd "$(dirname "$0")" && pwd)"
account=achichorro-publish
home=/var/lib/achichorro-publish
root=/srv/achichorro.com
[[ ! -L "$root" && ! -L "$root/releases" ]] || { echo "Refusing a symlinked release root." >&2; exit 1; }
key="$(python3 -I -c 'from pathlib import Path; import sys; lines=[line.strip() for line in Path(sys.argv[1]).read_text().splitlines() if line.strip()]; assert len(lines)==1 and lines[0].startswith("ssh-ed25519 "), "Provide exactly one plain ED25519 public key"; print(lines[0])' "$1")"
ssh-keygen -lf "$1" >/dev/null
if id "$account" >/dev/null 2>&1; then
  [[ "$(getent passwd "$account" | cut -d: -f6)" == "$home" ]] || { echo "Existing account has unexpected home; inspect it first." >&2; exit 1; }
  uid="$(id -u "$account")"
  [[ "$uid" -ge 100 && "$uid" -lt 1000 && "$(id -nG "$account")" == "$account" ]] || { echo "Publisher must be a dedicated system account with no sudo/docker groups." >&2; exit 1; }
  [[ "$(getent passwd | awk -F: -v uid="$uid" '$3 == uid {count++} END {print count+0}')" -eq 1 ]] || { echo "Refusing a shared UID." >&2; exit 1; }
else
  useradd --system --user-group --create-home --home-dir "$home" --shell /bin/sh "$account"
fi
# A valid shell is required for SSH forced commands. Lock passwords, not public-key auth.
usermod --lock --shell /bin/sh "$account"
install -d -o root -g root -m 755 "$home" "$home/.ssh" /usr/local/libexec
install -o root -g root -m 755 "$repo_dir/receive.py" /usr/local/libexec/achichorro-publish
if [[ -f "$home/.ssh/authorized_keys" ]]; then
  cp -a "$home/.ssh/authorized_keys" "$home/.ssh/authorized_keys.backup-$(date +%Y%m%d-%H%M%S)"
fi
# Root owns key policy. Public-key data is readable by sshd while the account cannot edit it.
printf 'restrict,command="/usr/local/libexec/achichorro-publish" %s\n' "$key" > "$home/.ssh/authorized_keys"
chown root:root "$home/.ssh/authorized_keys"
chmod 644 "$home/.ssh/authorized_keys"
# Change only the public site's parent directories, not existing legacy releases.
install -d -o "$account" -g "$account" -m 755 "$root" "$root/releases"
echo "Installed restricted publisher; existing release contents and running services are unchanged."
echo "Inspect sshd AllowUsers/AllowGroups rules if this account is not permitted to authenticate."
