#!/usr/bin/python3 -I
"""Restricted SSH receiver. Publishes public files only; no Docker/sudo or shell exec."""
import contextlib
import fcntl
import gzip
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import resource
import signal
import shlex
import shutil
import sys
import tarfile
import tempfile

ROOT = Path("/srv/achichorro.com")
MAX_COMPRESSED = 64 * 1024 * 1024
MAX_EXPANDED = 256 * 1024 * 1024
MAX_FILES = 10000
KEEP_RELEASES = 5
RELEASE_ID = re.compile(r"(?:[0-9]+-[a-f0-9]{40}|[a-f0-9]{7,40})\Z")

class PublishError(Exception):
    pass

class StalePublish(PublishError):
    pass

def copy_bounded(source, destination, limit):
    total = 0
    while True:
        chunk = source.read(min(1024 * 1024, limit - total + 1))
        if not chunk:
            return total
        total += len(chunk)
        if total > limit:
            raise PublishError("Archive exceeds the size limit")
        destination.write(chunk)

def atomic_json(path, value):
    fd, temporary = tempfile.mkstemp(prefix=".state-", dir=path.parent)
    try:
        with os.fdopen(fd, "w") as stream:
            json.dump(value, stream, sort_keys=True)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
        sync_directory(path.parent)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)

def sync_directory(path):
    fd = os.open(path, os.O_RDONLY)
    try:
        os.fsync(fd)
    finally:
        os.close(fd)

class Publisher:
    def __init__(self, root=ROOT):
        self.root = Path(root)
        self.releases = self.root / "releases"
        if self.root.is_symlink() or self.releases.is_symlink() or not self.releases.is_dir():
            raise PublishError("Release root must be an existing real directory")
        self.metadata = self.root / ".metadata"
        self.metadata.mkdir(mode=0o700, exist_ok=True)
        if self.metadata.is_symlink():
            raise PublishError("Invalid metadata directory")

    @contextlib.contextmanager
    def lock(self):
        with (self.root / ".publish.lock").open("a") as stream:
            fcntl.flock(stream, fcntl.LOCK_EX)
            yield

    def state(self):
        path = self.root / ".publish-state.json"
        if not path.exists():
            return {"generation": 0, "sha": ""}
        value = json.loads(path.read_text())
        if not isinstance(value.get("generation"), int) or value["generation"] < 0:
            raise PublishError("Invalid publisher state; inspect rather than resetting it")
        return value

    def current(self):
        path = self.root / "current"
        if not path.is_symlink():
            if path.exists():
                raise PublishError("current must be a relative symlink")
            return None
        target = os.readlink(path)
        if not target.startswith("releases/") or not RELEASE_ID.fullmatch(target[9:]):
            raise PublishError("Invalid current release target")
        return target[9:]

    def release(self, release_id):
        if not RELEASE_ID.fullmatch(release_id):
            raise PublishError("Invalid release identifier")
        path = self.releases / release_id
        if path.is_symlink() or not path.is_dir() or path.resolve().parent != self.releases.resolve():
            raise PublishError("Release does not exist or is unsafe")
        if not (path / "index.html").is_file() or (path / "index.html").is_symlink():
            raise PublishError("Release is missing its regular index.html")
        return path

    def extract(self, compressed, staging):
        # Fully decompress first: validate gzip CRC/footer and bound zip bombs before extraction.
        manifest = {}
        seen = set()
        extracted_bytes = 0
        with tempfile.TemporaryFile(dir=self.root) as expanded:
            with gzip.GzipFile(fileobj=compressed, mode="rb") as source:
                copy_bounded(source, expanded, MAX_EXPANDED)
            expanded.seek(0)
            with tarfile.open(fileobj=expanded, mode="r:") as archive:
                for member in archive:
                    name = member.name
                    while name.startswith("./"):
                        name = name[2:]
                    if name in ("", ".") and member.isdir():
                        continue
                    parts = PurePosixPath(name).parts
                    if (not name or name.startswith("/") or "\\" in name or any(ord(char) < 32 or ord(char) == 127 for char in name)
                            or any(part in (".", "..") or part.startswith(".") for part in parts)):
                        raise PublishError("Unsafe archive path")
                    if name in seen or len(seen) >= MAX_FILES:
                        raise PublishError("Duplicate archive path or too many files")
                    seen.add(name)
                    if member.type not in (tarfile.DIRTYPE, tarfile.REGTYPE, tarfile.AREGTYPE) or member.sparse is not None:
                        raise PublishError("Archive links, sparse and special files are not allowed")
                    destination = staging.joinpath(*parts)
                    destination.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
                    if member.isdir():
                        destination.mkdir(exist_ok=True, mode=0o755)
                    else:
                        extracted_bytes += member.size
                        if member.size < 0 or extracted_bytes > MAX_EXPANDED:
                            raise PublishError("Invalid or excessive extracted size")
                        digest = hashlib.sha256()
                        with archive.extractfile(member) as source, destination.open("xb") as output:
                            total = 0
                            while True:
                                chunk = source.read(1024 * 1024)
                                if not chunk:
                                    break
                                total += len(chunk)
                                if total > member.size:
                                    raise PublishError("Invalid archive member")
                                output.write(chunk)
                                digest.update(chunk)
                            if total != member.size:
                                raise PublishError("Truncated member")
                            output.flush()
                            os.fsync(output.fileno())
                        destination.chmod(0o644)
                        manifest[name] = digest.hexdigest()
        if "index.html" not in manifest:
            raise PublishError("Missing index.html")
        staging.chmod(0o755)
        for directory, _, _ in os.walk(staging, topdown=False):
            sync_directory(Path(directory))
        return manifest

    def activate(self, release_id):
        self.release(release_id)
        previous = self.current()
        if previous != release_id and previous:
            temporary = self.root / ".previous.next"
            temporary.unlink(missing_ok=True)
            temporary.symlink_to("releases/" + previous)
            os.replace(temporary, self.root / ".previous")
        temporary = self.root / ".current.next"
        temporary.unlink(missing_ok=True)
        temporary.symlink_to("releases/" + release_id)
        os.replace(temporary, self.root / "current")
        sync_directory(self.root)

    def publish(self, compressed, sha, generation):
        if not re.fullmatch(r"[a-f0-9]{40}", sha) or not 0 < generation < 2 ** 63:
            raise PublishError("Invalid commit or generation")
        release_id = str(generation) + "-" + sha
        with self.lock():
            # A terminated receiver may leave a staging directory. No other live
            # extractor can own one while this exclusive lock is held.
            for orphan in self.releases.glob(".incoming-*"):
                if orphan.is_dir() and not orphan.is_symlink() and orphan.stat().st_uid == os.getuid():
                    shutil.rmtree(orphan)
            state = self.state()
            if generation < state["generation"]:
                raise StalePublish("A newer deployment is already committed; skipped")
            if generation == state["generation"] and sha != state["sha"]:
                raise PublishError("Generation cannot be reused for a different commit")
            staging = Path(tempfile.mkdtemp(prefix=".incoming-", dir=self.releases))
            try:
                manifest = self.extract(compressed, staging)
                destination = self.releases / release_id
                metadata = self.metadata / (release_id + ".json")
                if destination.exists() or destination.is_symlink():
                    self.release(release_id)
                    if not metadata.is_file() or json.loads(metadata.read_text()) != manifest:
                        raise PublishError("Published releases are immutable")
                else:
                    atomic_json(metadata, manifest)
                    os.rename(staging, destination)
                    sync_directory(self.releases)
                # Persist the high-water mark BEFORE switching. A crash cannot allow
                # an older deployment to win; the identical generation can be retried.
                atomic_json(self.root / ".publish-state.json", {"generation": generation, "sha": sha})
                sync_directory(self.root)
                self.activate(release_id)
                self.prune()
                return release_id
            finally:
                if staging.exists():
                    shutil.rmtree(staging)

    def prune(self):
        # Only prune this receiver's completed releases, never legacy/manual uploads.
        managed = []
        for path in self.releases.iterdir():
            if re.fullmatch(r"[0-9]+-[a-f0-9]{40}", path.name) and not path.is_symlink() and (self.metadata / (path.name + ".json")).is_file():
                managed.append(path)
        managed.sort(key=lambda path: int(path.name.split("-", 1)[0]), reverse=True)
        keep = {path.name for path in managed[:KEEP_RELEASES]}
        keep.add(self.current())
        previous = self.root / ".previous"
        if previous.is_symlink():
            keep.add(os.readlink(previous).removeprefix("releases/"))
        for path in managed:
            if path.name not in keep:
                try:
                    shutil.rmtree(path)
                    (self.metadata / (path.name + ".json")).unlink(missing_ok=True)
                except OSError:
                    print("Warning: could not prune " + path.name, file=sys.stderr)

    def rollback(self, release_id):
        with self.lock():
            self.activate(release_id)
            # Deliberate rollback never lowers the generation high-water mark.
        return release_id

