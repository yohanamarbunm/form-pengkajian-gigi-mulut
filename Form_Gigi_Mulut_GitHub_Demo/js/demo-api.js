/* Local-only mock API for public demo. Never use with real patient data. */
(() => {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : (input?.url || '');
    if (!/192\.168\.137\.219\/Aplikasita\/Api\//i.test(url)) return nativeFetch(input, init);
    let payload = {};
    try { payload = init.body ? JSON.parse(init.body) : {}; } catch (_) {}
    const records = JSON.parse(localStorage.getItem('rsudTarutungDemoApiLog') || '[]');
    records.push({ at: new Date().toISOString(), endpoint: url.split('/').pop().split('?')[0], payload });
    localStorage.setItem('rsudTarutungDemoApiLog', JSON.stringify(records));
    let body = { status: 'success', message: 'Simulasi demo lokal berhasil.' };
    if (/\/login(?:\?|$)/i.test(url)) body = { status: 'success', message: 'Login demo berhasil', role: payload.role || 'perawat' };
    if (/checksesi/i.test(url)) body = { status: 'success', sesi: 1 };
    return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
})();
