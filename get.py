#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Re-encode all .mp4 files under 'materials/' in place using ffmpeg:
- libx264, CRF=15, preset=slow, yuv420p, +faststart, no audio (-an)
- Write to a temp file in the same directory, then atomically replace
- Print [run]/[done] lines like the original bash script
- Strip stray '\r' from paths to avoid "aterials/..." issue
"""

import os
import sys
import math
import shutil
import tempfile
import subprocess

ROOT = "materials"  # keep the same root as the bash script

def human_size(n: int) -> str:
    """Format size like 1.1K / 1.1M / 1.1G (base 1024)."""
    try:
        n = int(n)
    except Exception:
        return f"{n}B"
    if n < 1024:
        return f"{n}B"
    units = ["K", "M", "G", "T", "P", "E"]
    i = int(math.log(n, 1024))
    i = max(0, min(i, len(units)))
    if i == 0:
        return f"{n}B"
    val = n / (1024 ** i)
    suf = units[i - 1]
    return f"{val:.1f}{suf}"

def percent_saved(old_sz: int, new_sz: int) -> str:
    if old_sz > 0:
        pct = (1 - (new_sz / old_sz)) * 100.0
        return f"{pct:.1f}"
    return "0.0"

def main():
    # Check root
    if not os.path.isdir(ROOT):
        print(f"[err] directory '{ROOT}' not found", file=sys.stderr)
        sys.exit(1)

    # Check ffmpeg
    if shutil.which("ffmpeg") is None:
        print("[err] ffmpeg not found", file=sys.stderr)
        sys.exit(1)

    # Walk and process .mp4 files (case-insensitive)
    for dirpath, _, filenames in os.walk(ROOT):
        for name in filenames:
            if not name.lower().endswith(".mp4"):
                continue

            # Build full path and strip any stray '\r'
            f_raw = os.path.join(dirpath, name)
            f = f_raw.replace("\r", "")

            # If stripping changed the path but the original existed, f should also exist;
            # Since '\r' usually came from reading, not filesystem, this is the safe fix.
            if not os.path.isfile(f):
                # If the raw path exists (with \r), fall back to it
                if os.path.isfile(f_raw):
                    f = f_raw
                else:
                    print(f"[skip] (missing) {f}")
                    continue

            dir_ = os.path.dirname(f)
            base = os.path.basename(f)

            # Temp output in the same directory
            tmp_fd, tmp_out = tempfile.mkstemp(prefix=f".{base}.tmp.", suffix=".mp4", dir=dir_)
            os.close(tmp_fd)  # we only need the path; ffmpeg will write to it

            print(f"[run ] {f}", flush=True)

            # Get original size
            try:
                old_sz = os.stat(f).st_size
            except Exception:
                old_sz = 0

            # ffmpeg command (keep fps; remove audio)
            cmd = [
                "ffmpeg",
                "-hide_banner", "-loglevel", "error",
                "-y",
                "-i", f,
                "-c:v", "libx264",
                "-crf", "23",
                "-preset", "slow",
                "-pix_fmt", "yuv420p",
                "-movflags", "+faststart",
                "-map_metadata", "-1", "-map_chapters", "-1",
                "-an",
                tmp_out,
            ]

            try:
                subprocess.run(cmd, check=True)
            except subprocess.CalledProcessError:
                # Clean temp on failure
                try:
                    os.remove(tmp_out)
                except OSError:
                    pass
                print(f"[err] ffmpeg failed for {f}", file=sys.stderr)
                continue

            # New size (temp file)
            try:
                new_sz = os.stat(tmp_out).st_size
            except Exception:
                new_sz = 0

            # Atomic replace
            try:
                os.replace(tmp_out, f)
            except Exception as e:
                # If replace fails, clean temp and report
                try:
                    os.remove(tmp_out)
                except OSError:
                    pass
                print(f"[err] replace failed for {f}: {e}", file=sys.stderr)
                continue

            # Print result line
            if old_sz > 0 and new_sz > 0:
                old_h = human_size(old_sz)
                new_h = human_size(new_sz)
                saved = old_sz - new_sz  # can be negative
                saved_h = human_size(saved)
                pct = percent_saved(old_sz, new_sz)
                print(f"[done] {f}  old={old_h}  new={new_h}  saved={saved_h} ({pct}%)", flush=True)
            else:
                print(f"[done] {f}", flush=True)

    print("[all done]")

if __name__ == "__main__":
    main()
