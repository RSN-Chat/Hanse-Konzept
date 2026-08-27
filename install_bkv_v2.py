from pathlib import Path
import shutil
p=Path.cwd(); f=p/'unternehmen'/'index.html'; s=p/'sitemap.xml'
teaser='''\n<section class="bkv-v2-teaser" aria-labelledby="bkv-v2-title"><div class="bkv-v2-teaser__inner"><p class="eyebrow">BETRIEBLICHE KRANKENVERSICHERUNG</p><h2 id="bkv-v2-title">Gesunde Mitarbeiter. Starkes Unternehmen.</h2><p>Ab 10 Mitarbeitern. Keine Gesundheitsprüfung. Keine Wartezeit. Feste Gesundheitsbudgets mit konkreter Kostenstruktur.</p><a class="editorial-link" href="/unternehmen/bkv/">bKV konkret ansehen →</a></div></section>\n'''
style='''\n<style id="bkv-v2-teaser-style">.bkv-v2-teaser{padding:clamp(58px,8vw,106px) 0;border-top:1px solid var(--line,#dfe6e2);border-bottom:1px solid var(--line,#dfe6e2)}.bkv-v2-teaser__inner{width:min(1180px,calc(100% - 28px));margin:auto}.bkv-v2-teaser h2{max-width:900px}.bkv-v2-teaser p:not(.eyebrow){max-width:760px;color:var(--muted,#64716e)}.bkv-v2-teaser .editorial-link{display:inline-flex;min-height:44px;align-items:center;margin-top:14px;font-weight:850}</style>\n'''
if f.exists():
 t=f.read_text(encoding='utf-8')
 if 'bkv-v2-title' not in t:
  shutil.copy2(f,f.with_suffix('.html.bak-bkv-v2'))
  if '</head>' in t and 'bkv-v2-teaser-style' not in t:t=t.replace('</head>',style+'\n</head>',1)
  if '</main>' in t:t=t.replace('</main>',teaser+'\n</main>',1)
  else:t=t.replace('</body>',teaser+'\n</body>',1)
  f.write_text(t,encoding='utf-8')
  print('Unternehmensseite aktualisiert.')
if s.exists():
 x=s.read_text(encoding='utf-8');u='https://www.hanse-konzept.de/unternehmen/bkv/'
 if u not in x and 'https://hanse-konzept.de/unternehmen/bkv/' not in x:
  shutil.copy2(s,s.with_suffix('.xml.bak-bkv-v2'));x=x.replace('</urlset>',f'  <url><loc>{u}</loc></url>\n</urlset>');s.write_text(x,encoding='utf-8');print('Sitemap ergänzt.')
print('bKV V2 installiert. Jetzt git status prüfen.')
