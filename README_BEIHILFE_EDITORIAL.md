# Hanse-Konzept – Beihilfe Editorial Experience

## Installation

```bash
cd ~/Desktop/Software-Coding/Webseiten/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-beihilfe-editorial.zip
python3 install_beihilfe_editorial.py
```

## Kontaktadresse

Das Formular öffnet aktuell eine E-Mail an `kontakt@hanse-konzept.de`.
Bei Bedarf in `gesundheit/beihilfe/script.js` ändern.

## Deployment

```bash
git status
git add gesundheit/beihilfe gesundheit/index.html install_beihilfe_editorial.py README_BEIHILFE_EDITORIAL.md
git add sitemap.xml 2>/dev/null || true
git commit -m "Rebuild Beihilfe page as editorial journey"
git push origin main
```
