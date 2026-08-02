#!/usr/bin/env python3
from pathlib import Path
import shutil

project = Path.cwd()
health = project / "gesundheit" / "index.html"
sitemap = project / "sitemap.xml"

teaser = """
<section class="beihilfe-premium-teaser" aria-labelledby="beihilfe-premium-title">
  <div class="beihilfe-premium-teaser__inner">
    <p class="eyebrow">Für Beamtenanwärter und Beamte</p>
    <h2 id="beihilfe-premium-title">Die Beihilfe richtig nutzen. Ohne Amtsdeutsch.</h2>
    <p>GKV oder Beihilfe plus PKV? Welche Kosten übernimmt der Dienstherr? Und welcher Rest muss tatsächlich versichert werden?</p>
    <a class="editorial-link" href="/gesundheit/beihilfe/">Beihilfe verständlich erklärt →</a>
  </div>
</section>
"""

style = """
<style id="beihilfe-premium-teaser-style">
.beihilfe-premium-teaser{padding:clamp(58px,8vw,106px) 0;border-top:1px solid var(--line,#dbe2e1);border-bottom:1px solid var(--line,#dbe2e1)}
.beihilfe-premium-teaser__inner{width:min(1180px,calc(100% - 36px));margin:auto}
.beihilfe-premium-teaser h2{max-width:850px}
.beihilfe-premium-teaser p:not(.eyebrow){max-width:740px;color:var(--muted,#637277)}
.beihilfe-premium-teaser .editorial-link{display:inline-flex;min-height:44px;align-items:center;margin-top:14px;font-weight:780}
</style>
"""

if health.exists():
    text = health.read_text(encoding="utf-8")
    if "beihilfe-premium-title" not in text:
        shutil.copy2(health, health.with_suffix(".html.bak"))
        if "</head>" in text and "beihilfe-premium-teaser-style" not in text:
            text = text.replace("</head>", style + "\n</head>", 1)
        if "</main>" in text:
            text = text.replace("</main>", teaser + "\n</main>", 1)
        else:
            text = text.replace("</body>", teaser + "\n</body>", 1)
        health.write_text(text, encoding="utf-8")
        print("Gesundheitsseite ergänzt.")
    else:
        print("Beihilfe-Teaser bereits vorhanden.")
else:
    print("Hinweis: gesundheit/index.html wurde nicht gefunden.")

if sitemap.exists():
    xml = sitemap.read_text(encoding="utf-8")
    url = "https://hanse-konzept.de/gesundheit/beihilfe/"
    if url not in xml:
        shutil.copy2(sitemap, sitemap.with_suffix(".xml.bak"))
        xml = xml.replace("</urlset>", f"\n  <url><loc>{url}</loc></url>\n</urlset>")
        sitemap.write_text(xml, encoding="utf-8")
        print("Sitemap ergänzt.")
else:
    print("Keine sitemap.xml gefunden.")

print("Installation abgeschlossen. Bitte git status prüfen.")
