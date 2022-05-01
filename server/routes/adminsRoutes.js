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
        const email = req.body.email;
        const name = req.body.name;
        const role = req.body.role;

        //TODO: You shouldn't save a password unencrypted!! Improve this by using this.#cryptoHelper functions :)
        const password = req.body.password;

            const data = await this.#databaseHelper.handleQuery({
                query: "INSERT INTO Users (email, username, role, password) VALUES (?, ?, ?, ?);",
                values: [email, name, role, password]
            });

            // If it is inserted
            if (data.affectedRows > 0) {
                res.status(this.#errorCodes.HTTP_OK_CODE)
            } else {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "Fields filled incorrectly"});
            }
        });
    }
}

module.exports = AdminsRoutes