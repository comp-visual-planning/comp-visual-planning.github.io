#!/usr/bin/env bash
# 就地覆盖：遍历 materials/ 下所有 .mp4，CRF=15 压缩后原地替换
set -Eeuo pipefail

ROOT="materials"

[[ -d "$ROOT" ]] || { echo "[err] directory '$ROOT' not found" >&2; exit 1; }

have_numfmt=1
command -v numfmt >/dev/null 2>&1 || have_numfmt=0

# 处理空格/中文路径
find "$ROOT" -type f -iname "*.mp4" -print0 | while IFS= read -r -d '' f; do
  f="${f//$'\r'/}" 
  dir="$(dirname "$f")"
  base="$(basename "$f")"

  # 同目录临时输出文件（避免跨分区）
  tmp_out="$dir/.${base}.tmp.$$.$RANDOM.mp4"

  echo "[run ] $f"
  # 转码到临时文件；不改 fps（不加 -r），去音轨（-an）
  ffmpeg -hide_banner -loglevel error -y \
    -i "$f" \
    -c:v libx264 -crf 15 -preset slow \
    -pix_fmt yuv420p -movflags +faststart -an \
    "$tmp_out"

  # 统计体积变化
  old_sz=$(stat -c %s "$f" 2>/dev/null || echo 0)
  new_sz=$(stat -c %s "$tmp_out" 2>/dev/null || echo 0)

  # 原子替换
  mv -f -- "$tmp_out" "$f"

  # 打印结果
  if [[ "$old_sz" -gt 0 && "$new_sz" -gt 0 ]]; then
    if [[ $have_numfmt -eq 1 ]]; then
      old_h=$(numfmt --to=iec -- "$old_sz")
      new_h=$(numfmt --to=iec -- "$new_sz")
      saved=$((old_sz - new_sz))
      saved_h=$(numfmt --to=iec -- "$saved")
    else
      old_h="${old_sz}B"; new_h="${new_sz}B"; saved=$((old_sz - new_sz)); saved_h="${saved}B"
    fi
    pct=$(awk -v o="$old_sz" -v n="$new_sz" 'BEGIN{if(o>0){printf "%.1f",(1-n/o)*100}else{printf "0.0"}}')
    # 允许出现负的 saved（不一定每次都更小）
    echo "[done] $f  old=${old_h}  new=${new_h}  saved=${saved_h} (${pct}%)"
  else
    echo "[done] $f"
  fi
done

echo "[all done]"
