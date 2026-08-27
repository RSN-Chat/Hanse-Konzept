# Hanse-Konzept bKV V2.1

Änderung:
- regulär ab 10 Personen
- bei bestehendem ARAG Firmen-Rechtsschutz bereits ab 5 Personen
- Rechner fragt den bestehenden ARAG Firmen-Rechtsschutz ab
- Mindestgrenze passt sich automatisch an

Wichtig:
Die bereitgestellten offiziellen Unterlagen enthalten die bekannten Einheitsbeiträge für 10–20 Personen.
Für 5–9 Personen wurde deshalb bewusst keine neue Preisstaffel erfunden.

Installation:

```bash
cd ~/Desktop/Software-Coding/Webseiten/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-bkv-update-v2-1.zip
python3 patch_bkv_v2_1.py
```

Deployment:

```bash
rm -f unternehmen/bkv/index.html.bak-v2-1
rm -f unternehmen/bkv/script.js.bak-v2-1

git add unternehmen/bkv patch_bkv_v2_1.py README_BKV_V2_1.md
git commit -m "Update bKV minimum group size"
git push origin main
```
