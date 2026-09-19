/* URL-Kontext, keine Identitätsprüfung und kein Abruf von Kundendaten. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.BrinkmannContext = factory(root.location.href);
})(typeof window !== 'undefined' ? window : globalThis, function createCustomerContext(href) {
  'use strict';
  const source = new URL(href);
  const params = source.searchParams;
  // Nur syntaktische Prüfung. Ob ein Token existiert, entscheidet später der Server.
  const isValidToken = token => typeof token === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(token);
  const personal = params.getAll('k');
  const referral = params.getAll('r');
  // Doppelte oder gemischte Kontextparameter sind mehrdeutig: neutral fortfahren.
  const unambiguous = personal.length + referral.length === 1;
  const customerToken = unambiguous && personal.length === 1 && isValidToken(personal[0]) ? personal[0] : null;
  const referralToken = unambiguous && referral.length === 1 && isValidToken(referral[0]) ? referral[0] : null;
  const context = Object.freeze({
    token: customerToken || referralToken,
    tokenType: customerToken ? 'customer' : referralToken ? 'referral' : 'anonymous'
  });

  function createReferralLink(publicUrl) {
    const url = new URL(publicUrl || source.href, source);
    if (!['http:', 'https:'].includes(url.protocol)) {
      // Lokale Datei ist kein teilbarer öffentlicher Link.
      return 'https://example.com/vorteile/';
    }
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    // Ein r-Besucher ist kein Kunde. Ohne k wird bewusst neutral geteilt.
    if (customerToken) url.searchParams.set('r', customerToken);
    return url.href;
  }

  return Object.freeze({
    getCustomerToken: () => customerToken,
    getReferralToken: () => referralToken,
    getContext: () => context,
    createReferralLink,
    isValidToken
  });
});
