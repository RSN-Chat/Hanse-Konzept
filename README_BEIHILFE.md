# Hanse-Konzept – Premium-Beihilfe-Seite

## Inhalt

- neue Seite `/gesundheit/beihilfe/`
- eigenständige Hanse-Konzept-Texte
- Dramaturgie eng an der Referenzseite ausgerichtet
- GKV-Irrtum und vier Kostenfallen
- Beihilfe in drei Schritten
- GKV-/PKV-Vergleich
- Leistungsvergleich
- Beihilfe-Check
- Beihilfesätze
- Rechenbeispiele
- Entscheidungsweg
- Einwandbehandlung
- Kostenmodell
- Abschluss-CTA
- Integrationsteaser für `/gesundheit`
- Sitemap-Installer

## Installation

```bash
cd /Users/demo/Developer/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-beihilfe-premium.zip
python3 install_beihilfe.py
```

Danach:

```bash
git status
```

## Deployment

```bash
git add gesundheit/beihilfe gesundheit/index.html install_beihilfe.py README_BEIHILFE.md
git add sitemap.xml 2>/dev/null || true
git commit -m "Add premium Beihilfe page"
git push origin main
```

## Wichtiger fachlicher Hinweis

Die Seite verwendet typische Bundessätze als erste Einordnung. Landesrecht, pauschale Beihilfe,
Heilfürsorge, Einkommensgrenzen und Sonderfälle können abweichen. Die Kostenmodellierung
liefert bewusst keinen erfundenen PKV-Tarifbeitrag.
