/**
 * This class contains ExpressJS routes specific for the Counter
 * this file is automatically loaded in app.js
 *
 */
class CounterDateRoutes {

constructor(app) {
    this.#app = app;

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    //call method per route for the users entity
    this.#getCounterDate();
}

/**
 * Searches for users based on searchbar input
 * @author Dennis Bleeker
 * @memberOf CounterRoutes
 * @name getCounterDate
 * @function
 * @private
 * @instance
 */

#getCounterDate() {
    this.#app.post("/schedule/transportation", async (req, res) => {

        try {
            const data = await this.#databaseHelper.handleQuery({
                query: `SELECT l.date        AS update_date
                            FROM leaderboardupdatedate l`
            });

            // returns counterdate
            res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
        } catch (e) {
            res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
        }
    });
}
}
module.exports = CounterRoutes;