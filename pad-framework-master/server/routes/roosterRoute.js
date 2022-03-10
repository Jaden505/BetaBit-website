/**
 * This is an example class to the route of a schedule.
 *
 * @author Colin Laan
 */

class RoosterRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #app;

    constructor(app) {
        this.#app = app;

        this.#getRoosterById();
    }

    #getRoosterById() {
        this.#app.get("/rooster/:userId", async (req, res) => {
            try {
                res.status(this.#errorCodes.HTTP_OK_CODE).json("Dit is het rooster van " + req.params.userId);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = RoosterRoute;