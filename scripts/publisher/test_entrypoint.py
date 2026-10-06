"""Exercise the forced-command entrypoint as an unprivileged, networkless Docker user."""
import gzip
import io
import os
from pathlib import Path
import subprocess
import tarfile
import tempfile
import unittest

IMAGE = "python:3.14-alpine"
RECEIVER = Path(__file__).with_name("receive.py").resolve()
SHA = "b" * 40

def payload():
    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode="w:gz") as archive:
        data = b"COMPLETE SITE"
        info = tarfile.TarInfo("index.html")
        info.size = len(data)
        archive.addfile(info, io.BytesIO(data))
    return output.getvalue()

class EntryPointTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        subprocess.run(["docker", "pull", IMAGE], check=True, stdout=subprocess.DEVNULL)

    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / "releases").mkdir()
        old = self.root / "releases" / "920a930"
        old.mkdir()
        (old / "index.html").write_text("OLD")
        (self.root / "current").symlink_to("releases/920a930")

    def invoke(self, command, data=b""):
        return subprocess.run([
            "docker", "run", "--rm", "-i", "--read-only", "--network", "none",
            "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
            "--user", str(os.getuid()) + ":" + str(os.getgid()),
            "-v", str(RECEIVER) + ":/receiver.py:ro",
            "-v", str(self.root) + ":/srv/achichorro.com:rw",
            "-e", "SSH_ORIGINAL_COMMAND=" + command,
            IMAGE, "python", "-I", "/receiver.py",
        ], input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=30)

    def test_publish_status_and_deliberate_rollback(self):
        result = self.invoke("publish " + SHA + " 100", payload())
        self.assertEqual(result.returncode, 0, result.stderr.decode())
        self.assertEqual((self.root / "current/index.html").read_text(), "COMPLETE SITE")
        self.assertEqual(self.invoke("status").returncode, 0)
        stale = self.invoke("publish " + SHA + " 99", payload())
        self.assertEqual(stale.returncode, 0, stale.stderr.decode())
        self.assertIn(b"skipped", stale.stdout)
        rollback = self.invoke("rollback 920a930")
        self.assertEqual(rollback.returncode, 0, rollback.stderr.decode())
        self.assertEqual((self.root / "current/index.html").read_text(), "OLD")

    def test_shell_sftp_and_other_commands_are_rejected(self):
        for command in ["", "sh", "scp -t /etc", "internal-sftp", "status; id", "rollback ../../etc"]:
            with self.subTest(command=command):
                self.assertNotEqual(self.invoke(command).returncode, 0)
                self.assertEqual((self.root / "current/index.html").read_text(), "OLD")

if __name__ == "__main__":
    unittest.main()
