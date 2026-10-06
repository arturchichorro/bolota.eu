import gzip
import importlib.util
import io
import json
import multiprocessing
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("receiver", Path(__file__).with_name("receive.py"))
receiver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(receiver)
SHA = "a" * 40

def archive(files=None, special=None):
    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode="w:gz") as tar:
        for name, text in (files if files is not None else {"index.html": "HOME", "posts/example/index.html": "POST", "assets/site.css": "CSS"}).items():
            data = text.encode()
            member = tarfile.TarInfo(name)
            member.size = len(data)
            tar.addfile(member, io.BytesIO(data))
        if special:
            tar.addfile(special)
    output.seek(0)
    return output

def parallel_publish(root, generation):
    publisher = receiver.Publisher(root)
    try:
        publisher.publish(archive(), SHA, generation)
    except receiver.StalePublish:
        pass

class PublishTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / "releases").mkdir()
        legacy = self.root / "releases" / "920a930"
        legacy.mkdir()
        (legacy / "index.html").write_text("LEGACY")
        (self.root / "current").symlink_to("releases/920a930")
        self.publisher = receiver.Publisher(self.root)

    def test_publish_is_versioned_atomic_and_world_readable(self):
        result = self.publisher.publish(archive(), SHA, 10)
        self.assertEqual(result, "10-" + SHA)
        self.assertEqual((self.root / "current").readlink(), Path("releases/" + result))
        self.assertEqual((self.root / ".previous").readlink(), Path("releases/920a930"))
        self.assertEqual((self.root / "current/posts/example/index.html").read_text(), "POST")
        self.assertEqual((self.root / "current/index.html").stat().st_mode & 0o777, 0o644)
        self.assertEqual((self.root / "current").stat().st_mode & 0o777, 0o755)

    def test_invalid_or_incomplete_upload_leaves_current_untouched(self):
        for payload in [io.BytesIO(b"not gzip"), io.BytesIO(archive().getvalue()[:-8]), archive({"other.html": "no index"})]:
            with self.subTest(payload=payload):
                with self.assertRaises((receiver.PublishError, OSError, EOFError, tarfile.TarError)):
                    self.publisher.publish(payload, SHA, 10)
                self.assertEqual(self.publisher.current(), "920a930")
                self.assertEqual(self.publisher.state()["generation"], 0)
        self.assertFalse(list((self.root / "releases").glob(".incoming-*")))

    def test_path_traversal_and_hidden_files_are_rejected(self):
        for name in ["../escape", "/tmp/escape", "a/../../escape", "a\\escape", ".env", "dir/.git/config", "bad\nname"]:
            with self.subTest(name=name), self.assertRaises(receiver.PublishError):
                self.publisher.publish(archive({"index.html": "HOME", name: "bad"}), SHA, 10)
            self.assertEqual(self.publisher.current(), "920a930")

    def test_symlinks_hardlinks_devices_and_fifos_are_rejected(self):
        for kind in [tarfile.SYMTYPE, tarfile.LNKTYPE, tarfile.CHRTYPE, tarfile.FIFOTYPE]:
            member = tarfile.TarInfo("evil")
            member.type, member.linkname = kind, "/etc/passwd"
            with self.subTest(kind=kind), self.assertRaises(receiver.PublishError):
                self.publisher.publish(archive(special=member), SHA, 10)
        self.assertEqual(self.publisher.current(), "920a930")

    def test_pax_sparse_files_are_rejected_even_when_marked_regular(self):
        payload = io.BytesIO()
        with tarfile.open(fileobj=payload, mode="w:gz", format=tarfile.PAX_FORMAT) as tar:
            index = tarfile.TarInfo("index.html")
            index.size = 4
            tar.addfile(index, io.BytesIO(b"HOME"))
            sparse = tarfile.TarInfo("hole")
            sparse.size = 1
            sparse.pax_headers = {"GNU.sparse.map": "0,1", "GNU.sparse.size": "1048576"}
            tar.addfile(sparse, io.BytesIO(b"x"))
        payload.seek(0)
        with self.assertRaises(receiver.PublishError):
            self.publisher.publish(payload, SHA, 10)
        self.assertEqual(self.publisher.current(), "920a930")

    def test_duplicate_paths_are_rejected(self):
        member = tarfile.TarInfo("index.html")
        member.type = tarfile.DIRTYPE
        with self.assertRaises(receiver.PublishError):
            self.publisher.publish(archive(special=member), SHA, 10)

    def test_limits_bound_compressed_and_expanded_data_and_file_count(self):
        with self.assertRaises(receiver.PublishError):
            receiver.copy_bounded(io.BytesIO(b"12345"), io.BytesIO(), 4)
        for name, value in [("MAX_EXPANDED", 20), ("MAX_FILES", 1)]:
            with patch.object(receiver, name, value), self.assertRaises(receiver.PublishError):
                self.publisher.publish(archive(), SHA, 10)
        self.assertEqual(self.publisher.current(), "920a930")

    def test_identity_validation_and_stale_generation(self):
        for sha, generation in [("invalid", 1), (SHA, 0), (SHA, 2 ** 63)]:
            with self.assertRaises(receiver.PublishError):
                self.publisher.publish(archive(), sha, generation)
        self.publisher.publish(archive(), SHA, 20)
        with self.assertRaises(receiver.StalePublish):
            self.publisher.publish(archive(), SHA, 10)
        self.assertEqual(self.publisher.current(), "20-" + SHA)

    def test_reruns_are_idempotent_but_immutable(self):
        self.publisher.publish(archive(), SHA, 10)
        self.publisher.publish(archive(), SHA, 10)
        with self.assertRaises(receiver.PublishError):
            self.publisher.publish(archive({"index.html": "CHANGED"}), SHA, 10)
        with self.assertRaises(receiver.PublishError):
            self.publisher.publish(archive(), "b" * 40, 10)
        self.assertEqual((self.root / "current/index.html").read_text(), "HOME")

    def test_rollback_does_not_lower_the_high_water_mark(self):
        self.publisher.publish(archive(), SHA, 10)
        self.publisher.publish(archive(), SHA, 20)
        self.publisher.rollback("10-" + SHA)
        self.assertEqual(self.publisher.state()["generation"], 20)
        with self.assertRaises(receiver.StalePublish):
            self.publisher.publish(archive(), SHA, 15)
        self.publisher.rollback("920a930")
        self.assertEqual(self.publisher.current(), "920a930")
        for release in ["../etc", "/etc", "missing", "999-" + SHA]:
            with self.assertRaises(receiver.PublishError):
                self.publisher.rollback(release)

    def test_retention_keeps_five_completed_releases_plus_legacy(self):
        for generation in range(1, 9):
            self.publisher.publish(archive(), SHA, generation)
        names = {path.name for path in (self.root / "releases").iterdir()}
        self.assertEqual(names, {"920a930"} | {str(number) + "-" + SHA for number in range(4, 9)})

    def test_activation_failure_keeps_old_current_and_allows_identical_retry(self):
        with patch.object(self.publisher, "activate", side_effect=OSError("simulated switch failure")):
            with self.assertRaises(OSError):
                self.publisher.publish(archive(), SHA, 20)
        self.assertEqual(self.publisher.current(), "920a930")
        self.assertEqual(self.publisher.state()["generation"], 20)
        with self.assertRaises(receiver.StalePublish):
            self.publisher.publish(archive(), SHA, 10)
        self.publisher.publish(archive(), SHA, 20)
        self.assertEqual(self.publisher.current(), "20-" + SHA)

    def test_a_terminated_receivers_staging_directory_is_cleaned_under_lock(self):
        orphan = self.root / "releases" / ".incoming-terminated"
        orphan.mkdir()
        (orphan / "partial.html").write_text("INCOMPLETE")
        self.publisher.publish(archive(), SHA, 10)
        self.assertFalse(orphan.exists())

    def test_simultaneous_publishers_cannot_regress_current(self):
        # fork avoids module-pickling requirements and matches the Linux VPS.
        context = multiprocessing.get_context("fork")
        processes = [context.Process(target=parallel_publish, args=(self.root, generation)) for generation in [20, 10]]
        for process in processes:
            process.start()
        for process in processes:
            process.join(10)
            self.assertEqual(process.exitcode, 0)
        self.assertEqual(self.publisher.current(), "20-" + SHA)

if __name__ == "__main__":
    unittest.main()
