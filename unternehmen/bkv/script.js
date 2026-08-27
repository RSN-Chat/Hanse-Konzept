(() => {
  const serviceCopy = {
    vorsorge:{eyebrow:"VORSORGE & PRÄVENTION",title:"Früher erkennen. Schneller handeln.",text:"Je nach gewähltem Tarif können Vorsorgeuntersuchungen und Präventionsleistungen deutlich über das gesetzliche Niveau hinaus ergänzt werden."},
    zahn:{eyebrow:"ZAHNLEISTUNGEN",title:"Ein Benefit, den fast jeder versteht.",text:"Professionelle Zahnreinigung, hochwertige Füllungen und Zahnersatz gehören zu den Leistungen, die Mitarbeiter unmittelbar wahrnehmen."},
    sehen:{eyebrow:"SEHHILFEN",title:"Brille oder Kontaktlinsen – ohne große Hürde.",text:"Je nach Tarif können regelmäßige Budgets für Sehhilfen zur Verfügung stehen. Einfach, verständlich und sofort nutzbar."},
    alternativ:{eyebrow:"ALTERNATIVMEDIZIN",title:"Mehr Auswahl bei der Behandlung.",text:"Osteopathie, Heilpraktikerleistungen oder Akupunktur können – abhängig vom Tarif – ergänzt werden."},
    mental:{eyebrow:"MENTAL HEALTH",title:"Unterstützung, bevor Belastung zum Ausfall wird.",text:"Moderne bKV-Lösungen können Angebote rund um psychische Gesundheit, digitale Services oder Beratungsleistungen einbinden."}
  };
  const detail=document.querySelector('#serviceDetail');
  document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{const c=serviceCopy[button.dataset.service];detail.innerHTML=`<p class="eyebrow">${c.eyebrow}</p><h3>${c.title}</h3><p>${c.text}</p>`;}));
  const employees=document.querySelector('#employees'),budget=document.querySelector('#budget'),employeesOut=document.querySelector('#employeesOut'),budgetOut=document.querySelector('#budgetOut'),monthlyOut=document.querySelector('#monthlyOut');
  const euro=v=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v);
  function update(){const e=Number(employees.value),b=Number(budget.value);employeesOut.textContent=e;budgetOut.textContent=euro(b);monthlyOut.textContent=euro(e*b);} employees.addEventListener('input',update);budget.addEventListener('input',update);update();
  const form=document.querySelector('#contactForm');form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form),subject=encodeURIComponent('bKV-Anfrage über hanse-konzept.de'),body=encodeURIComponent(`Name: ${d.get('name')||''}\nUnternehmen: ${d.get('company')||''}\nKontakt: ${d.get('contact')||''}\nMitarbeiter: ${d.get('employees')||''}\n\nIch interessiere mich für eine betriebliche Krankenversicherung.`);window.location.href=`mailto:Stephan.Brinkmann@arag-partner.de?subject=${subject}&body=${body}`;});
})();