def main():
    # Bound parser allocation/CPU and stalled uploads, without changing host policy.
    resource.setrlimit(resource.RLIMIT_AS, (384 * 1024 * 1024, 384 * 1024 * 1024))
    resource.setrlimit(resource.RLIMIT_CPU, (30, 35))
    resource.setrlimit(resource.RLIMIT_NOFILE, (64, 64))
    signal.alarm(180)
    # The installed isolated-mode script has a fixed root; SSH callers cannot select paths.
    command = os.environ.get("SSH_ORIGINAL_COMMAND")
    args = shlex.split(command) if command is not None else sys.argv[1:]
    publisher = Publisher()
    if len(args) == 3 and args[0] == "publish" and re.fullmatch(r"[0-9]{1,19}", args[2]):
        # Consume the complete input before skipping a stale generation, so SSH
        # uploads do not suffer a broken pipe or leave a partial activation.
        with tempfile.TemporaryFile(dir=ROOT) as archive:
            copy_bounded(sys.stdin.buffer, archive, MAX_COMPRESSED)
            archive.seek(0)
            try:
                release_id = publisher.publish(archive, args[1], int(args[2]))
                print("Published " + release_id)
            except StalePublish as error:
                print(str(error))
    elif len(args) == 2 and args[0] == "rollback":
        print("Activated " + publisher.rollback(args[1]))
    elif args == ["status"]:
        with publisher.lock():
            print(json.dumps({"current": publisher.current(), "high_water": publisher.state()}, sort_keys=True))
    else:
        raise PublishError("Allowed: publish SHA RUN_NUMBER, rollback RELEASE_ID, status")

if __name__ == "__main__":
    try:
        main()
    except (PublishError, OSError, ValueError, tarfile.TarError, EOFError, MemoryError) as error:
        print("Publish refused: " + (str(error) or type(error).__name__), file=sys.stderr)
        sys.exit(1)
