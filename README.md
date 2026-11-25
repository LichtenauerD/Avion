# Là-haut

Un tap quand tu entends un avion : la page trouve l'avion le plus proche au-dessus de toi (carte, tracé, route, compagnie).

En ligne : https://lichtenauerd.github.io/Avion/

## Données et relais

Les API ADS-B publiques (adsb.lol, adsb.fi, airplanes.live, OpenSky) n'autorisent pas les appels directs depuis un navigateur.
La page passe donc par un relais :

- par défaut, des relais publics gratuits (codetabs, allorigins), parfois lents ou saturés ;
- pour plus de fiabilité, déploie `worker.js` sur Cloudflare Workers (gratuit) et colle son adresse dans `const PROXY=''` de `index.html`.
