/**
 * Responsible for creating and editing the users personal default schedule.
 * The default schedule gets repeated every week and can be changed using changeDefaultScheduleController.
 *
 * @author Jaden van Rijswijk
 */

import { Controller } from "./controller.js";
import { ScheduleRepository } from "../repositories/scheduleRepository.js";
import { App } from "../app.js";

export class DefaultScheduleController extends Controller {
    #defaultScheduleView
    #defaultSchedule

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
    }

    #expandDayView() {
        const expandTab = this.#defaultScheduleView.getElementsByClassName("default-schedule-item")
        const expandableContent = this.#defaultScheduleView.getElementsByClassName("default-schedule-container-content")
        const expandIcon = this.#defaultScheduleView.getElementsByClassName("expand-img")

        for (let i = 0; i < expandTab.length; i++) {
            expandTab[i].addEventListener("click", function (){
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
                    pannel.style.paddingTop = ".5rem";
                }
            })
        }
    }

    async #displaySchedule() {
        try {
            const username = App.sessionManager.get("username");
            const default_schedules = await this.#defaultSchedule.defaultSchedule(username);

            default_schedules.forEach(function (schedule) {

                let schedule_day = document.querySelector("#" + schedule.day + " .default-schedule-container-content");
                let totalEmissions = schedule.transport_emissions * schedule.travel_distance;

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
            });
        } catch (e) {
            console.log(e);
        }
    }
}
