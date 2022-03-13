/**
 * Responsible for creating and editing the users personal default schedule.
 * The default schedule gets repeated every week and can be changed using changeScheduleController.
 *
 * @author Jaden van Rijswijk
 */

import {Controller} from "./controller.js";

export class DefaultScheduleController extends Controller{
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
        this.#scheduleView = await super.loadHtmlIntoContent("html_views/defaultSchedule.html")
    }
}
