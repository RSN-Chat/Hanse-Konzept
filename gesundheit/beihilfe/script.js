(() => {
  const state = { children: 0 };

  const aidResult = document.querySelector('#aidResult');
  const aidBar = document.querySelector('#aidBar');
  const aidText = document.querySelector('#aidText');
  const childrenOutput = document.querySelector('#childrenOutput');
  const childrenField = document.querySelector('#childrenField');
  const aidSystem = document.querySelector('#aidSystem');

  function updateAid() {
    const status = document.querySelector('input[name="status"]:checked')?.value || 'active';
    let aid = 50;

    if (status === 'retired' || status === 'spouse') aid = 70;
    if (status === 'child') aid = 80;
    if (status === 'active' && state.children >= 2) aid = 70;

    childrenField.hidden = status !== 'active';

    if (aidSystem.value === 'pauschal') {
      aidResult.textContent = 'Sondermodell';
      aidBar.style.width = '50%';
      aidText.textContent = 'Bei pauschaler Beihilfe beteiligt sich der Dienstherr typischerweise am Krankenversicherungsbeitrag. Die konkrete Landesregelung muss gesondert geprüft werden.';
    } else {
      aidResult.textContent = `${aid} %`;
      aidBar.style.width = `${aid}%`;
      aidText.textContent = aidSystem.value === 'land'
        ? `Typischer Ausgangswert: ${aid} %. Das Landesrecht kann davon abweichen.`
        : `Die PKV würde typischerweise die verbleibenden ${100 - aid} Prozent als Restkosten absichern.`;
    }

    document.querySelector('#heroAid').textContent = `${aid} %`;
    document.querySelector('#heroPkv').textContent = `${100 - aid} %`;
  }

  document.querySelectorAll('input[name="status"]').forEach((el) => {
    el.addEventListener('change', updateAid);
  });

  document.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      state.children = Math.max(0, Math.min(6, state.children + Number(button.dataset.step)));
      childrenOutput.textContent = state.children;
      updateAid();
    });
  });

  aidSystem.addEventListener('change', updateAid);

  document.querySelectorAll('.profile-switch button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.profile-switch button').forEach((item) => item.setAttribute('aria-selected', 'false'));
      button.setAttribute('aria-selected', 'true');

      document.querySelector('#profileNote').textContent =
        button.dataset.profile === 'anwaerter'
          ? 'Anwärtertarife starten häufig deutlich günstiger, enden aber mit dem Statuswechsel. Die spätere Umstellung gehört deshalb zwingend in den Vergleich.'
          : 'Ein belastbarer Vergleich benötigt Status, Bundesland, Beihilfesatz, Gesundheitsdaten und gewünschte Leistungen.';
    });
  });

  const grossIncome = document.querySelector('#grossIncome');
  const grossOutput = document.querySelector('#grossOutput');
  const gkvEstimate = document.querySelector('#gkvEstimate');
  const costProfile = document.querySelector('#costProfile');
  const costAid = document.querySelector('#costAid');

  function formatEuro(value) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  }

  function updateCostModel() {
    const gross = Number(grossIncome.value);
    const cappedIncome = Math.min(gross, 5700);
    const modelRate = 0.175;
    const careRate = 0.036;
    const monthly = Math.round(cappedIncome * (modelRate + careRate));

    grossOutput.textContent = formatEuro(gross);
    gkvEstimate.textContent = `ca. ${formatEuro(monthly)}`;

    const profile = costProfile.value === 'anwaerter' ? 'Anwärtertarif' : 'Beamtentarif';
    const aid = costAid.value;
    document.querySelector('#pkvEstimate').textContent = `${profile} für ${100 - aid} % Restkosten`;
  }

  grossIncome.addEventListener('input', updateCostModel);
  costProfile.addEventListener('change', updateCostModel);
  costAid.addEventListener('change', updateCostModel);

  updateAid();
  updateCostModel();
})();