/**
 * This class contains ExpressJS routes specific for the users entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */
class AdminsRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the users entity
        this.#createUser()
        this.#getUsers()
    }

    /**
     * Adds user to database
     * @memberOf AdminsRoutes
     * @name createUser
     * @function
     * @private
     * @instance
     */
    #createUser() {
        this.#app.post("/admin/create/user", async (req, res) => {
            try {
                const email = req.body.email;
                const name = req.body.name;
                const role = req.body.role;

                //TODO: You shouldn't save a password unencrypted!! Improve this by using this.#cryptoHelper functions :)
                const password = req.body.password;

                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO Users (email, username, role, password) VALUES (?, ?, ?, ?);",
                    values: [email, name, role, password]
                });

                if (data.affectedRows > 0) {res.status(this.#errorCodes.HTTP_OK_CODE).json("Sent ok ")}
                else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "Fields filled incorrectly"});
                }
            }
            catch (e) {
                // If duplicate entry
                if (e.code === 'ER_DUP_ENTRY') {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "A user with this email-address already exists"});
                }
                else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "Er is iets fout gegaan"});
                }
            }
        });
    }

    /**
     * Gets users from database
     * @memberOf AdminsRoutes
     * @name getUsers
     * @function
     * @private
     * @instance
     */
    #getUsers() {
        this.#app.get("/admin/get/users", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM Users;"});

                if (data.length >= 1) {res.status(this.#errorCodes.HTTP_OK_CODE).json(data)}
                else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "There are no users yet"});
                }
            }
            catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "Er is iets fout gegaan"});
            }
        });
    }
}

module.exports = AdminsRoutes