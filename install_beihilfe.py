#!/usr/bin/env python3
from pathlib import Path
import shutil, re

project = Path.cwd()
health = project / "gesundheit" / "index.html"
sitemap = project / "sitemap.xml"

teaser = """
<section class="beihilfe-teaser" aria-labelledby="beihilfe-teaser-title">
  <div class="beihilfe-teaser__inner">
    <p class="eyebrow">Für Beamte und Anwärter</p>
    <h2 id="beihilfe-teaser-title">Beihilfe klingt kompliziert. Das Prinzip ist es nicht.</h2>
    <p>Wie hoch ist der Anteil des Dienstherrn? Was bleibt für die private Krankenversicherung? Und wann ist die GKV trotzdem einen genauen Blick wert?</p>
    <a class="editorial-link" href="/gesundheit/beihilfe/">Beihilfe verständlich erklärt →</a>
  </div>
</section>
"""

style = """
<style id="beihilfe-teaser-style">
.beihilfe-teaser{padding:clamp(56px,8vw,104px) 0;border-top:1px solid var(--line,#dce3e1);border-bottom:1px solid var(--line,#dce3e1)}
.beihilfe-teaser__inner{width:min(1180px,calc(100% - 36px));margin:auto}
.beihilfe-teaser h2{max-width:850px}
.beihilfe-teaser p:not(.eyebrow){max-width:720px;color:var(--muted,#617074)}
.beihilfe-teaser .editorial-link{display:inline-flex;min-height:44px;align-items:center;margin-top:14px;font-weight:750}
</style>
"""

if health.exists():
    text = health.read_text(encoding="utf-8")
    if "beihilfe-teaser-title" not in text:
        shutil.copy2(health, health.with_suffix(".html.bak"))
        if "</head>" in text and "beihilfe-teaser-style" not in text:
            text = text.replace("</head>", style + "\n</head>", 1)
        if "</main>" in text:
            text = text.replace("</main>", teaser + "\n</main>", 1)
        else:
            text = text.replace("</body>", teaser + "\n</body>", 1)
        health.write_text(text, encoding="utf-8")
        print("Gesundheitsseite ergänzt:", health)
    else:
        print("Teaser bereits vorhanden.")
else:
    print("Hinweis: gesundheit/index.html nicht gefunden. Beihilfe-Seite wurde trotzdem installiert.")

if sitemap.exists():
    xml = sitemap.read_text(encoding="utf-8")
    url = "https://hanse-konzept.de/gesundheit/beihilfe/"
    if url not in xml:
        shutil.copy2(sitemap, sitemap.with_suffix(".xml.bak"))
        entry = f"\n  <url><loc>{url}</loc></url>\n"
        xml = xml.replace("</urlset>", entry + "</urlset>")
        sitemap.write_text(xml, encoding="utf-8")
        print("Sitemap ergänzt:", sitemap)
    else:
        print("Sitemap-Eintrag bereits vorhanden.")
else:
    print("Keine sitemap.xml gefunden; nichts geändert.")

print("Fertig. Bitte git status prüfen.")
