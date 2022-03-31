# PAD framework


## Wat zit er in het framework?

**Back-end(server)**
- Opzet standaard webserver met Express.JS en NodeJS. 
    - API: Hierbij zit een  `users/login`  en `/rooms_example/:id` route. Deze worden al aangesproken in de front-end
    - Connectie met een MySQL database. Deze database staat net als bij FYS ergens op een server binnen de HvA.
- Enkele crypto helper functions voor bijv. het hashen van een wachtwoord
- Standaard logging met foutmeldingen en andere informatie.

**Front-end(HTML, CSS, JS(ES6+))**
- Met Bootstrap 5 gestylde voorbeeldpagina's
- "MVC" setup met twee voorbeeldflows: De login en het welkom scherm met een stukje data uit de database
    - `html_views` bevat de HTML pagina's
    - `assets/js/controllers` bevat controllers - de schakeling tussen de views en de data
    - `assets/js/repositories` omdat we in Javascript(ES6) geen expliciete types hebben is er geen model. Een repository bevat/haalt data op en geeft het terug aan een controller.
- `sessionManager.js` voor het beheren van sessies in de local storage browser
- `networkManager.js` voor het uitvoeren van netwerk request(AJAX) naar de API(NodeJS/ExpressJS)

### Changelog v2.0 - Februari 2021

**Back-end(server)**
- Omgezet naar het gebruik van ES6 classes en `async/await`. Alle routes per entiteit(bijv. users) staan in een aparte class i.p.v. in `app.js`. Er is nieuwe logica in `app.js` toegevoegd die ervoor zorgt
dat alle files in de folder `server/routes` automatisch worden ingeladen en geïnstantieerd.
- Voorbeeld endpoint voor het uploaden van files is uitgebreid.
- Verbeterde logging
- Verbeterde JSDoc
- Dependencies geüpdatet
    - Cypress(voor tests) gemigreerd naar de nieuwste versie
    
**Front-end(HTML, CSS, JS(ES6+))**

- Alle jQuery logica is omgezet naar vanilla JS - jQuery verwijderd als dependency
- Alle .js files worden niet meer los ingeladen maar als modules
- Voorkant is "meer OOP" d.m.v. het gebruik van ES6+ features. Private fields en functions bijv. Ook is er een parent class voor `Controller` beschikbaar
die helpt met het inladen van HTML-files.
- `networkManager.js` 
    - Nu support voor `GET` én `POST` requests. Ook is er een methode toegevoegd voor het versturen van `FormData`.
    - Uitgebreidere logging
- File uploads voorbeeld uitgebreid
- Verbeterde JSDoc
- Bootstrap 4 naar Boostrap 5 gemigreerd


## Setup

### Dependencies - vooraf installeren!

- MySQL (Workbench)
- NodeJS - https://nodejs.org/en/download/ - Neem de LTS(Long Term Support) versie - `16.13.0`
- Git
- IntelliJ Ultimate Edition

### Stappen om het framework voor het eerst te draaien

1. Clone of download het project naar je computer. **Al download je het project als .zip zorg dan dat je de uitgepakte folder
hernoemt naar `pad-framework`**, anders krijg je later problemen bij het open van html in de browser
2. File -> Open de geclonede  folder in IntelliJ.
3. Met het project geopend, open nu linksonderin het tabje >_Terminal. Voor je cursor moet het pad staan van het framework. Bijv. `C:\Users\pmeijer\projects\pad-framework`
4. Typ `cd server` en druk op enter. Dit verandert het pad naar de `..pad-framework/server` folder.
5. Typ nu het commando `npm install`. Dit installeert de packages uit `package.json` zoals bijv. de `mySQL` package voor NodeJS. Al krijg je de melding dat npm niet gevonden kan worden
zorg dan dat je nogmaals controleert of NodeJS geïnstalleerd is en dat je deze via Start(Windows) een keer hebt uitgevoerd. Start vervolgens IntellIJ
nog een keer op en probeer het opnieuw. 
   - Dit kan eventueel ook vanuit IntelliJ door rechts te klikken op de `package.json` en te kiezen voor `Run 'npm install'`.
6. Als laatste zou het fijn zijn als onze server automatisch herstart bij een code wijziging. Typ hiervoor het command `npm install nodemon -g` en druk op enter. Dit
commando installeert nodemon globaal(-g) zodat je het bij elk project zou kunnen gebruiken.
7. Typ nu  `npm start` - enter. Dit start de server, nodemon zorgt ervoor dat de server automatisch opnieuw opstart bij wijzigingen 
   Je kunt ook in IntelliJ rechts klikken op `package.json` en kiezen voor `Show npm Scripts`. Dubbelklik vervolgens op `start`.
