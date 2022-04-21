/**
 * Server application - contains all server config and api endpoints
 * Only make changes in this file if you know what you are doing :)
 *
 * @author Pim Meijer
 */
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const fileUpload = require("express-fileupload");
const errorcodes = require("./framework/utils/httpErrorCodes")
const path = require("path");

//front-end as static directory
app.use(express.static(path.join(__dirname, '../src')));

//logger library  - 'short' is basic logging info
app.use(morgan("short"));

//helper libraries for parsing request bodies from json to javascript objects
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS config - Cross Origin Requests
const corsConfig = require("./framework/utils/corsConfigHelper");
app.use(corsConfig);

//File uploads
app.use(fileUpload());

// ------ ROUTES - all .js files in ./routes are read and loaded
const routesPath = __dirname + "/routes/";

require("fs").readdirSync(routesPath).forEach( (file) => {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        const name = file.replace(".js", "");

        //require the <..>routes.js file
        exports[name] = require(routesPath + file);

        //check if it is a class(function), if it is instantiate it
        if (typeof exports[name] === "function") {
            new exports[name](app);
            console.log(`Loaded and instantiated routes in ${name}.js`)
        } else {
            console.error(`Routes file ${name} found but not able to instantiate. Make sure it is a class, 
            has a constructor and is being exported by module.exports = ..`)
        }
    }
});

//always keep this route at the bottom! This is error handling for when a client calls a non existing route!
app.get("*", (req, res) => {
    res.status(errorcodes.ROUTE_NOT_FOUND_CODE).json({reason: "Not found, make sure the endpoint you are trying to call exists! :)"});
});

//------- END ROUTES -------

module.exports = app;