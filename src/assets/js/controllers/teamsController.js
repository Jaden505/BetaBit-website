/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 */

import {Controller} from "./controller.js";
import {TeamsRepository} from "../repositories/teamsRepository.js";
import {App} from "../app.js";
import {SessionManager} from "../framework/utils/sessionManager.js";

export class TeamsController extends Controller {
    #teamsView
    #teamsRepository
    constructor() {
        super();

        this.#teamsRepository = new TeamsRepository();


        this.#setupView();

    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @memberOf IndividualMonthLeaderboardController
     * @name setupView
     * @function
     * @private
     * @instance
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#teamsView = await super.loadHtmlIntoContent("html_views/teamsAdmin.html");

        this.#teamsView.querySelector("#teamMakeButton").addEventListener("click", event => this.#teamMaker());
    }
    async #teamMaker(){
        const naam= this.#teamsView.querySelector("#teamNaam").value;
        await this.#teamsRepository.postTeam(naam);
        console.log(naam);
    }
}