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
    #date = new Date();
    #days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

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
        this.#highlightDay();
    }

    #highlightDay() {
        let day_containers = document.getElementById("days_holder").children
        let today = this.#days[this.#date.getDay()];

        for (let day in day_containers) {console.log(day.id, today)}
    }

    async #displaySchedule() {
        const schedules = await this.#schedule.defaultSchedule();
        let day_containers = document.getElementById("days_holder").children
    }
}
