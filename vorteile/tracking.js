/* Vorbereitete Event-Schnittstelle: keine Übertragung, Warteschlange oder Speicherung. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.BrinkmannTracking = factory(root.BrinkmannContext, {
    debug: root.BRINKMANN_CONFIG?.developmentDebug === true,
    logger: root.console
  });
})(typeof window !== 'undefined' ? window : globalThis, function createTracking(context, options) {
  'use strict';
  options = options || {};
  const eventTypes = new Set(['opened', 'page_view', 'cta_click', 'share_click']);

  async function trackEvent(payload) {
    if (!payload || !eventTypes.has(payload.eventType)) return null;
    const identity = context.getContext();
    const event = Object.freeze({
      token: identity.token,
      tokenType: identity.tokenType,
      eventType: payload.eventType,
      page: typeof payload.page === 'string' ? payload.page.slice(0, 160) : null,
      cta: typeof payload.cta === 'string' ? payload.cta.slice(0, 200) : null,
      timestamp: new Date().toISOString()
    });
    if (options.debug === true) options.logger?.debug?.('[Vorteilsheft]', event);

    // TODO: Später hier den freigegebenen API-Transport ergänzen (POST /api/events).
    // Vorher serverseitige Validierung und ggf. Einwilligung prüfen.
    // Aktuell ausdrücklich kein fetch/sendBeacon, kein Browser-Speicher, keine Retries.
    return event;
  }

  return Object.freeze({ trackEvent });
});
