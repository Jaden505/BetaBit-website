/**
 * Responsible for changing an event of the current week
 *
 * @author Jaden van Rijswijk
 */

import {Controller} from "./controller.js";
<<<<<<< HEAD
import {ScheduleRepository} from "../repositories/scheduleRepository.js";
import {App} from "../app.js";

export class ChangeScheduleController extends Controller{
    #changeScheduleView
    #changeSchedule


    constructor() {
        super();

        this.#changeSchedule = new ScheduleRepository();

=======

export class ChangeScheduleController extends Controller{
    #scheduleView

    constructor() {
        super();
>>>>>>> ddd02b4687867f51b9338fd2e4fc5e36ff04bd2d
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
<<<<<<< HEAD
        let popup = document.getElementById("changeSchedulePopup");

        //await for when HTML is loaded
        this.#changeScheduleView = await super.loadHtmlIntoCustomElement("html_views/changeSchedule.html", popup)

        //Redirect buttons
        this.#changeScheduleView.querySelector("#changeScheduleConfirm").
        addEventListener("click", event => this.#setSchedule());
        this.#changeScheduleView.querySelector("#cancelChangeSchedule")
            .addEventListener("click", event => popup.innerHTML = "");

    }

    async #setSchedule() {
        let error = document.getElementById('error');

        const email = App.sessionManager.get("email");
        const date = this.#changeScheduleView.querySelector(".date").value;
        const day_start = this.#changeScheduleView.querySelector(".day-start").value;
        const day_end = this.#changeScheduleView.querySelector(".day-end").value;
        const distance = this.#changeScheduleView.querySelector(".distance-input").value;
        const vehicle = this.#changeScheduleView.querySelector(".transport").value;
        const type = this.#changeScheduleView.querySelector(".day-type").value;

        try {
            error.style.color = "green"
            error.innerHTML = "Uw rooster is succevol aangepast";

            await this.#changeSchedule.updateSchedule(
                type, day_start, day_end, distance, vehicle, email, date
            );
        }
        catch(e) {
            if (e.code == 400) {
                // Filled fields are incorrect
                error.style.color = "red"
                error.innerHTML = "Velden zijn incorrect ingevuld"
            }
        }
=======
        //await for when HTML is loaded
        this.#scheduleView = await super.loadHtmlIntoContent("html_views/changeSchedule.html")
>>>>>>> ddd02b4687867f51b9338fd2e4fc5e36ff04bd2d
    }
}
