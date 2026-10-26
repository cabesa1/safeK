"""Lossless web-font container conversion; keeps the original OFL fonts."""
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent / "assets" / "fonts"
for source in root.glob("manrope-*.ttf"):
    font = TTFont(source)
    font.flavor = "woff2"
    font.save(source.with_suffix(".woff2"))
    print(source.name, source.stat().st_size, source.with_suffix(".woff2").stat().st_size)
