/**
 * This class contains ExpressJS routes specific for the leaderboards
 * this file is automatically loaded in app.js
 *
 * @author Dia Fortmeier
 */
class LeaderboardRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the users entity
        this.#getIndividualMonthLeaderboard();
    }

    /**
     * Gets individual monthly leaderboard from database and returns to frontend in json
     * @private
     */
    #getIndividualMonthLeaderboard() {
        this.#app.get("/monthLeaderboard/individual", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT u.username, dp.user, SUM(dp.points) as points
                    FROM dailypoints dp
                    INNER JOIN users u on dp.user = u.email
                    GROUP BY dp.user
                    ORDER BY points DESC;`
                });

                // returns individual monthly leaderboard
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = LeaderboardRoutes;