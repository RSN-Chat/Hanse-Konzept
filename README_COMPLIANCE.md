# HK-COMPLIANCE-001

## Installation

```bash
cd ~/Desktop/Software-Coding/Webseiten/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-compliance-update.zip
python3 apply_compliance_update.py
```

## Danach prüfen

```bash
git status
cat COMPLIANCE_SCAN.json
```

Öffne vor dem Commit bitte:

- `impressum/index.html`
- `datenschutz/index.html`
- `ki-transparenz/index.html`

und vergleiche Vermittlerstatus, Anschrift, Kontakt und Registerangaben mit deinen aktuellen Unterlagen.

## Deployment

```bash
git add impressum datenschutz ki-transparenz assets/compliance \
        apply_compliance_update.py COMPLIANCE_AUDIT.md \
        COMPLIANCE_SCAN.json README_COMPLIANCE.md

git add sitemap.xml 2>/dev/null || true
git add '*.html'

git commit -m "Add compliance, legal and AI transparency update"
git push origin main
```

Das Paket ist eine sorgfältige technische und redaktionelle Compliance-Basis. Es ersetzt keine anwaltliche Einzelfallprüfung.
