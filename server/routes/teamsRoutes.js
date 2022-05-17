
class TeamsRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app= app;

        this.#createTeams()
        this.#addUserToTeam()
    }


    #createTeams() {
        this.#app.post("/admin/teams", async (req, res) => {

            const naamTeam = req.body.naam;
            console.log(naamTeam+" route")
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO teams (naam) VALUES (?)`,
                values:[naamTeam]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
    #addUserToTeam() {
        this.#app.post("/admin/teams/members", async (req, res) => {
            const email = req.body.user_email;
            const naamTeam = req.body.team_naam;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO user_teams (user_email, team_naam) VALUES(?,?)`,
                    values:[email,naamTeam]
                })

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}
module.exports = TeamsRoutes;