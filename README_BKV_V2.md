# Hanse-Konzept bKV – Update V2

## Installation
```bash
cd ~/Desktop/Software-Coding/Webseiten/Hanse-Konzept
unzip -o ~/Downloads/hanse-konzept-bkv-update-v2.zip
python3 install_bkv_v2.py
```

## Deployment
```bash
git status
rm -f unternehmen/index.html.bak-bkv-v2
git add unternehmen/bkv unternehmen/index.html install_bkv_v2.py README_BKV_V2.md
git add sitemap.xml 2>/dev/null || true
git commit -m "Rebuild bKV page with real tariff data"
git push origin main
```

## Fachliche Basis
- Arbeitgeber-FAQ bKV Stand 01/2026
- BudgetFlex Bedingungen Stand 04/2026
- BudgetFlex FAQ / Produktunterlagen
- Erstkontaktformular 09/2025

Maßgeblich bleiben Angebot, Kollektivrahmenvertrag und Versicherungsbedingungen.
