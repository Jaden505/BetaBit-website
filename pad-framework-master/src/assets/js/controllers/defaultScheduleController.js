/**
 * Responsible for creating and editing the users personal default schedule.
 * The default schedule gets repeated every week and can be changed using changeDefaultScheduleController.
 *
 * @author Jaden van Rijswijk & Dia Fortmeier & Colin Laan
 */

import {Controller} from "./controller.js";
import {ScheduleRepository} from "../repositories/scheduleRepository.js";
import {App} from "../app.js";
import {ScheduleController} from "./scheduleController.js";

export class DefaultScheduleController extends Controller {
    #defaultScheduleView
    #defaultSchedule
    #date = new Date();
    static days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    constructor() {
        super();

        this.#defaultSchedule = new ScheduleRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#defaultScheduleView = await super.loadHtmlIntoContent("html_views/defaultSchedule.html")

        // Redirect buttons
        this.#defaultScheduleView.querySelector("#currentSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_SCHEDULE));
        this.#defaultScheduleView.querySelector("#editDefaultSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_CHANGE_DEFAULT_SCHEDULE));

        await this.#displaySchedule();
        this.#expandDayView();
        this.#openCurrentDay();
    }

    /**
     * Expands and retracts the detailed view of a day on the default schedule when the tab of it is clicked.
     */
    #expandDayView() {
        const expandTab = this.#defaultScheduleView.getElementsByClassName("default-schedule-item")
        const expandableContent = this.#defaultScheduleView.getElementsByClassName("default-schedule-container-content")
        const expandIcon = this.#defaultScheduleView.getElementsByClassName("expand-img")

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
                    panel.style.maxHeight = "fit-content";
                    panel.style.paddingTop = ".5rem";
                }
            })
        }
    }

    /**
     * Checks which day it is today, and opens that accordion
     */
    #openCurrentDay() {
        let defaultDayContainers = Array.from(document.getElementById("defaultScheduleList").children);
        let today = DefaultScheduleController.days[this.#date.getDay()];

        for (let defaultDay of defaultDayContainers) {
            // open accordion of current day
            if (defaultDay.id === today) {
                defaultDay.children[0].children[0].style = "transform: rotate(180deg);";

                defaultDay.children[1].classList.add("acc-active");
                defaultDay.children[1].style = "max-height: fit-content; padding-top: 0.5rem;";
            }
        }
    }

    /**
     * Gets the default schedule from the db,
     * and then displays the schedule in the corresponding html fields.
     *
     * @returns {Promise<void>}
     */
    async #displaySchedule() {
        try {
            const email = App.sessionManager.get("email");
            const default_schedules = await this.#defaultSchedule.defaultSchedule(email);

            default_schedules.forEach(function (schedule) {

                let schedule_day = document.querySelector("#" + schedule.day + " .default-schedule-container-content");
                let totalEmissions = schedule.transport_emissions * schedule.travel_distance;
                let punten = ScheduleController.pointCalculator(schedule.transport, schedule.travel_distance);

                schedule_day.innerHTML +=
                    "<div class=\"content-item\"><p class=\"item-label\">Dag type</p><p class=\"item-data\">" +
                    schedule.daytype + "</p></div>";
                schedule_day.innerHTML +=
                    "<div class=\"content-item\"><p class=\"item-label\">Start tijd</p><p class=\"item-data\">" +
                    schedule.start_time.slice(0, 5) + "</p></div>";
                schedule_day.innerHTML +=
                    "<div class=\"content-item\"><p class=\"item-label\">Eind tijd</p><p class=\"item-data\">" +
                    schedule.end_time.slice(0, 5) + "</p></div>";
                schedule_day.innerHTML +=
                    "<div class=\"content-item\"><p class=\"item-label\">Reisafstand</p><p class=\"item-data\">" +
                    schedule.travel_distance + " km</p></div>";
                schedule_day.innerHTML +=
                    "<div class=\"content-item\"><p class=\"item-label\">Vervoersmiddel</p><p class=\"item-data\">" +
                    schedule.transport + "</p></div>";
                schedule_day.innerHTML +=
                    "<div class=\"content-item\"><p class=\"item-label\">CO2 uitstoot</p><p class=\"item-data\">" +
                    totalEmissions + " g</p></div>";
                schedule_day.innerHTML +=
                    "<div class=\"content-item\"><p class=\"item-label\">punten</p><p class=\"item-data\">" +
                    punten + " punten</p></div>";
            });
        } catch (e) {
            console.log(e);
        }
    }
}
