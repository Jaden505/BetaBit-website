/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {RoomsExampleRepository} from "../repositories/roomsExampleRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class WelcomeController extends Controller{
    #roomExampleRepository
    #welcomeView

    constructor() {
        super();
        this.#roomExampleRepository = new RoomsExampleRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/welcome.html")

        //from here we can safely get elements from the view via the right getter
        this.#welcomeView.querySelector("span.name").innerHTML = App.sessionManager.get("username");

        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchRooms(1256);
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param roomId the room id to retrieve
     * @private
     */
    async #fetchRooms(roomId) {
        const exampleResponse = this.#welcomeView.querySelector(".example-response")

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const roomData = await this.#roomExampleRepository.get(roomId);

            exampleResponse.innerHTML = JSON.stringify(roomData, null, 4);
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            exampleResponse.innerHTML = e;
        }
    }
}