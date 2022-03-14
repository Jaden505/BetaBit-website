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
    #months = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]

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

        // this.#displaySchedule();
        this.#displayCurrentDates();
        this.#highlightDay();
    }

    #highlightDay() {
        let day_containers = Array.from(document.getElementById("days_holder").children)
        let today = this.#days[this.#date.getDay()];

        for (let day of day_containers) {
            // Highlight current day
            if (day.id === today) {day.classList.add("active-day")}
        }
    }

    #getcurrentDates() {
        let curr = new Date;
        let dates = [];

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i

            let day = new Date(curr.setDate(first)).toISOString().slice(8, 10)
            let month_decimal = new Date(curr.setDate(first)).toISOString().slice(5, 7)
            let month = this.#months[parseInt(month_decimal)-1];

            dates.push(day + " " + month)
        }

        return dates;
    }

    #displayCurrentDates() {
        let day_containers = document.getElementById("days_holder").children
        let current_dates = this.#getcurrentDates();

        for (let i=0; i<7; i++) {
            let day = day_containers[i];
            day.querySelector(".date").innerHTML = current_dates[i]
        }
    }

    async #displaySchedule() {
        const schedules = await this.#schedule.defaultSchedule();

        // `user_email` VARCHAR(255) NOT NULL,
        //     `day` VARCHAR(45) NOT NULL,
        //     `type` INT NOT NULL,
        //     `start_time` TIME NULL,
        //     `end_time` TIME NULL,
        //     `travel_distance` DOUBLE NULL,
        //     `transport` INT NULL,

        schedules.forEach(function (schedule) {
            let day = document.getElementById(schedule.day);
            let text = document.createTextNode(`Start tijd: ${schedule.type}Eind tijd: ${schedule.end_time}`);

            day.appendChild(text);
        });
    }
}
