#!/usr/bin/env python3
from pathlib import Path
import shutil

project = Path.cwd()
html_path = project / "unternehmen" / "bkv" / "index.html"
js_path = project / "unternehmen" / "bkv" / "script.js"

if not html_path.exists() or not js_path.exists():
    raise SystemExit("bKV-Seite nicht gefunden: erwartet unternehmen/bkv/index.html und script.js")

shutil.copy2(html_path, html_path.with_suffix(".html.bak-v2-1"))
shutil.copy2(js_path, js_path.with_suffix(".js.bak-v2-1"))

html = html_path.read_text(encoding="utf-8")

html = html.replace(
    '<div><strong>ab 10</strong><span>Mitarbeitern möglich</span></div>',
    '<div><strong>ab 5*</strong><span>Mitarbeitern möglich</span></div>'
)

hero_marker = '        <div class="hero-actions">'
if "hero-fineprint" not in html:
    html = html.replace(
        hero_marker,
        '        <p class="fineprint hero-fineprint">* Bei bestehendem ARAG Firmen-Rechtsschutz. Ohne diesen gilt regulär eine Mindestgröße von 10 versicherten Personen.</p>\\n\\n' + hero_marker,
        1
    )

html = html.replace(
    "ab 10 zu versichernden Personen im gleichen Tarif.",
    "ab 10 zu versichernden Personen im gleichen Tarif – beziehungsweise bereits ab 5 Personen, wenn im Unternehmen ein ARAG Firmen-Rechtsschutz besteht."
)

html = html.replace(
    "Für die Business-Line-Tarife gilt grundsätzlich eine Mindestanzahl von 10 zu versichernden Personen im gleichen Tarif.",
    "Grundsätzlich gilt eine Mindestanzahl von 10 zu versichernden Personen im gleichen Tarif. Besteht im Unternehmen bereits ein ARAG Firmen-Rechtsschutz, ist der Einstieg nach aktueller Vertriebsregel bereits ab 5 Personen möglich."
)

old_block = """          <div class="control">
            <label for="employees">Wie viele Mitarbeiter sollen versichert werden?</label>
            <div class="range-row">
              <input type="range" id="employees" min="10" max="60" step="1" value="20">
              <output id="employeesOut">20</output>
            </div>
          </div>"""

new_block = """          <div class="control">
            <span class="control-label">Besteht bereits ein ARAG Firmen-Rechtsschutz?</span>
            <div class="segmented">
              <button type="button" class="active" data-rs="yes">Ja</button>
              <button type="button" data-rs="no">Nein</button>
            </div>
          </div>

          <div class="control">
            <label for="employees">Wie viele Mitarbeiter sollen versichert werden?</label>
            <div class="range-row">
              <input type="range" id="employees" min="5" max="60" step="1" value="10">
              <output id="employeesOut">10</output>
            </div>
            <p class="fineprint" id="eligibilityHint">Mit bestehendem ARAG Firmen-Rechtsschutz ist der Einstieg ab 5 Personen möglich.</p>
          </div>"""

if old_block in html:
    html = html.replace(old_block, new_block, 1)

html_path.write_text(html, encoding="utf-8")

js = js_path.read_text(encoding="utf-8")

js = js.replace(
    "let tariff = 'comfort';",
    "let tariff = 'comfort';\\n  let hasAragRs = true;\\n  const eligibilityHint = document.querySelector('#eligibilityHint');"
)

old_logic = """    if (count > 20) {
      priceResult.hidden = true;
      quoteState.hidden = false;
      return;
    }

    priceResult.hidden = false;
    quoteState.hidden = true;
"""

new_logic = """    const minCount = hasAragRs ? 5 : 10;

    if (count < minCount) {
      priceResult.hidden = true;
      quoteState.hidden = false;
      quoteState.querySelector('span').textContent = hasAragRs ? 'Noch nicht genügend Personen' : 'Regulär ab 10 Personen';
      quoteState.querySelector('strong').textContent = hasAragRs ? 'Mindestens 5 Personen erforderlich' : 'Mindestens 10 Personen erforderlich';
      quoteState.querySelector('p').textContent = hasAragRs
        ? 'Mit bestehendem ARAG Firmen-Rechtsschutz ist der Einstieg nach aktueller Vertriebsregel ab 5 versicherten Personen möglich.'
        : 'Ohne bestehenden ARAG Firmen-Rechtsschutz gilt die reguläre Mindestgröße von 10 versicherten Personen.';
      return;
    }

    if (count > 20) {
      priceResult.hidden = true;
      quoteState.hidden = false;
      quoteState.querySelector('span').textContent = 'Ab 21 versicherten Personen';
      quoteState.querySelector('strong').textContent = 'Individuelles Angebot';
      quoteState.querySelector('p').textContent = 'Bei mehr als 20 Arbeitnehmern wird der Beitrag auf Basis der Mitarbeiterstruktur individuell kalkuliert.';
      return;
    }

    priceResult.hidden = false;
    quoteState.hidden = true;
"""

if old_logic in js:
    js = js.replace(old_logic, new_logic, 1)

needle = "  budgetLevel.addEventListener('change', updateCalculator);\\n"
addition = r"""
  document.querySelectorAll('[data-rs]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-rs]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      hasAragRs = button.dataset.rs === 'yes';
      employees.min = hasAragRs ? '5' : '10';
      if (!hasAragRs && Number(employees.value) < 10) {
        employees.value = '10';
      }
      if (eligibilityHint) {
        eligibilityHint.textContent = hasAragRs
          ? 'Mit bestehendem ARAG Firmen-Rechtsschutz ist der Einstieg ab 5 Personen möglich.'
          : 'Ohne bestehenden ARAG Firmen-Rechtsschutz gilt die reguläre Mindestgröße von 10 Personen.';
      }
      updateCalculator();
    });
  });

"""

if "[data-rs]" not in js and needle in js:
    js = js.replace(needle, needle + addition, 1)

js_path.write_text(js, encoding="utf-8")

print("bKV V2.1 eingespielt.")
print("Hinweis: Für 5–9 Personen wurden keine neuen Beitragssätze erfunden.")
print("Bitte jetzt git status prüfen.")
