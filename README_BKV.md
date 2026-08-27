# Hanse-Konzept – Betriebliche Krankenversicherung

Route: `/unternehmen/bkv/`

## Installation

```bash
cd ~/Desktop/Software-Coding/Webseiten/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-bkv.zip
python3 install_bkv.py
```

## Deployment

```bash
git status
git add unternehmen/bkv unternehmen/index.html install_bkv.py README_BKV.md
git add sitemap.xml 2>/dev/null || true
git commit -m "Add bKV company landing page"
git push origin main
```

## Wichtig

- Die Zahl `63 %` ist bewusst als illustrative Zahl gekennzeichnet und muss vor Veröffentlichung mit einer belastbaren Quelle ersetzt oder entfernt werden.
- `ab 40 €` ist ein Beispiel und kein Tarifangebot.
- Das Kontaktformular öffnet eine E-Mail an `Stephan.Brinkmann@arag-partner.de`.
