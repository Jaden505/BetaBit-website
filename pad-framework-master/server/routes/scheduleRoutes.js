/**
 * This class contains ExpressJS routes specific for the users schedule
 * this file is automatically loaded in app.js
 *
 * @author Jaden van Rijswijk
 */
class ScheduleRoutes {
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
        this.#getDefaultSchedule()
        this.#getSchedule()
    }

    /**
     * Gets default schedule from database and returns to frontend in json
     * @private
     */
    #getDefaultSchedule() {
        this.#app.post("/schedule/default", async (req, res) => {
            const username = req.body.username;

            try {
                const data = await this.#databaseHelper.handleQuery({
                query: `SELECT * FROM defaultSchedules d INNER JOIN users u on u.username = ?;`,
                values: [username]
            });

            // If records found
            if (data.length >= 1) {
                // returns default schedules
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } else {
                // No default schedules found
                res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "No schedules filled"});
            }
        } catch (e) {
            res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
        }
        });
    }

    /**
     * Gets schedule from database and returns to frontend in json
     * @private
     */
    #getSchedule() {
        this.#app.post("/schedule", async (req, res) => {
            const username = req.body.username;
            const begin_date = req.body.begin_date;
            const end_date = req.body.end_date;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `select * from schedules s
                            inner join users u on u.username = ?
                            where s.date >= ?
                            and s.date <= ?;`,
                    values: [username, begin_date, end_date]
                });

            // If records found
            if (data.length >= 1) {
                // returns default schedules
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } else {
                // No default schedules found
                res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "No schedules filled"});
            }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = ScheduleRoutes;