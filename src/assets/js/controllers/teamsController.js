/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 */

import {Controller} from "./controller.js";
import {teamsRepository} from "../repositories/teamsRepository.js";
import {App} from "../app.js";
import {SessionManager} from "../framework/utils/sessionManager.js";

export class teamsController extends Controller {
    #teamsView
    #teams

    constructor() {
        super();

        this.#teams = new teamsRepository();


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

    }
}