8. Nu zul je een melding krijgen over dat ``server/config/config.local.json`` niet is geconfigureerd. Open dit bestand en vul hier de gegevens in
van de database van jullie team. Deze kunnen jullie vinden op: https://hbo-ict.cloud/. In de folder waar dit bestand inzit vind je meerdere config bestanden, de `local` variant bevat configuratie voor
de verbinding naar een database als het PAD-framework draait op jouw computer, de andere twee zijn voor als het framework draait op HBO ICT Cloud. Deze hoef je voor nu niet in te vullen!

**Voorbeeld** van ingevulde `config.local.json`:
    
```
 {
     "database": {
         "host": "db.hbo-ict.cloud", //Geen port
         "timeout": 30000,
         "username": "pad_oba_10",
         "password": "<wachtwoord>",
         "database": "pad_oba_10_dev" //Dev of Live
     }
 }
 ```

_Al krijg je de connectie om wat voor reden dan ook niet werkend, gebruik dan even een lokale database. Je maakt een 
nieuw schema aan in MySQL Workbench, deze vul je in bij `"database"`. Als `"host"` vul je in localhost. Gebruikersnaam en 
wachtwoord heb je zelf ingesteld bij MySQL Workbench. Het kan zijn dat inloggen met `root` niet werkt, en dat je error code 1251 krijgt in de terminal.
Maak dan even een nieuwe user aan specifiek voor dit "scheme" in MySQL Workbench._

   
10. In de root van het project(`/pad-framework`) vind je een bestandje `testdata.sql`. Vul eerst het goede schema in bovenaan: bijv. `pad_oba_10_dev`. Zorg dan dat 
één van de teamleden deze SQL een keer heeft uitgevoerd in jullie database. Dit script maakt een `users` en een `rooms_example` tabel aan.
11. Draai nu nogmaals `npm start`. Nu zou de foutmelding moeten zijn verdwenen.
12. Test of de front-end een connectie kan maken met de server die we nu hebben draaien.
Open `src/index.html` in IntelliJ. Lanceer 🚀 deze in de browser, je kunt hiervoor op het Chrome(of andere browser) icoontje rechtsbovenin de file klikken. Als je het goed
hebt gedaan krijg je nu een inlog scherm te zien! Zorg dat je het altijd op deze manier doet om CORS errors te voorkomen.
13. Log in met `test` en `test`. Als je op de welkompagina komt betekent dit dat de database goed is opgezet en dat je ready-to-code bent!

## Front en back-end in één project

In de `server` folder vind je alles wat met de back-end/server te maken heeft, voor nu houden we het op de naamgeving server.
Door middel van het draaien van `npm start` komt de server te draaien op een poort(bijv. `localhost:3000`)

In de folder `src` vind je alle HTML/CSS en JS, ook wel de front-end. Vanuit deze front-end kun je dus een request doen naar hierboven genoemde server. 
Bij FYS hoefde je niet zelf de server te beheren en kon je een request doen naar de FYSCloud API. Bij PAD ga je dit dus ook zelf doen, je gaat dus je eigen
server beheren die je eigen API bevat voor je eigen front-end

Weet je niet helemaal meer hoe het zat met Server, Client, GET, POST, query parameters en URL's? Doe les 1 van de course Client-Server Communication:

https://classroom.udacity.com/courses/ud897/ 

## Voorbeeld van een flow(Welcome scherm)

<img src="readme_assets_gitlab/architecture_pad.png" width="700" height="450" alt="architecture overview">

**Front-end**

`pad-framework/src`

1. `src/assets/js/app.js` is het startpunt van de front-end applicatie. Deze laadt altijd de `navBarController.js` welke verantwoordelijk is
voor de navigatie binnen de website. Deze controller vangt een klik af op een link en vraagt via `app.js` een andere controller op voor de betreffende pagina.
In dit voorbeeld is dit de `welcomeController.js`.
2. De `welcomeController.js` laadt de pagina `html_views/welcome.html` 
3. Deze controller maakt ook een instantie van `roomsExampleRepostitory.js`. 
4. Via deze repository(komt nog aan bod bij OOP2) wordt er data(rooms) opgevraagd: `const roomData = await this.roomsExampleRepository.get(roomId);`. 
   Door middel van het gebruik van `async/await` hoeven we geen callbacks te gebruiken. De repository spreekt de `networkManager.js` aan welke uitendelijk
   een `fetch`(AJAX) request doet naar de server.
5. De `networkManager` gaat dus een request doen naar jullie API op jullie server. Hier wordt via de url meegegeven welke roomId moet worden opgevraagd. 
   Je ziet dit in de console:
`Doing GET request to http://localhost:3000/rooms_example/1256
   Sent JSON: <none>`
   
