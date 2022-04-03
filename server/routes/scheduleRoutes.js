/**
 * This class contains ExpressJS routes specific for the users schedule
 * this file is automatically loaded in app.js
 *
 * @author Jaden van Rijswijk & Dia Fortmeier
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
        this.#setDefaultSchedule()
        this.#setSchedule()
    }

    /**
     * Gets default schedule from database and returns to frontend in json
     * @private
     */
    #getDefaultSchedule() {
        this.#app.post("/schedule/default", async (req, res) => {
            const email = req.body.email;

            try {
                const data = await this.#databaseHelper.handleQuery({
                query: `SELECT
                            ds.day,
                            ds.type AS schedule_daytype_id,
                            ds.start_time,
                            ds.end_time,
                            ds.travel_distance,
                            ds.transport AS schedule_transport_id,
                            d.id AS daytype_id,
                            d.name AS daytype,
                            d.icon AS type_icon,
                            t.id AS transport_id,
                            t.name AS transport,
                            t.emissions AS transport_emissions,
                            t.icon AS transport_icon
                        FROM defaultschedules ds
                                 INNER JOIN daytypes d on ds.type = d.id
                                 INNER JOIN transport t on ds.transport = t.id
                        WHERE ds.user_email = ?;`,
                values: [email]
            });

            // returns default schedules
            res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
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
            const email = req.body.email;
            const begin_date = req.body.begin_date;
            const end_date = req.body.end_date;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT s.date,
                                   s.type      AS schedule_daytype_id,
                                   s.start_time,
                                   s.end_time,
                                   s.travel_distance,
                                   s.transport AS schedule_transport_id,
                                   d.id        AS daytype_id,
                                   d.name      AS daytype,
                                   t.id        AS transport_id,
                                   t.name      AS transport,
                                   t.emissions AS transport_emissions,
                                   d.icon AS type_icon,
                                   t.id        AS transport_id,
                                   t.name      AS transport,
                                   t.emissions AS transport_emissions,
                                   t.icon AS transport_icon
                            FROM schedules s
                                     INNER JOIN daytypes d on s.type = d.id
                                     INNER JOIN transport t on s.transport = t.id
                            WHERE s.date >= ?
                              AND s.date <= ?
                              AND s.user_email = ?;`,
                    values: [begin_date, end_date, email]
                });

                // returns schedules
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * sets a new default schedule in the database using json
     * @private
     */
    #setDefaultSchedule() {
        this.#app.put("/schedule/update/default", async (req, res) => {
            const email = req.body.email;
            const type = req.body.day_type;
            const begin_date = req.body.begin_date;
            const end_date = req.body.end_date;
            const distance = req.body.distance;
            const transport = req.body.vehicle;
            const day = req.body.target_day;

            try {
                await this.#databaseHelper.handleQuery({
                    query: `UPDATE defaultSchedules ds
                                INNER JOIN daytypes d on d.name = ?
                                INNER JOIN transport t on t.name = ?
                            SET type = d.id,
                                start_time = ?,
                                end_time = ?,
                                travel_distance = ?,
                                transport = t.id
                            WHERE user_email = ? 
                            AND day = ?;`,
                    values: [type, transport, begin_date, end_date, distance, email, day]
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * sets a new schedule in the database using json
     * @private
     */
    #setSchedule() {
        this.#app.post("/schedule/update", async (req, res) => {
            const email = req.body.email;
            const date = req.body.date;
            const type = req.body.day_type;
            const start_time = req.body.begin_date;
            const end_time = req.body.end_date;
            const distance = req.body.distance;
            const transport = req.body.vehicle;

            let data = await this.#databaseHelper.handleQuery({
                query: `INSERT INTO schedules (user_email, date, 
                                type, start_time, end_time, travel_distance, transport)
                        SELECT ?, ?, d.id, ?, ?, ?, t.id
                        FROM schedules
                                 INNER JOIN daytypes d on d.name = ?
                                 INNER JOIN transport t on t.name = ?

                        ON DUPLICATE KEY UPDATE
                                 user_email = ?,
                                 date = ?,
                                 type = d.id,
                                 start_time = ?,
                                 end_time = ?,
                                 travel_distance = ?,
                                 transport = t.id;
                `,
                values: [email, date, start_time, end_time, distance,
                    type, transport,
                    email, date, start_time, end_time, distance]
            });

            if (data.affectedRows > 0) {
                res.status(this.#errorCodes.HTTP_OK_CODE)
            } else {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "Fields filled incorrectly"});
            }

        });
    }
}

module.exports = ScheduleRoutes;