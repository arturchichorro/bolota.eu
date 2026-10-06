# Static website publishing

`vps-infra` owns shared Caddy/HTTPS. This repository owns website builds, versioned public files, activation and file rollback. Home-hub is never rebuilt, restarted or administered by the website publisher. The newsletter Worker remains separately managed; website CI only validates it, never deploys it or reads its MailerLite token.

## Automatic flow

`.github/workflows/website.yml` verifies PRs and pushes to develop/main. It installs locked dependencies, typechecks, runs rendering/newsletter/publisher tests, builds the complete static output, dry-runs the Worker, and archives `dist/` as a complete artifact.

Only a successful **push to main** publishes, through the `website-production` GitHub environment. The publish job is serialized and rechecks the current main SHA before uploading. A server-side lock and persistent high-water mark based on GitHub's documented, incrementing **workflow run number** prevent older jobs from replacing newer releases, including after a deliberate rollback. Keep `.github/workflows/website.yml` as the stable publisher identity: do not delete/recreate/rename it without an explicit generation migration, because a new workflow's counter resets and would be safely refused as stale.

A build or partial upload failure leaves `current` untouched. The receiver verifies the entire bounded gzip/tar input, rejects traversal, hidden files, links/special files and duplicate paths, and extracts only regular public files to a staging directory. It never trusts archive ownership/modes. A complete release is immutable and switched using an atomic **relative** symlink under the stable parent mount.

## Release-tree contract

```text
/srv/achichorro.com/
├── releases/
│   ├── 920a930/                         existing manual bootstrap (retained)
│   └── RUN_NUMBER-FULL_COMMIT_SHA/      complete CI release
├── current -> releases/RUN_NUMBER-SHA
├── .previous -> releases/PREVIOUS_ID
├── .metadata/                          manifests; not in the public document root
├── .publish-state.json                 persistent generation high-water mark
└── .publish.lock
```

Caddy mounts `/srv/achichorro.com` **read-only** at `/sites/achichorro-blog` and serves only `current`. Receiver limits: 64 MiB compressed, 256 MiB expanded, 10,000 entries. It retains the latest **five** managed releases plus pinned active/previous releases. Legacy manual releases are not automatically deleted. Do not delete state/metadata to work around a rejected stale job.

Receiver runtime requires Linux/Python 3 and uses only the standard library. Its CLI bounds address space to 384 MiB, CPU to 30 seconds (35-second hard limit), open descriptors to 64, and total wall time to three minutes. Abandoned staging directories are cleaned under the exclusive lock on the next publish; parser failures never activate them. It runs as a dedicated unprivileged user, not root. The installed receiver has a fixed path/root and isolated Python startup; callers cannot supply a root directory or run arbitrary commands.

## Setup order

Prepare the publisher and secrets **before** promoting this website to main. Separately follow `vps-infra/docs/MIGRATION.md` for the public-ingress handoff. Do not promote home-hub's networking to main until its shared-ingress preflight/watcher and rollback are ready.

### 1. Generate a dedicated website CI key on your Mac

Do not reuse your personal/admin SSH key or either repository's GitHub read key. First ensure `~/.ssh/achichorro_site_ci` does not exist; do not overwrite an existing key.

```bash
ssh-keygen -t ed25519 -f ~/.ssh/achichorro_site_ci -C "achichorro-site-ci" -N ""
```

Keep the private key on your Mac for transfer to the GitHub secret only. Never send it in chat or copy it into the website or infra repository. The VPS receives **only the public key**.

### 2. Install the root-owned restricted receiver on the VPS

In your normal VPS admin SSH session:

```bash
install -d -m 700 ~/achichorro-publisher-setup
```

From your Mac's bolota checkout, use your existing **admin** key to copy the two installer files and the new **public** CI key:

```bash
scp -i ~/.ssh/id_ed25519 scripts/publisher/receive.py scripts/publisher/install.sh ~/.ssh/achichorro_site_ci.pub ubuntu@137.74.45.220:achichorro-publisher-setup/
```

Then, on the VPS:

```bash
sudo bash ~/achichorro-publisher-setup/install.sh ~/achichorro-publisher-setup/achichorro_site_ci.pub
```

The installer creates system user/group `achichorro-publish` with no extra groups, a locked password, and a normal shell solely for SSH forced commands. Root owns its home/SSH policy and `/usr/local/libexec/achichorro-publish`. Its public key entry uses `restrict,command="/usr/local/libexec/achichorro-publish"`, disabling forwarding, PTYs and user RC files. Root-owned public key policy is readable but not writable by the account. Only its website parent/release directories become publisher-owned; existing legacy files and running services remain unchanged.

The receiver accepts only:

