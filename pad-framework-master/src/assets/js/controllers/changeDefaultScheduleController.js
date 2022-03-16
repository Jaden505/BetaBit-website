/**
 * Responsible for altering events in the default schedule
 *
 * @author Colin Laan
 */

import {Controller} from "./controller.js";
import {ScheduleRepository} from "../repositories/scheduleRepository.js";
import {App} from "../app.js";

export class ChangeDefaultScheduleController extends Controller {
    #changeDefaultScheduleView
    #changeDefaultSchedule

    constructor() {
        super();

        this.#changeDefaultSchedule = new ScheduleRepository();

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

        //Redirect buttons
        this.#changeDefaultScheduleView.querySelector("#defaultSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_DEFAULT_SCHEDULE));

        this.#expandDayView()
        this.#updateDefaultScheduleData()
    }

    /**
     * Expands and retracts the detailed view of a day on the default schedule when the tab of it is clicked.
     */
    #expandDayView() {
        const expandTab = this.#changeDefaultScheduleView.getElementsByClassName("default-schedule-item")
        const expandableContent = this.#changeDefaultScheduleView.getElementsByClassName("default-schedule-container-content")
        const expandIcon = this.#changeDefaultScheduleView.getElementsByClassName("expand-img")

        for (let i = 0; i < expandTab.length; i++) {
            expandTab[i].addEventListener("click", function () {
                expandableContent[i].classList.toggle("acc-active")
                if (expandIcon[i].style.transform === "rotate(180deg)") {
                    expandIcon[i].style.transform = "rotate(0)"
                } else {
                    expandIcon[i].style.transform = "rotate(180deg)"
                }
                let panel = expandableContent[i];
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            })
        }
    }

    async #updateDefaultScheduleData() {
        const email = App.sessionManager.get("email");
        const here = this.#changeDefaultScheduleView;
        const saveBtn = here.querySelector("#saveDefaultSchedule");
        const day_start = here.querySelectorAll(".day-start")
        const day_end = here.querySelectorAll(".day-end")
        const distance = here.querySelectorAll(".distance-input")
        const vehicle = here.querySelectorAll(".transport")
        const type = here.querySelectorAll(".day-type")
        const day = here.querySelectorAll(".day")

        console.log(day)
        console.log(vehicle)
        console.log(day_end)

        saveBtn.addEventListener("click", async e => {
            for (let i = 0; i < 7; i++) {

                console.log(day[i]);
                console.log(vehicle[i]);
                console.log(day_end[i]);
                let dayValue = day[i];
                let dayEndValue = day_end[i];
                let dayStartValue = day_start[i];
                let distanceValue = distance[i];
                let vehicleValue = vehicle[i];
                let typeValue = type[i];

                await this.#changeDefaultSchedule
                    .updateDefaultSchedule(dayStartValue, dayEndValue, distanceValue, vehicleValue, typeValue, email, dayValue)

            }
        });
    }
}
