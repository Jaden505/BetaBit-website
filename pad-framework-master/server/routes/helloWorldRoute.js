/**
 * This class is an example route that has been made in the workshop, to show you an example of how it's made
 *
 * @author Dia Fortmeier
 */


class helloWorldRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #app

    constructor(app) {
        this.#app = app;

        this.#getHelloWorld();
    }s

    #getHelloWorld() {
        this.#app.get("/hello_world/:helloWorldId", async (req, res) => {
            res.status(this.#errorCodes.HTTP_OK_CODE).json("Hello World " + req.params.helloWorldId);
        })
    }
}

module.exports = helloWorldRoute
