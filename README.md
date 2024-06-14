# Group Project: Programming Project

## Programming language
- **Node .js**

## Frameworks
- **Express**: Een minimalistisch en flexibel Node.js webapplicatie-framework dat robuuste API's biedt voor het bouwen van web- en mobiele applicaties.
- **Handlebars**: Een sjabloontaal die wordt gebruikt voor het genereren van dynamische HTML vanuit server-side JavaScript-objecten.

### Libraries :  Gebruikte NPM Packages
```bash
├── bcrypt@5.1.1: Een bibliotheek voor het hashen van wachtwoorden.
├── body-parser@1.20.2: Middleware voor het ontleden van inkomende verzoeken met JSON payloads.
├── bootstrap@5.3.3: Een populaire CSS-framework voor het bouwen van responsieve, mobiele-eerst websites.
├── chart.js@4.4.3: Een eenvoudige maar flexibele JavaScript-bibliotheek voor het maken van grafieken en diagrammen.
├── cookie-parser@1.4.6: Middleware voor het ontleden van cookie headers en het maken van req.cookies object.
├── dotenv@16.4.5: Een module voor het laden van omgevingsvariabelen uit een .env-bestand.
├── express-handlebars@7.1.2: Een Express.js template engine gebaseerd op Handlebars.
├── express-session@1.18.0: Middleware voor het beheren van sessies in Express-applicaties.
├── express-validator@7.1.0: Een set van Express middleware voor het valideren en saneren van gebruikersinvoer.
├── express@4.19.2: Het webapplicatie-framework dat de kern vormt van de gebruikte technologie.
├── handlebars@4.7.8: De sjabloontaal op zichzelf, gebruikt voor het creëren van dynamische HTML.
├── hbs@4.2.0: Express.js integratie voor Handlebars.
├── jsonwebtoken@9.0.2: Een implementatie van JSON Web Tokens (JWT) voor het creëren en verifiëren van tokens.
├── multer@1.4.5-lts.1: Middleware voor het verwerken van multipart/form-data, voornamelijk gebruikt voor het uploaden van bestanden.
├── mysql2@3.9.7: Een MySQL client voor Node.js, ondersteunt Promises en async/await.
└── nodemon@3.1.0: Een hulpmiddel dat automatisch de server opnieuw opstart wanneer er veranderingen in de bronbestanden worden gedetecteerd.


**MySQL** in een Docker-container die op een linux server draait.
**PM2**: Draait als een daemon voor de app en draait deze op de achtergrond. Voert logging uit en herstart automatisch als de daemon vastloopt. Biedt ook mogelijkheden om de server op afstand te herstarten.

## Indeling
- **views**: Bevat de statische webpagina's en Handlebars (.hbs) bestanden voor de templating engine.
- **express_testbed**: Testomgeving voor nieuwe code snippets.
- **routes**: Definieert de routes.
- **server**: Algemene serverconfiguratie.

## Serverarchitectuur
De Node.js applicatie wordt beheerd door PM2 op een Windows server omgeving welke gevirtualiseerd is op een linux server. MySQL draait in een Docker-container op dezelfde linux server.

## Github beveiliging
Deze repository mag niet openbaar worden gemaakt. Hoewel gitignore is gebruikt, zijn er onveilige commits gemaakt in het verleden. Bovendien zijn de HTTPS/TLS-beveiligingscertificaten ook opgenomen in de repository. Als de code openbaar moet worden gemaakt, verwijder dan de map certificates en het bestand .env. Maak vervolgens een kopie en een nieuwe repository om de inhoud openbaar te maken zonder beveiligingsproblemen.

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

