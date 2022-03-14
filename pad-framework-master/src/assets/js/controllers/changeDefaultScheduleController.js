/**
 * Responsible for altering events in the default schedule
 *
 * @author Colin Laan
 */

import {Controller} from "./controller.js";

export class ChangeDefaultScheduleController extends Controller {
    #changeDefaultScheduleView

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
        this.#changeDefaultScheduleView = await super.loadHtmlIntoContent("html_views/changeDefaultSchedule.html")
    }
}
