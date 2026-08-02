# Hanse-Konzept – Beihilfe-Update

Dieses Paket ist als Drop-in-Update vorbereitet.

## Installation

Im Projektordner:

```bash
cd /Users/demo/Developer/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-beihilfe-update.zip
python3 install_beihilfe.py
```

Das Installationsskript:

- belässt bestehende Seiten unangetastet,
- fügt `/gesundheit/beihilfe/` hinzu,
- ergänzt auf `/gesundheit/index.html` einen prominenten Editorial-Teaser vor `</main>`,
- ergänzt `sitemap.xml`, sofern sie vorhanden ist,
- erstellt vor jeder veränderten Datei eine `.bak`-Sicherung.

Danach prüfen:

```bash
git status
```

## Deployment

```bash
git add gesundheit/beihilfe gesundheit/index.html sitemap.xml
git commit -m "Add Beihilfe health page"
git push origin main
```

Falls keine `sitemap.xml` existiert, den Dateinamen im `git add` weglassen.

## Fachlicher Rahmen

Die Seite verwendet typische Bemessungssätze des Bundes als erste Einordnung:

- aktive Beihilfeberechtigte typischerweise 50 %
- Versorgungsempfänger typischerweise 70 %
- bei mindestens zwei berücksichtigungsfähigen Kindern typischerweise 70 %
- berücksichtigungsfähige Kinder typischerweise 80 %

Landesrecht, pauschale Beihilfe, Heilfürsorge, Einkommensgrenzen und Sonderfälle können abweichen.

Die Referenzseite wurde hinsichtlich Dramaturgie und Conversion-Struktur analysiert. Texte, Layout und Interaktionen dieses Pakets sind eigenständig.
