# Group Project: Programming Project

## Gebruikte Technologieën
- **Express**
- **Handlebars**
- **Lijst van packages**

**MySQL** in een Docker-container die op een linux server draait.
**PM2**: Draait als een daemon voor de app en draait deze op de achtergrond. Voert logging uit en herstart automatisch als de daemon vastloopt. Biedt ook mogelijkheden om de server op afstand te herstarten.

## Indeling
- **views**: Bevat de statische webpagina's en Handlebars (.hbs) bestanden voor de templating engine.
- **express_testbed**: Testomgeving voor nieuwe code snippets.
- **routes**: Definieert de routes.
- **server**: Algemene serverconfiguratie.

## Serverarchitectuur
De Node.js applicatie wordt beheerd door PM2 op een Windows server omgeving welke gevirtualiseerd is op een linux server. MySQL draait in een Docker-container op dezelfde linux server.

## Beveiliging
Momenteel wordt de verbinding via https geëncrypteerd. Paswoorden worden gehashed en gesalt alvorens ze in de database worden weggeschreven. Echter is het paswoord plain text wanneer het van front-end naar back-end gaat, alhoewel dit maar een medium security risk is, aangezien deze verbinding wel via https versleuteld is. Een implementatie van de hashing en salting in front-end staat op de nice to have lijst aangezien dan het paswoord volledig beveiligd is, zelfs met een .

## Hoe lokaal starten
Er zijn twee types servers gedefinieerd in `server.js`. Standaard staat de "development server" actief en draait op poort 3000 op localhost. Een OpenVPN-verbinding is vereist om met de database te communiceren. Databasegegevens staan in `.env` en maken gebruik van een gebruikersaccount met beperkte privileges. Voor meer informatie over accounts, VPN en database, zie de Teams-bestanden.

### Stappen om lokaal te starten
1. Maak verbinding met de VPN.
2. Navigeer naar de map waar `server.js` staat:
    ```bash
    cd /path/to/server.js
    ```
3. Start de server:
    ```bash
    node server.js
    ```

## Hoe de server in productie starten
Standaard draait de https server op poort 4000 en de http server op poort 3000. De http server redirect naar poort 4000.(forceert gebruik van https). Deze poorten worden nadien met NAT vertaald naar TCP 80 en TCP 443. Indien de server draait op een lokale machine is er een probleem met de URL en zal https een fout geven aangezien de request niet naar de juiste url gestuurd werd. Aldus zal de website een melding geven dat de verbinding niet beveiligd is. Enkel wanneer deze draait op de server gelinked aan https://ambart.synology.me zullen de certificaten geldig zijn.

1. Verwijder de development server code uit `server.js` en haal de production server code uit commentaar (verwijder `/*` en `*/`).
2. Navigeer naar de map waar `pm2Env.config.js` staat:
    ```bash
    cd /path/to/pm2Env.config.js
    ```
3. Start de server met PM2:
    ```bash
    pm2 start pm2Env.config.js
    ```
De `pm2Env.config.js` zorgt ervoor dat de daemon toegang heeft tot het .env-bestand.

