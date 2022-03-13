/**
 * Responsible for handling the actions happening on schedule view
 *
 * @author Jaden van Rijswijk
 */

import { Controller } from "./controller.js";
import { ScheduleRepository } from "../repositories/scheduleRepository.js";
import { App } from "../app.js";

export class ScheduleController extends Controller{
    #scheduleView
    #schedule

    constructor() {
        super();

        this.#schedule = new ScheduleRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#scheduleView = await super.loadHtmlIntoContent("html_views/schedule.html")

        // Redirect buttons
        this.#scheduleView.querySelector("#changeSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_CHANGE_SCHEDULE));
        this.#scheduleView.querySelector("#defaultSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_DEFAULT_SCHEDULE));

        this.#displaySchedule();
    }

    async #displaySchedule() {
        const schedules = await this.#schedule.defaultSchedule();

        console.log(schedules)
    }
}
