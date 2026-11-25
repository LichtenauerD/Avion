// Relais CORS pour « Là-haut », à déployer gratuitement sur Cloudflare Workers.
// Il récupère les données côté serveur et ajoute l'en-tête qui autorise la page à les lire.
// Seuls les serveurs listés ci-dessous sont relayés, ce n'est pas un proxy ouvert.
const ALLOW = [
  'api.adsb.lol',
  'opendata.adsb.fi',
  'api.airplanes.live',
  'api.adsbdb.com',
  'opensky-network.org',
];
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const target = new URL(request.url).searchParams.get('url');
    if (!target) return new Response('Paramètre url manquant', { status: 400, headers: CORS });
    let u;
    try { u = new URL(target); } catch { return new Response('URL invalide', { status: 400, headers: CORS }); }
    if (u.protocol !== 'https:' || !ALLOW.includes(u.hostname)) {
      return new Response('Hôte non autorisé', { status: 403, headers: CORS });
    }
    const upstream = await fetch(u.toString(), {
      headers: { 'User-Agent': 'la-haut (github.com/LichtenauerD/Avion)', Accept: 'application/json' },
      cf: { cacheTtl: 3, cacheEverything: true },
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...CORS,
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'max-age=3',
      },
    });
  },
};
