
class TeamsRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app=app
        this.#createTeams()
    }


    #createTeams() {
        this.#app.post("/admin/teams", async (req, res) => {
            const naam = req.body.teamNaam;
            // const emailUser1 = req.body.emailUser1;
            // const emailUser2 = req.body.emailUser2;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO teams (?)`,
                    values: [naam]
                });

                // returns schedules
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});

            }
        });
    }
    // #addUserToTeam() {
    //     this.#app.post("/admin/teams", async (req, res) => {
    //         const naam = req.body.teamNaam;
    //         const emailUser1 = req.body.emailUser1;
    //         const emailUser2 = req.body.emailUser2;
    //         new Array(emailUser1,emailUser2)=emailArray;
    //         try {
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: `INSERT INTO teams (naam)`,
    //                 values: [naam]
    //             });
    //
    //             // returns schedules
    //             res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
    //         } catch (e) {
    //             res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
    //
    //         }
    //     });
    // }
}
module.exports = TeamsRoutes;