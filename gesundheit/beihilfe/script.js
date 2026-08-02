(() => {
  const state = { children: 0 };
  const aidResult = document.querySelector('#aid-result');
  const aidBar = document.querySelector('#aid-bar');
  const resultText = document.querySelector('#result-text');
  const childrenOutput = document.querySelector('#children-output');
  const childrenField = document.querySelector('#children-field');
  const system = document.querySelector('#system');

  function updateAid() {
    const status = document.querySelector('input[name="status"]:checked')?.value || 'active';
    let aid = 50;
    if (status === 'retired' || status === 'spouse') aid = 70;
    if (status === 'child') aid = 80;
    if (status === 'active' && state.children >= 2) aid = 70;

    childrenField.hidden = status !== 'active';

    if (system.value === 'pauschal') {
      aidResult.textContent = 'Sondermodell';
      aidBar.style.width = '50%';
      resultText.textContent = 'Bei pauschaler Beihilfe beteiligt sich der Dienstherr typischerweise am Krankenversicherungsbeitrag statt einzelne Rechnungen anteilig zu erstatten. Die konkrete Landesregelung muss geprüft werden.';
    } else {
      aidResult.textContent = `${aid} %`;
      aidBar.style.width = `${aid}%`;
      resultText.textContent = system.value === 'land'
        ? `Typischer Ausgangswert: ${aid} %. Die Regelung Ihres Bundeslandes kann abweichen.`
        : `Die PKV würde typischerweise die verbleibenden ${100 - aid} % als Restkosten absichern.`;
    }
    document.querySelector('#hero-beihilfe').textContent = `${aid} %`;
    document.querySelector('#hero-rest').textContent = `${100 - aid} %`;
  }

  document.querySelectorAll('input[name="status"]').forEach(el => el.addEventListener('change', updateAid));
  system.addEventListener('change', updateAid);
  document.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
    state.children = Math.max(0, Math.min(6, state.children + Number(btn.dataset.step)));
    childrenOutput.textContent = state.children;
    updateAid();
  }));

  document.querySelectorAll('.toggle button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle button').forEach(x => x.setAttribute('aria-selected','false'));
    btn.setAttribute('aria-selected','true');
    document.querySelector('#profile-note').textContent = btn.dataset.profile === 'anwaerter'
      ? 'Anwärtertarife können deutlich günstiger starten, enden aber mit dem Statuswechsel. Die spätere Umstellung gehört deshalb von Anfang an in den Vergleich.'
      : 'Ob GKV oder PKV besser passt, ergibt sich erst aus einer vollständigen Gegenüberstellung.';
  }));

  const details = {
    ambulant: 'Arztwahl, Psychotherapie, Heilmittel, Hilfsmittel und Höchstsätze gehören zusammen. Der Ergänzungstarif entscheidet, welche Beihilfelücken geschlossen werden.',
    stationaer: 'Klinikzugang, privatärztliche Behandlung, Unterbringung und Reha sind getrennte Leistungsfragen. Wahlleistungen sind nur enthalten, wenn sie ausdrücklich versichert wurden.',
    zahn: 'Bei Zahnleistungen treffen Beihilfebegrenzungen, Gebührenordnung, Materialkosten und Tarifleistung aufeinander. Prozentangaben allein reichen nicht.',
    familie: 'Kinder und berücksichtigungsfähige Angehörige verändern Beihilfesatz, Restkostenanteil und Gesamtbeitrag. Jede Person braucht eine eigene Betrachtung.'
  };
  document.querySelectorAll('.explorer button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.explorer button').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector('#detail').textContent = details[btn.dataset.detail];
  }));

  updateAid();
})();