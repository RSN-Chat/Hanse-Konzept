'use strict';

(() => {
  const config = window.BRINKMANN_CONFIG;
  const topics = window.BRINKMANN_TOPICS;
  const context = window.BrinkmannContext;
  const { trackEvent } = window.BrinkmannTracking;
  const $ = selector => document.querySelector(selector);
  const reader = $('#reader'), book = $('#book'), page = $('#page');
  const layer = $('#turn-layer'), tabs = $('#tabs');
  const mobile = matchMedia('(max-width: 849px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coverMarkup = page.innerHTML;
  const colors = ['#dbe0c9', '#cddcd6', '#e7dac0', '#dadbc2', '#d2d9dc', '#d8cfc0', '#c6d9cf', '#dbcbac'];
  let current = readHash(), turning = false, pending = null;
  let gesture = null, suppressClickUntil = 0;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function readHash() {
    const match = location.hash.match(/^#seite-([1-8])$/);
    return match ? Number(match[1]) : 0;
  }
  function pageName() { return current ? topics[current - 1].title : 'Cover'; }
  function record(eventType, cta = null) {
    // Auch ein späterer Transportfehler darf Navigation/WhatsApp nie blockieren.
    void trackEvent({ eventType, page: pageName(), cta }).catch(() => {});
  }
  function safeUrl(value, fallback) {
    if (!value || typeof value !== 'string') return fallback;
    try {
      const url = new URL(value, location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : fallback;
    } catch { return fallback; }
  }
  function placeholder(url) { return new URL(url, location.href).hostname === 'example.com'; }
  function referralUrl() {
    return context.createReferralLink(safeUrl(config.shareUrl, location.href));
  }
  function whatsappHref(topic, share = false) {
    const message = share ? topic.message.replace('[REFERRAL-LINK]', referralUrl()) : topic.message;
    return window.BrinkmannWhatsApp.createLink(message, config.whatsappNumber, share);
  }

  function voucherMarkup(topic) {
    const v = topic.voucher;
    const href = whatsappHref(topic);
    return `<section class="accident-voucher" aria-label="40 % Gutschein für eine neue Unfallabsicherung">
      <h3 class="voucher-heading"><span class="voucher-amount">${escapeHtml(v.amount)}</span> <span class="voucher-label">${escapeHtml(v.label)}</span></h3>
      <p class="voucher-offer"><strong class="voucher-deadline">${escapeHtml(v.deadline)}</strong> ${escapeHtml(v.offer).replace('40 %', '<span class="keep-together">40 %</span>')} <strong class="voucher-subject">${escapeHtml(v.subject)}</strong></p>
      <a class="topic-cta voucher-cta" data-whatsapp href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(topic.cta)}</span><span class="cta-arrow" aria-hidden="true">↗</span></a>
      <p class="voucher-terms">${escapeHtml(v.terms)}</p>
    </section>`;
  }

  function markup(index) {
    if (!index) return coverMarkup;
    const t = topics[index - 1];
    const ctaContent = `<span>${escapeHtml(t.cta)}</span><span class="cta-arrow" aria-hidden="true">↗</span>`;
    const cta = index === 7
      ? `<a class="topic-cta" data-share href="${escapeHtml(whatsappHref(t, true))}" target="_blank" rel="noopener noreferrer">${ctaContent}</a>`
      : `<a class="topic-cta" data-whatsapp href="${escapeHtml(whatsappHref(t))}" target="_blank" rel="noopener noreferrer">${ctaContent}</a>`;
    return `<div class="sheet-heading"><span class="topic-title">${escapeHtml(t.title)}</span><span class="folio" aria-hidden="true">${String(index).padStart(2, '0')}</span></div>
      <h2 id="page-title">${escapeHtml(t.headline)}</h2>
      <div class="copy">${t.blocks.map(block => block.type === 'list'
        ? `<ul class="topic-lines">${block.items.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>`
        : `<p class="copy-${block.type}">${escapeHtml(block.text)}</p>`).join('')}</div>
      ${index === 1 ? `<figure class="discount-graphic"><a href="assets/arag-nachlassmodell.png" target="_blank" rel="noopener noreferrer" aria-label="ARAG-Nachlassgrafik in Originalgröße ansehen"><img src="assets/arag-nachlassmodell.png" width="908" height="531" alt="Kein Schaden? Weniger Beitrag! Nachlass nach schadenfreien Jahren: 5 % nach einem halben Jahr, 10 % nach einem Jahr, 20 % nach 2–3 Jahren, 30 % nach 4–5 Jahren, 40 % nach 6–7 Jahren und 50 % ab 8 Jahren." decoding="async"></a></figure>` : ''}
      ${t.voucher ? voucherMarkup(t) : `<div class="coupon"><div class="coupon-rule" aria-hidden="true"></div>${cta}<div class="coupon-caption"><span>Generalagentur Brinkmann</span><span>Seite ${index}</span></div></div>`}`;
  }
  function arrangeRegisters(animate = false) {
    const focused = tabs.contains(document.activeElement) ? document.activeElement : null;
    const buttons = Array.from(tabs.querySelectorAll('[data-page]'));
    const oldTop = new Map(buttons.map(button => [button, button.getBoundingClientRect().top]));
    buttons.sort((a, b) => {
      const rank = button => mobile.matches && current ? (Number(button.dataset.page) - current + topics.length) % topics.length : Number(button.dataset.page);
      return rank(a) - rank(b);
    });
    buttons.forEach(button => tabs.append(button));
    if (focused) focused.focus({ preventScroll: true });
    if (animate && mobile.matches && !reduced.matches) {
      buttons.forEach(button => {
        const offset = oldTop.get(button) - button.getBoundingClientRect().top;
        if (!offset || !button.animate) return;
        const motion = button.animate([{ transform: `translateY(${offset}px)` }, { transform: 'translateY(-1px)' }], { duration: 400, easing: 'cubic-bezier(.25,.1,.25,1)' });
        motion.finished.then(() => motion.cancel()).catch(() => {});
      });
    }
  }
  function render() {
    page.className = current ? 'page' : 'page cover';
    page.style.setProperty('--tab-color', colors[current - 1] || colors[0]);
    page.innerHTML = markup(current);
    book.setAttribute('aria-label', current ? `Seite ${current} von 8: ${pageName()}` : 'Bestandskunden-Vorteilsheft: Cover');
    $('#position').textContent = current ? `Seite ${current} von 8` : 'Cover';
    $('#progress').value = current;
    $('#progress').setAttribute('aria-valuetext', current ? `Seite ${current} von 8` : 'Cover');
    $('#prev').disabled = current === 0;
    $('#next').disabled = current === topics.length;
    $('#cover-link').hidden = current === 0;
    tabs.querySelectorAll('[data-page]').forEach(button => {
      if (Number(button.dataset.page) === current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }
  function cleanClone(node) {
    node.removeAttribute('id');
    node.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    node.inert = true;
    return node;
  }

  async function turnTo(index, updateHash = true) {
    if (!Number.isInteger(index) || index < 0 || index > topics.length) return;
    if (turning) { pending = { index, updateHash }; return; }
    if (current === index) return;
    const forward = index > current;
    const old = cleanClone(page.cloneNode(true));
    const oldHeight = page.getBoundingClientRect().height;
    const restoreFocus = page.contains(document.activeElement);
    current = index;
    render();
    arrangeRegisters(true);
    record('page_view');
    if (updateHash) {
      // Der vorhandene Query-Kontext bleibt erhalten; keine erneute Token-Auswertung.
      try { history.replaceState(null, '', `${location.pathname}${location.search}${current ? `#seite-${current}` : '#cover'}`); }
      catch { /* file:// bleibt ohne History API benutzbar. */ }
    }
    if (restoreFocus || document.activeElement?.disabled) book.focus({ preventScroll: true });
    if (book.getBoundingClientRect().top < -80) book.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (reduced.matches || !layer.animate) return;

    turning = true;
    book.style.minHeight = `${Math.max(oldHeight, page.getBoundingClientRect().height)}px`;
    const sheet = forward ? old : cleanClone(page.cloneNode(true));
    let underlay;
    if (!forward) {
      underlay = document.createElement('div');
      underlay.className = 'turn-underlay';
      underlay.setAttribute('aria-hidden', 'true');
      underlay.inert = true;
      underlay.append(old);
      layer.before(underlay);
    }
    const shade = document.createElement('div');
    shade.className = 'turn-shade';
    layer.replaceChildren(sheet, shade);
    layer.classList.add('is-turning');
    const frames = mobile.matches ? [
      { transform: 'translateY(0) rotateX(0)', opacity: 1, offset: 0 },
      { transform: 'translateY(-8px) rotateX(7deg)', opacity: 1, offset: .2 },
      { transform: 'translateY(-30%) rotateX(66deg)', opacity: 0, offset: 1 }
    ] : [
      { transform: 'rotateY(0)', opacity: 1, offset: 0 },
      { transform: 'rotateY(-9deg) translateZ(4px)', opacity: 1, offset: .2 },
      { transform: 'rotateY(-100deg)', opacity: 0, offset: 1 }
    ];
    const timing = { duration: 540, easing: 'cubic-bezier(.3,.08,.25,1)', fill: 'both', direction: forward ? 'normal' : 'reverse' };
    const animation = layer.animate(frames, timing);
    const shadow = shade.animate([{ opacity: 0 }, { opacity: .8 }, { opacity: .15 }], timing);
    const tabMotion = mobile.matches ? tabs.animate([{ transform: 'translateY(12px)' }, { transform: 'translateY(0)' }], { duration: 420, easing: 'ease-out' }) : null;
    try { await animation.finished; }
    catch { /* Abgebrochene Animationen sperren das Heft nicht. */ }
    finally {
      animation.cancel(); shadow.cancel(); tabMotion?.cancel();
      layer.classList.remove('is-turning'); layer.replaceChildren(); underlay?.remove();
      book.style.minHeight = ''; turning = false;
      if (pending) { const next = pending; pending = null; turnTo(next.index, next.updateHash); }
    }
  }

  tabs.innerHTML = topics.map((topic, i) => `<button class="register-tab" data-page="${i + 1}" style="--tab-color:${colors[i]};--inset:${i * 1.5}px"><span class="tab-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="tab-title">${escapeHtml(topic.title)}</span></button>`).join('');
  reader.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
    const tab = event.target.closest('[data-page]');
    if (tab) turnTo(Number(tab.dataset.page));
    if (event.target.closest('[data-open]')) turnTo(1);
    if (event.target.closest('[data-whatsapp]')) record('cta_click', topics[current - 1].eventCta || topics[current - 1].cta);
    if (event.target.closest('[data-share]')) {
      // Keine asynchrone Weiterleitung: der echte Link öffnet WhatsApp unmittelbar.
      record('cta_click', topics[6].cta);
      record('share_click', topics[6].cta);
    }
  });
  $('#prev').onclick = () => turnTo(current - 1);
  $('#next').onclick = () => turnTo(current + 1);
  $('#cover-link').onclick = () => turnTo(0);
  reader.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.matches('input,textarea,select,[contenteditable="true"]')) return;
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); turnTo(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  // Am mobilen Blattrand und auf den Reitern wird vertikal geblättert.
  // Im Text bleibt natives Scrollen möglich; horizontales Wischen funktioniert zusätzlich.
  reader.addEventListener('pointerdown', event => {
    if (!event.isPrimary) { gesture = null; return; }
    if (turning || event.button !== 0) return;
    const vertical = mobile.matches && Boolean(event.target.closest('#turn-grip, #tabs'));
    const horizontal = Boolean(event.target.closest('#book')) && !event.target.closest('a,button');
    if (!vertical && (!horizontal || event.pointerType === 'mouse')) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp, vertical, captured: false };
  });
  reader.addEventListener('pointermove', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const along = gesture.vertical ? event.clientY - gesture.y : event.clientX - gesture.x;
    const across = gesture.vertical ? event.clientX - gesture.x : event.clientY - gesture.y;
    if (Math.abs(across) > 12 && Math.abs(across) > Math.abs(along)) { gesture = null; return; }
    if (Math.abs(along) > 8 && !gesture.captured) { reader.setPointerCapture(event.pointerId); gesture.captured = true; }
  });
  reader.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const along = gesture.vertical ? event.clientY - gesture.y : event.clientX - gesture.x;
    const across = gesture.vertical ? event.clientX - gesture.x : event.clientY - gesture.y;
    const elapsed = event.timeStamp - gesture.time;
    gesture = null;
    if (elapsed < 1400 && Math.abs(along) >= 40 && Math.abs(along) > Math.abs(across) * 1.4) {
      suppressClickUntil = performance.now() + 300;
      turnTo(current + (along < 0 ? 1 : -1));
    }
  });
  reader.addEventListener('pointercancel', () => { gesture = null; });
  reader.addEventListener('lostpointercapture', () => { gesture = null; });
  function updateHint() {
    $('#gesture-hint').textContent = mobile.matches ? 'Am Blattrand nach oben oder unten wischen' : 'Blättern oder einen Reiter aufschlagen';
  }
  mobile.addEventListener('change', () => { updateHint(); arrangeRegisters(); });

  document.querySelectorAll('[data-config]').forEach(link => {
    link.href = safeUrl(config[link.dataset.config], link.href);
    if (placeholder(link.href)) link.title = 'Platzhalter: endgültige URL vor Veröffentlichung ergänzen.';
  });
  window.addEventListener('hashchange', () => turnTo(readHash(), false));
  updateHint(); render(); arrangeRegisters();
  record('opened');
  record('page_view');
})();
