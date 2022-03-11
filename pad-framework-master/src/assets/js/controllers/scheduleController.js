/**
 * Responsible for handling the actions happening on schedule view
 *
 * @author Jaden van Rijswijk
 */

import {Controller} from "./controller.js";
import { App } from "../app.js";

export class ScheduleController extends Controller{
    #scheduleView
    #date = new Date();
    #months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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
        this.#scheduleView = await super.loadHtmlIntoContent("html_views/schedule.html")

        this.#scheduleView.querySelector("#changeSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_CHANGE_SCHEDULE));
        this.#scheduleView.querySelector("#defaultSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_DEFAULT_SCHEDULE));

        this.#loadCalendar();
    }

    #getMonthString() {
        return this.#months[this.#date.getMonth()]
    }

    #loadCalendar() {
        // Loads year and month
        document.getElementById("month").innerHTML = this.#getMonthString();
        document.getElementById("year").innerHTML = this.#date.getFullYear();
    }
}
