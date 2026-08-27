#!/usr/bin/env python3
from pathlib import Path
import shutil
project=Path.cwd();unternehmen=project/'unternehmen'/'index.html';sitemap=project/'sitemap.xml'
teaser='''
<section class="bkv-teaser" aria-labelledby="bkv-teaser-title">
  <div class="bkv-teaser__inner">
    <p class="eyebrow">BETRIEBLICHE KRANKENVERSICHERUNG</p>
    <h2 id="bkv-teaser-title">Gesunde Mitarbeiter. Starkes Unternehmen.</h2>
    <p>Ein Benefit, der im Recruiting sichtbar wird, im Alltag ankommt und Mitarbeiter langfristig an Ihr Unternehmen bindet.</p>
    <a class="editorial-link" href="/unternehmen/bkv/">bKV entdecken →</a>
  </div>
</section>
'''
style='''
<style id="bkv-teaser-style">
.bkv-teaser{padding:clamp(58px,8vw,106px) 0;border-top:1px solid var(--line,#dfe4e1);border-bottom:1px solid var(--line,#dfe4e1)}
.bkv-teaser__inner{width:min(1180px,calc(100% - 32px));margin:auto}.bkv-teaser h2{max-width:850px}.bkv-teaser p:not(.eyebrow){max-width:720px;color:var(--muted,#66716f)}.bkv-teaser .editorial-link{display:inline-flex;min-height:44px;align-items:center;margin-top:14px;font-weight:800}
</style>
'''
if unternehmen.exists():
    text=unternehmen.read_text(encoding='utf-8')
    if 'bkv-teaser-title' not in text:
        shutil.copy2(unternehmen,unternehmen.with_suffix('.html.bak-bkv'))
        if '</head>' in text:text=text.replace('</head>',style+'\n</head>',1)
        if '</main>' in text:text=text.replace('</main>',teaser+'\n</main>',1)
        else:text=text.replace('</body>',teaser+'\n</body>',1)
        unternehmen.write_text(text,encoding='utf-8');print('Unternehmensseite ergänzt.')
if sitemap.exists():
    xml=sitemap.read_text(encoding='utf-8');url='https://hanse-konzept.de/unternehmen/bkv/'
    if url not in xml:
        shutil.copy2(sitemap,sitemap.with_suffix('.xml.bak-bkv'));xml=xml.replace('</urlset>',f'\n  <url><loc>{url}</loc></url>\n</urlset>');sitemap.write_text(xml,encoding='utf-8');print('Sitemap ergänzt.')
print('Fertig. Bitte git status prüfen.')
