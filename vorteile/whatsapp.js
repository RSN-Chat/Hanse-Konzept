/* Ein zentraler URL-Erzeuger für alle direkten WhatsApp-CTAs.
 * Die echten Links öffnen ohne asynchronen Zwischenschritt einen neuen Tab.
 * Der Click-Handler erfasst das Event vor der nativen Linknavigation. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BrinkmannWhatsApp = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function createLink(message, number, share = false) {
    const recipient = share ? '' : String(number).replace(/\D/g, '');
    return `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
  }
  return Object.freeze({ createLink });
});