We sturen geen JSON mee omdat bij een GET request de data in de url wordt meegestuurd. Zie voor een voorbeeld van een `POST` request
de login functionaliteit.

**Server**

`pad-framework/server`

6. De server draait bijv. op port 3000. Op deze poort luistert de API of er requests binnen komen. Per entitieit(denk aan databases) maak je een aparte file/class aan
   in `server/routes` waarin staat naar welke endpoints requests kunnen worden gemaakt. Specifiek kijken we hier naar `roomsExampleRoutes.js`.
7. In dit geval zal de volgende route getriggered worden: `this.#app.get("/rooms_example/:roomId", async (req, res) => { .. }`. Dit is een stukje code dat gebruik
   maakt van `Express.JS`. De `app` variabele wordt automatisch meegegeven aan deze class, hier registreer je de endpoint op. 
   In de course over NodeJS(zie studiehandleiding en onderop deze pagina) vind je meer over Express.JS.
8. Zoals je ziet verwachten we hier een `GET` request. In de URL wordt de id meegegeven vanuit de front-end(:roomId).  
   Via `req.params.id` kunnen we dit id opvragen.
9. Binnen deze route kunnen we gebruik maken van `databaseHelper.js`. Dit script beheert de connectie naar de MySQL database. De functie `handleQuery(..)` 
   kan een stukje data ophalen uit de database.
10. De laatste stap is om binnen deze route in `roomsExampleRoutes.js` de data in JSON formaat terug te geven aan 
    de front-end: `res.status(this.#errorCodes.HTTP_OK_CODE).json(data);`
Let ook op dat je ook altijd wat terug moet geven als het fout gaat: `(err) => res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: err})`

Zie verder in de `welcomeController.js` hoe deze data dan weer op het sc~~~~herm getoond wordt. Let wel op dat dit asynchroon(`async`) gebeurt. 


## Links/E-learning

### NodeJS/Express/NPM

- Learning Node.js https://www.linkedin.com/learning/learning-node-js-2
    - Chapter 1, 2 en 4 → Dit zijn de essentials binnen het NodeJS ecosysteem die je nodig hebt tijdens het project. Hier leer je
    meer over de basis van NodeJS, NPM(packages.json) en Express.JS.
    - Chapter 7,8 en 9 → Deze hoofdstukken gaan in op de wat moeilijkere concepten zoals asynchrone code, software testen en error handling.
    
### Client-Server Communication
    
https://classroom.udacity.com/courses/ud897/ 

In ieder geval les 1 is belangrijk. Les 5 over security is ook interessant, hier kom je ook meer te weten over wat CORS(`server/utils/corsConfigHelper.js`) is. 

### ES6

- ES6 – Een nieuwe versie van Javascript die in de front-end gebruiken https://classroom.udacity.com/courses/ud356
    - Lesson 1: 1tm5 + 10tm13 → Dit is het minimum van les 1, de rest is zeker ook interessant!
    - Lesson 2: 1tm9 + 12tm21 → Classes en Inheritance, nieuwe manier van functies schrijven t.o.v. FYS en het gebruik van het “this” keyword

### Bootstrap 5 - layout toolkit voor HTML/CSS en JS

Hoe richt ik mijn layout in?

https://getbootstrap.com/docs/5.0/layout/grid/

Hoe verander ik padding/marging?

https://getbootstrap.com/docs/5.0/utilities/spacing/

Hoe verander ik kleuren?

https://getbootstrap.com/docs/5.0/utilities/colors/

Teksten

https://getbootstrap.com/docs/5.0/utilities/text

Er kan nog veel meer met Bootstrap. De bovenstaande links zijn een aantal voorbeelden van de documentatie. 


## Troubleshooting

_Bij het runnen van de server krijg ik de melding port already in use:_

Eindig het proces node in taakbeheer en draai de server nog een keer.

_Ik krijg errors in de console:_

![Client error](readme_assets_gitlab/error_example_client.png)

Het is hierbij van belang dat je goed kijkt wat er misgaat. Het kan namelijk zoals in dit geval zo zijn dat er 
ook iets in het servergedeelte niet goed staat:


![Server error](readme_assets_gitlab/error_example_server.png)

_Connection limit error:_

https://www.youtube.com/watch?v=e8psB6jmDYs&list=PLvltGXy557e6KYqvUltMopI5udp8i6GaK&index=7&ab_channel=HBO-ICT

## Deployen naar PAD Cloud
- https://www.youtube.com/watch?v=g38Nh6JWrGc&list=PLvltGXy557e6KYqvUltMopI5udp8i6GaK&index=6&ab_channel=HBO-ICT
- Nooit `node_modules` uploaden!
