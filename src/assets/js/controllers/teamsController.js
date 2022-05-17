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
        this.#teamsView.querySelector("#teamMakeButton").addEventListener("click", event => this.#memberAdder());
    }
    async #teamMaker(){
        const naam= this.#teamsView.querySelector("#teamNaam").value;
        if(naam !== null||naam!==""){
        await this.#teamsRepository.postTeam(naam);}
    }
    async #memberAdder(){
        const emailMember1=this.#teamsView.querySelector("#emailUser1").value;
        const emailMember2=this.#teamsView.querySelector("#emailUser2").value;
        const emailMember3=this.#teamsView.querySelector("#emailUser3").value;
        const emailMember4=this.#teamsView.querySelector("#emailUser4").value;
        const emailMember5=this.#teamsView.querySelector("#emailUser5").value;
        const emailMember6=this.#teamsView.querySelector("#emailUser6").value;
        const naam= this.#teamsView.querySelector("#teamNaam").value;
       if(naam !== null||naam!==""){
           if(emailMember1 !== null||emailMember1 !==""){await this.#teamsRepository.addMember(emailMember1,naam)}
           if(emailMember2 !== null||emailMember2 !==""){await this.#teamsRepository.addMember(emailMember2,naam)}
           if(emailMember3 !== null||emailMember3 !==""){await this.#teamsRepository.addMember(emailMember3,naam)}
           if(emailMember4 !== null||emailMember4 !==""){await this.#teamsRepository.addMember(emailMember4,naam)}
           if(emailMember5 !== null||emailMember5 !==""){await this.#teamsRepository.addMember(emailMember5,naam)}
           if(emailMember6 !== null||emailMember6 !==""){await this.#teamsRepository.addMember(emailMember6,naam)}
       }

        // await this.#teamsRepository.addMember(emailMember2,naam)
    }
}