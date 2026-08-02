#!/usr/bin/env python3
from pathlib import Path
import shutil, re, json

project = Path.cwd()
backup_root = project / '.compliance-backup'
backup_root.mkdir(exist_ok=True)

def backup(path):
    if not path.exists(): return
    target = backup_root / path.relative_to(project)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, target)

def patch_footer(path):
    text = path.read_text(encoding='utf-8', errors='ignore')
    original = text
    text = re.sub(r'href=["\']#?["\']([^>]*?)>\s*Impressum\s*<', r'href="/impressum/"\1>Impressum<', text, flags=re.I)
    text = re.sub(r'href=["\']#?["\']([^>]*?)>\s*Datenschutz\s*<', r'href="/datenschutz/"\1>Datenschutz<', text, flags=re.I)
    text = re.sub(r'href=["\']/["\']([^>]*?)>\s*Impressum\s*<', r'href="/impressum/"\1>Impressum<', text, flags=re.I)
    text = re.sub(r'href=["\']/["\']([^>]*?)>\s*Datenschutz\s*<', r'href="/datenschutz/"\1>Datenschutz<', text, flags=re.I)
    if 'KI-Transparenz' not in text and '/datenschutz/' in text:
        text = re.sub(r'(<a[^>]+href=["\']/datenschutz/["\'][^>]*>\s*Datenschutz\s*</a>)', r'\1 <a href="/ki-transparenz/">KI-Transparenz</a>', text, count=1, flags=re.I)
    if text != original:
        backup(path)
        path.write_text(text, encoding='utf-8')
        return True
    return False

changed=[]
for html in project.rglob('*.html'):
    if '.compliance-backup' in html.parts: continue
    if patch_footer(html): changed.append(str(html.relative_to(project)))

sitemap = project/'sitemap.xml'
if sitemap.exists():
    xml=sitemap.read_text(encoding='utf-8')
    original=xml
    for url in ['https://hanse-konzept.de/impressum/','https://hanse-konzept.de/datenschutz/','https://hanse-konzept.de/ki-transparenz/']:
        if url not in xml:
            xml=xml.replace('</urlset>', f'  <url><loc>{url}</loc></url>\n</urlset>')
    if xml != original:
        backup(sitemap); sitemap.write_text(xml,encoding='utf-8'); changed.append('sitemap.xml')

keywords={
 'KI/Chat':['openai','chatbot','ki-assistent','ai-assistant'],
 'Analytics':['google-analytics','gtag(','matomo','plausible','facebook pixel','meta pixel'],
 'Externe Medien':['youtube.com','maps.google','cal.com','calendly','vimeo'],
 'Fonts':['fonts.googleapis.com','fonts.gstatic.com']
}
findings={}
for html in project.rglob('*.html'):
    if '.compliance-backup' in html.parts: continue
    low=html.read_text(encoding='utf-8',errors='ignore').lower()
    for label,terms in keywords.items():
        hits=[t for t in terms if t in low]
        if hits: findings.setdefault(label,[]).append({'file':str(html.relative_to(project)),'hits':hits})
(project/'COMPLIANCE_SCAN.json').write_text(json.dumps(findings,indent=2,ensure_ascii=False),encoding='utf-8')
print('Compliance-Update eingespielt.')
print('Geänderte bestehende Dateien:', ', '.join(changed) if changed else 'keine')
print('Backup:', backup_root)
print('Scan: COMPLIANCE_SCAN.json')
print('Jetzt bitte: git status')
