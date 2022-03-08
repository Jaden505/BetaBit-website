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
    }

    #getHelloWorld() {
        this.#app.get("/hello_world/:helloWorldId", async (req, res) => {
            try {
                res.status(this.#errorCodes.HTTP_OK_CODE).json("Hello World " + req.params.helloWorldId);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        })
    }
}

module.exports = helloWorldRoute