```text
publish FULL_SHA GITHUB_RUN_NUMBER       bounded archive on stdin
rollback EXISTING_RELEASE_ID        deliberate file rollback
status                              public release metadata only
```

Shell, SCP and SFTP commands are rejected. The account has no sudo/Docker access or home-hub/config ownership. If sshd has an AllowUsers/AllowGroups restriction, explicitly permit this dedicated account; do not relax authentication globally. Installer reruns replace only this account's CI key policy and keep a backup, for deliberate key rotation.

From your Mac, verify the new key independently:

```bash
ssh -T -o IdentitiesOnly=yes -i ~/.ssh/achichorro_site_ci achichorro-publish@137.74.45.220 status
```

It should report the bootstrap release, not open a shell. An attempt to run `id` through that key should be refused.

### 3. Pin the NORMAL VPS SSH host identity

Use the existing verified normal-system key, **not the rescue host key** and not an unverified `ssh-keyscan` result. In the normal VPS session:

```bash
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Compare that fingerprint with your Mac's verified normal known-hosts entry. If uncertain, verify through OVH's normal KVM console. Copy the matching known-hosts line on your Mac:

```bash
ssh-keygen -F 137.74.45.220 | grep -v '^#' | pbcopy
```

This contains public host identity, not a password. CI sets `StrictHostKeyChecking=yes` and a dedicated known-hosts file; it must fail on a mismatched host key.

### 4. Configure the GitHub environment

In **arturchichorro/bolota.eu → Settings → Environments**, create `website-production`. Restrict deployment branches to **main only**. Add these environment secrets:

| Secret | Value |
| --- | --- |
| `WEBSITE_SSH_HOST` | `137.74.45.220` |
| `WEBSITE_SSH_USER` | `achichorro-publish` |
| `WEBSITE_SSH_PRIVATE_KEY` | Complete contents of the new `~/.ssh/achichorro_site_ci` private key |
| `WEBSITE_SSH_KNOWN_HOSTS` | Verified normal-system known-hosts line from the previous step |

For the private-key secret, `pbcopy < ~/.ssh/achichorro_site_ci` copies it directly into your clipboard for the GitHub form; do not paste it into chat. These credentials are unavailable to PR verification jobs. Configure the environment before promoting the website to main; missing secrets fail closed without replacing the active release. Delete any temporary private-key clipboard content afterward.

No Cloudflare credentials or MailerLite API keys are needed by this workflow. The separately configured Worker keeps its existing secret and group ID.

### 5. Publish and verify

After shared ingress is ready and the site's changes are reviewed, promote the website to **main**. Watch **Verify and publish website** in Actions. Build/upload/activation success must be verified, not assumed.

Check receiver status with the restricted key or, as an administrator:

```bash
sudo -u achichorro-publish /usr/local/libexec/achichorro-publish status
```

Confirm `current` now names the expected workflow run number and full commit SHA. Through the public HTTPS site, test index/post routes, CSS/fonts, RSS, image gallery, `www` canonical redirection, unknown-route 404s and newsletter double opt-in. Home-hub must remain reachable with working login, live Zero updates and images.

Finally make and push a small reviewed site change to main and verify a **second** new release activates automatically, without Docker operations or manual copying. A failed build must not activate anything. Concurrent/stale deployment regression is covered by receiver tests.

## Deliberate rollback

Inspect retained releases and the previous pointer before selecting an ID. As administrator on the VPS:

```bash
readlink /srv/achichorro.com/.previous
ls /srv/achichorro.com/releases
# Replace RELEASE_ID with an existing complete retained release.
sudo -u achichorro-publish /usr/local/libexec/achichorro-publish rollback RELEASE_ID
```

This changes only public website files, not Caddy/Docker, databases or the newsletter Worker. The generation high-water mark is intentionally retained, so delayed old CI jobs cannot overwrite the rollback. A new main commit publishes normally; an explicitly rerun identical highest-generation job may roll forward deliberately. Revert the source change on main if the rollback should become the next normal release.

## Maintenance and tests

```bash
pnpm check
pnpm test:rendering
pnpm test:newsletter
pnpm test:publisher
pnpm build
```

Publisher tests require Python 3 and Docker. They check failure preservation, archive safety, immutable/idempotent retries, concurrent generations, bounded inputs, retention, crash-before-activation recovery, deliberate rollback and the forced-command entrypoint as a networkless unprivileged container user. They do not connect to the VPS or use real credentials.

Update the installed receiver deliberately through the admin installer when this code changes; website CI never updates its own root-owned policy. Preserve existing publisher state/release history. Rotate the dedicated key through the installer and corresponding GitHub environment secret. Never grant the publisher sudo/Docker access as a troubleshooting shortcut.
