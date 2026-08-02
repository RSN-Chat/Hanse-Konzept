#!/usr/bin/env python3
from pathlib import Path
import shutil
project=Path.cwd();health=project/'gesundheit'/'index.html';sitemap=project/'sitemap.xml'
teaser='''\n<section class="beihilfe-editorial-teaser" aria-labelledby="beihilfe-editorial-title"><div class="beihilfe-editorial-teaser__inner"><p class="eyebrow">Für Beamtenanwärter und Beamte</p><h2 id="beihilfe-editorial-title">Sie haben die Verbeamtung geschafft. Jetzt ändert sich Ihr Krankenversicherungssystem.</h2><p>Warum Beamte Beihilfe bekommen, welchen Anteil sie selbst versichern und welche Frage vor jedem Tarifvergleich geklärt werden muss.</p><a class="editorial-link" href="/gesundheit/beihilfe/">Beihilfe von Anfang an verstehen →</a></div></section>\n'''
style='''<style id="beihilfe-editorial-teaser-style">.beihilfe-editorial-teaser{padding:clamp(60px,9vw,112px) 0;border-top:1px solid var(--line,#dbe2df);border-bottom:1px solid var(--line,#dbe2df)}.beihilfe-editorial-teaser__inner{width:min(1180px,calc(100% - 28px));margin:auto}.beihilfe-editorial-teaser h2{max-width:900px}.beihilfe-editorial-teaser p:not(.eyebrow){max-width:740px;color:var(--muted,#66777b)}.beihilfe-editorial-teaser .editorial-link{display:inline-flex;min-height:44px;align-items:center;margin-top:14px;font-weight:800}</style>'''
if health.exists():
 text=health.read_text(encoding='utf-8')
 if 'beihilfe-editorial-title' not in text:
  shutil.copy2(health,health.with_suffix('.html.bak'))
  if '</head>' in text:text=text.replace('</head>',style+'\n</head>',1)
  if '</main>' in text:text=text.replace('</main>',teaser+'\n</main>',1)
  else:text=text.replace('</body>',teaser+'\n</body>',1)
  health.write_text(text,encoding='utf-8')
if sitemap.exists():
 xml=sitemap.read_text(encoding='utf-8');url='https://hanse-konzept.de/gesundheit/beihilfe/'
 if url not in xml:
  shutil.copy2(sitemap,sitemap.with_suffix('.xml.bak'));xml=xml.replace('</urlset>',f'\n  <url><loc>{url}</loc></url>\n</urlset>');sitemap.write_text(xml,encoding='utf-8')
print('Fertig. Bitte git status prüfen.')
