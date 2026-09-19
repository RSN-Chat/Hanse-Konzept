# Hanse-Konzept Legal Content Update

Dieses Update ersetzt **nur den `<main>`-Inhalt** von:

- `impressum/index.html`
- `datenschutz/index.html`

Damit bleiben die bestehende Hanse-Konzept-Optik, Header, Footer, Stylesheets und Skripte erhalten.

Neue Kontakt-E-Mail:
`Stephan.Brinkmann@hanse-konzept.de`

## Installation

```bash
cd ~/Desktop/Software-Coding/Webseiten/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-legal-content-only.zip
python3 apply_legal_content_only.py
```

## Prüfen

```bash
git status
```

## Deploy

```bash
rm -f impressum/index.html.bak-legal-content
rm -f datenschutz/index.html.bak-legal-content

git add impressum/index.html         datenschutz/index.html         apply_legal_content_only.py         impressum-main.html         datenschutz-main.html         README_LEGAL_CONTENT_ONLY.md

git commit -m "Update legal page content"

git push origin main
```
