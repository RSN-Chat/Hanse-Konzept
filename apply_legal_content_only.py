#!/usr/bin/env python3
from pathlib import Path
import shutil
import re

project = Path.cwd()
root = Path(__file__).resolve().parent

def replace_main(target_rel, fragment_name):
    target = project / target_rel
    if not target.exists():
        raise SystemExit(f"Nicht gefunden: {target}")

    original = target.read_text(encoding="utf-8")
    fragment = (root / fragment_name).read_text(encoding="utf-8").strip()

    match = re.search(r"<main\b[^>]*>.*?</main>", original, flags=re.I | re.S)
    if not match:
        raise SystemExit(f"Kein <main>-Bereich in {target_rel} gefunden.")

    backup = target.with_suffix(target.suffix + ".bak-legal-content")
    shutil.copy2(target, backup)

    updated = original[:match.start()] + fragment + original[match.end():]

    # Alte E-Mail-Adresse überall auf der jeweiligen Rechtsseite ersetzen.
    updated = updated.replace(
        "Stephan.Brinkmann@arag-partner.de",
        "Stephan.Brinkmann@hanse-konzept.de"
    )

    target.write_text(updated, encoding="utf-8")
    print("Aktualisiert:", target_rel)
    print("Backup:", backup)

replace_main("impressum/index.html", "impressum-main.html")
replace_main("datenschutz/index.html", "datenschutz-main.html")

print()
print("Fertig. Header, Footer, CSS, Skripte und damit die bestehende Hanse-Konzept-Optik wurden nicht ersetzt.")
print("Jetzt bitte git status prüfen.")
