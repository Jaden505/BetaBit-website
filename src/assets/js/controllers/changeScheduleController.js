/**
 * Responsible for changing an event of the current week
 *
 * @author Jaden van Rijswijk
 */

import {Controller} from "./controller.js";

export class ChangeScheduleController extends Controller{
    #scheduleView

    constructor() {
        super();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#scheduleView = await super.loadHtmlIntoContent("html_views/changeSchedule.html")
    }
}
