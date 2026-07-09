# URL Lyhentäjä

Pikainen Reacting ja Tailwindin harjoittelua varten tehty linkkien lyhennys sivu

## Preview

Sivua voi kokeilla osoitteessa https://link-gamma-seven.vercel.app/

## Ominaisuudet

- URL Osoitteiden lyhennys
- Lyhyestä linkistä automaattinen redirect pitkään linkkiin
- Admin paneeli, josta näkee kaikki tehdyt linkit sekä niiden klikkausmäärät
- Admin paneelista voi myös muokata lyhytlinkkejä!!
- Cloudflare Turnstile blockkaa botit!

## Käytetyt teknologiat

### Frontend
- ReactJS
- Tailwind CSS

### Backend
- Vercel (Node.js)
- PostgreSQL ja Prisma ORM

## Deployment

Tässä päästäkeksityt ohjeet projektin deployaamiseen. Tätä varmaan joku fiksu osaisi parantaa...

1. Forkkaa tämä repository ja cloonaa se omalle koneellesi.
2. Kirjaudu Cloudflareen (https://www.cloudflare.com/) ja mene kohtaan "Application security" > "Turnstile" ja paina "Add widget manually"
3. Lisää hostname (subdomain.domain.tld) eli osoite jossa tulet hostaamaan repositoryasi. Jos et aio käyttää custom domainia niin löydät vercelin sinulle määrittelemän osoitteen vercelistä. (Voit myös tulla määrittämään hostnamen vasta ihan lopuksi)
4. Ota talteen Site key ja Secret key.
5. Kirjaudu neon consoleen (https://console.neon.tech/) ja tee uusi projekti. Ota talteen saamasi connection string. (esim. "postgresql://neondb_owner:...").
6. Uudelleen nimeä projektin mukana tullut frontend .env tiedosto ".env.example.frontend" -> ".env" ja lisää tiedostoon oma cloudflare public key esimerkin mukaisesti.
7. Lataa Vercel Cli komennolla ```pnpm i -g vercel```. Kirjaudu sisään komennolla ```vercel login```
8. Mene projektin juurihakemistoon ja tee uusi vercel projekti komennolla ```vercel``` ja vastaa niihin sen kysymyksiin :D
9. Kirjaudu vercelin nettisivuille ja valitse äsken tekemäsi projekti. Vaihda asetuksista "Build and deployment" kohdasta framework presetiksi "Vite" mikäli Vercel ei tunnista sitä automaattisesti.
10. Etsi asetuksista "Build and deployment" kohdasta build command, ja paina "override" ja kirjoita komennoksi ```prisma generate && vite build``` (Muista tallentaa!!)
11. Lisää environment variablet backendiin vercelin nettisivuilla. Etsi "Environment variables" kohta projektisi alta ja lisää seuraavat variablet:
- "TURNSTILE_KEY": cloudflaren sivulta saamasi secret key
- "ADMIN_PASSWORD": salasana jota käytät kirjautumaan admin portaaliin (keksi itse joku)
- "ADMIN_USERNAME": käyttäjätunnus jota käytät kirjautumaan admin portaaliin (keksi itse joku)
- "DATABASE_URL": Neon consolesta saamasi connection string
12. Aja projektin juurihakemistossa komento ```vercel --prod``` jolloin vercel deployaa projektisi.
13. Lisää cloudflareen turnstile hostname(t), jos et vielä lisännyt niitä.

Projektin mukana tulee sekä frontend- että backend .env example tiedostot joista voi ottaa mallia. Huomattavaa että .env.example.backend tiedosto kuuluu lisätä VERCELIIN, eli ei itse projektiin. Puolestaan .env.example.frontend tulee vain nimetä .env tiedostoksi, sillä sen kuuluu jäädä frontendiin.