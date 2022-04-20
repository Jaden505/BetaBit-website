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
        let popup = document.getElementById("changeSchedulePopup");

        //await for when HTML is loaded
        this.#changeScheduleView = await super.loadHtmlIntoCustomElement("html_views/changeSchedule.html", popup)

        //Redirect buttons
        this.#changeScheduleView.querySelector("#changeScheduleConfirm").
        addEventListener("click", event => this.#setSchedule());
        this.#changeScheduleView.querySelector("#cancelChangeSchedule")
            .addEventListener("click", event => popup.style.display = 'none');

        this.#loadScheduleOptions();
    }

    async #loadScheduleOptions() {
        const daytype_holder = document.getElementById('dayType');
        const transport_holder = document.getElementById('wayOfTravelling');

        const daytypes = await this.#changeSchedule.getOptions('daytypes');
        const transport_types = await this.#changeSchedule.getOptions('transport');

        Object.values(daytypes).forEach(function (day) {
            let opt = document.createElement('option');
            opt.value = day['name'];
            opt.innerHTML = day['name'];
            daytype_holder.appendChild(opt);
        })

        Object.values(transport_types).forEach(function (transport) {
            let opt = document.createElement('option');
            opt.value = transport['name'];
            opt.innerHTML = transport['name'];
            transport_holder.appendChild(opt);
        })
    }

    async #setSchedule() {
        let error = document.getElementById('error');

        const email = App.sessionManager.get("email");
        const date = this.#changeScheduleView.querySelector(".date").value;
        let day_start = this.#changeScheduleView.querySelector(".day-start").value;
        let day_end = this.#changeScheduleView.querySelector(".day-end").value;
        let distance = this.#changeScheduleView.querySelector(".distance-input").value;
        const vehicle = this.#changeScheduleView.querySelector(".transport").value;
        const type = this.#changeScheduleView.querySelector(".day-type").value;

        function checkFields() {
            let fields = [date, day_start, day_end, distance, vehicle, type];

            // Moet altijd ingevuld worden
            if (type === "Empty" || date === "") {return false;}

            // Alles moet ingevuld zijn bij deze types
            if (type === "bij klant" || type === "op kantoor") {
                return fields.every(o => (o !== "" && o !== "Empty"));
            }

            // Alleen tijden moeten ook ingevuld worden
            if (type === "online") {
                return day_start !== "" && day_end !== "";
            }

            // Set to null if empty
            if (day_start === "") {day_start = null;}
            if (day_end === "") {day_end = null;}
            if (distance === "") {distance = null;}

            return true;
        }

        if (checkFields()) {
            try {
                error.style.color = "green"
                error.innerHTML = "Uw rooster is succesvol aangepast";

                await this.#changeSchedule.updateSchedule(
                    type, day_start, day_end, distance, vehicle, email, date
                );
            } catch (e) {
                if (e.code == 400) {
                    // Filled fields are incorrect
                    error.style.color = "red"
                    error.innerHTML = "Velden zijn incorrect ingevuld"
                }
            }
        } else {
            // Filled fields are incorrect
            error.style.color = "red"
            error.innerHTML = "Velden zijn incorrect ingevuld"
        }
    }
}
