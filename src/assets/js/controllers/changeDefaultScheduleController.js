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

        this.#expandDayView();
        this.#fillChangeFields();
        this.#addSelectionFields();
        this.#dayTypeContentUpdate();
    }

    /**
     * Expands and retracts the detailed view of a day on the default schedule when the tab of it is clicked.
     * @author Colin Laan
     * @private
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

    /**
     * Updates the default schedule data in the database with the values of the input fields to the email that is used
     * in the current session.
     * @authors Colin Laan & Jaden van Rijswijk
     * @private
     */
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

    #getSiblings(elem) {

        // Setup siblings array and get the first sibling
        let siblings = [];
        let sibling = elem.parentNode.firstChild;

        // Loop through each sibling and push to the array
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== elem) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling
        }

        return siblings;
    };
    /**
     * Fetches the available options out of the database and adds them to the selectable day types
     * @author Colin Laan
     * @private
     */
    async #addSelectionFields() {

        const email = App.sessionManager.get("email");
        const default_schedules = await this.#changeDefaultSchedule.defaultSchedule(email);
        const day_types = await this.#changeDefaultSchedule.getDayTypes();
        console.log(day_types);

        default_schedules.forEach(function (schedule) {
            let schedule_day = document.getElementById(schedule.day + "_field");
            day_types.forEach(function (daytype) {
                const listOption = document.createElement("option");
                listOption.value = daytype.daytype;
                listOption.innerText = daytype.daytype;

                console.log(schedule_day.querySelector(".day-type").parentNode)
                schedule_day.querySelector(".day-type").appendChild(listOption);
            });
        });
    }

    /**
     * Fills the input fields with the data that is already present in the database.
     * @author Jaden van Rijswijk, Colin Laan
     * @private
     */
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

    /**
     * Changes the visibility of certain input fields to be more fitting for the day type.
     * @author Colin Laan
     * @private
     */
    async #dayTypeContentUpdate() {
        const email = App.sessionManager.get("email");
        const default_schedules = await this.#changeDefaultSchedule.defaultSchedule(email);

        default_schedules.forEach(function (schedule) {
            let schedule_day = document.getElementById(schedule.day + "_field");
            schedule_day.addEventListener("change", function() {
                // let day_type = schedule_day.querySelector(".day-type").value;

                let siblings = this.#getSiblings(schedule_day);

                if (this.value === "Empty" || this.value === "geen werk" || this.value === "ziek") {
                    this.#hideElements(siblings);
                } else {
                    this.#showElements(siblings);
                }
            });
        });
    }

    #hideElements(elems) {
        elems.forEach((e) => {
            e.classList.add("hideOnAtHome");
        });
    }

    #showElements(elems) {
        elems.forEach((e) => {
            e.classList.remove("hideOnAtHome");
        });
    }
}
