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
                query: `SELECT
                            ds.user_email,
                            ds.day,
                            ds.type AS schedule_daytype_id,
                            ds.start_time,
                            ds.end_time,
                            ds.travel_distance,
                            ds.transport AS schedule_transport_id,
                            d.id AS daytype_id,
                            d.name AS daytype,
                            t.id AS transport_id,
                            t.name AS transport,
                            t.emissions AS transport_emissions,
                            t.icon,
                            u.email,
                            u.username
                        FROM defaultschedules ds
                                 INNER JOIN daytypes d on ds.type = d.id
                                 INNER JOIN transport t on ds.transport = t.id
                                 INNER JOIN users u on ds.user_email = u.email
                        WHERE u.username = ?;`,
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