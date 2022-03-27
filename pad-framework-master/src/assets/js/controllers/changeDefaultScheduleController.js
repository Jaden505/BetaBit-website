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
        this.#changeDefaultScheduleView.querySelector("#saveDefaultSchedule").addEventListener("click", event => this.#updateDefaultScheduleData());
        this.#changeDefaultScheduleView.querySelector(".day-type").addEventListener("click", event => this.#dayTypeContentUpdate());

        this.#expandDayView();
        this.#fillChangeFields();
        this.#dayTypeContentUpdate();
    }

    /**
     * Expands and retracts the detailed view of a day on the default schedule when the tab of it is clicked.
     */
    async #expandDayView() {
        const expandTab = this.#changeDefaultScheduleView.getElementsByClassName("default-schedule-item")
        const expandableContent = this.#changeDefaultScheduleView.getElementsByClassName("default-schedule-container-content")
        const expandIcon = this.#changeDefaultScheduleView.getElementsByClassName("expand-img")

        for (let i = 0; i < expandTab.length; i++) {
            expandTab[i].addEventListener("click", async function () {
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
            });
        }
    }

    async #updateDefaultScheduleData() {
        const email = App.sessionManager.get("email");
        const containers = document.querySelectorAll(".default-schedule-container-content")
        let cds = this.#changeDefaultSchedule;

        containers.forEach(async function (container) {
            let day_start = container.querySelector(".day-start").value
            let day_end = container.querySelector(".day-end").value
            let distance = container.querySelector(".distance-input").value
            let vehicle = container.querySelector(".transport").value
            let type = container.querySelector(".day-type").value
            let day = (container.id).substring(0, container.id.length - 6);

            await cds.updateDefaultSchedule(type, day_start, day_end, distance, vehicle, email, day);
        });
    }

    async #fillChangeFields() {
        const email = App.sessionManager.get("email");
        const default_schedules = await this.#changeDefaultSchedule.defaultSchedule(email);

        default_schedules.forEach(function (schedule) {
            let schedule_day = document.getElementById(schedule.day + "_field");

            schedule_day.querySelector(".day-type").value = schedule.daytype;
            schedule_day.querySelector(".day-start").value = schedule.start_time.slice(0, 5);
            schedule_day.querySelector(".day-end").value = schedule.end_time.slice(0, 5);

            schedule_day.querySelector(".distance-input").value = schedule.travel_distance;
            schedule_day.querySelector(".transport").value = schedule.transport;
        });
    }

    async #dayTypeContentUpdate() {
        const email = App.sessionManager.get("email");
        const default_schedules = await this.#changeDefaultSchedule.defaultSchedule(email);

        default_schedules.forEach(function (schedule) {
            let schedule_day = document.getElementById(schedule.day + "_field");
            let day_type = schedule_day.querySelector(".day-type").value;

            if (day_type === "Empty" || day_type === "geen werk" || day_type === "ziek") {
                schedule_day.querySelector(".day-start").classList.add("hideOnAtHome");
                schedule_day.querySelector(".day-end").classList.add("hideOnAtHome");
                schedule_day.querySelector(".distance-input").classList.add("hideOnAtHome");
                schedule_day.querySelector(".transport").classList.add("hideOnAtHome");

            } else {
                schedule_day.querySelector(".day-start").classList.remove("hideOnAtHome");
                schedule_day.querySelector(".day-end").classList.remove("hideOnAtHome");
                schedule_day.querySelector(".distance-input").classList.remove("hideOnAtHome");
                schedule_day.querySelector(".transport").classList.remove("hideOnAtHome");
            }
        });
    }
}
