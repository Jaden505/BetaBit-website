/**
 * Responsible for changing an event of the current week
 *
 * @author Jaden van Rijswijk
 */

import {Controller} from "./controller.js";
import {ScheduleRepository} from "../repositories/scheduleRepository.js";
import {App} from "../app.js";

export class ChangeScheduleController extends Controller{
    #changeScheduleView
    #changeSchedule


    constructor() {
        super();

        this.#changeSchedule = new ScheduleRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#changeScheduleView = await super.loadHtmlIntoContent("html_views/changeSchedule.html")

        //Redirect buttons
        this.#changeScheduleView.querySelector("#changeScheduleConfirm").
        addEventListener("click", event => this.#setSchedule());
    }

    async #setSchedule() {
        const email = App.sessionManager.get("email");
        const date = this.#changeScheduleView.querySelector(".date").value;
        const day_start = this.#changeScheduleView.querySelector(".day-start").value;
        const day_end = this.#changeScheduleView.querySelector(".day-end").value;
        const distance = this.#changeScheduleView.querySelector(".distance-input").value;
        const vehicle = this.#changeScheduleView.querySelector(".transport").value;
        const type = this.#changeScheduleView.querySelector(".day-type").value;

        await this.#changeSchedule.updateSchedule(
            type, day_start, day_end, distance, vehicle, email, date
        );
    }
}
