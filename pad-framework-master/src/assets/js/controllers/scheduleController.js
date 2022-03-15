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

        this.#displaySchedule();
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

    #getCurrentDates(date_type) {
        let curr = new Date;
        let dates = [];

        for (let i = 1; i <= 7; i++) {
            let date;
            let first = curr.getDate() - curr.getDay() + i;

            if (date_type === "day") {
                date = new Date(curr.setDate(first)).toISOString().slice(8, 10);
            }
            else if (date_type === "month") {
                let month_decimal = new Date(curr.setDate(first)).toISOString().slice(5, 7)
                date = this.#months[parseInt(month_decimal)-1];
            }
            else if (date_type === "date") {
                date = new Date(curr.setDate(first)).toISOString().slice(0, 10);
            }

            dates.push(date);
        }

        return dates;
    }

    #displayCurrentDates() {
        let day_containers = document.getElementById("days_holder").children
        let current_days = this.#getCurrentDates("day");
        let current_months = this.#getCurrentDates("month");

        for (let i=0; i<7; i++) {
            let day = day_containers[i];
            day.querySelector(".date").innerHTML = current_days[i];
            day.querySelector(".month").innerHTML = current_months[i];
        }
    }

    async #displaySchedule() {
        const username = App.sessionManager.get("username");

        console.log(this.#getCurrentDates("date")[0], this.#getCurrentDates("date")[6])

        const default_schedules = await this.#schedule.defaultSchedule(username);
        const schedules = await this.#schedule.Schedule(this.#getCurrentDates("date")[0], this.#getCurrentDates("date")[6], username);

        default_schedules.forEach(function (schedule) {
            let schedule_day = document.getElementById(schedule.day + "_detail");
            let totalEmissions = schedule.transport_emissions * schedule.travel_distance;

            if (schedule.schedule_daytype_id === 4 || schedule.schedule_daytype_id === 5) {
                schedule_day.querySelector(".day-type").innerHTML = schedule.daytype;
            } else if (schedule.schedule_daytype_id === 3) {
                schedule_day.querySelector(".day-type").innerHTML = schedule.daytype;
                schedule_day.querySelector(".start-time").innerHTML = schedule.start_time.slice(0, 5);
                schedule_day.querySelector(".end-time").innerHTML = schedule.end_time.slice(0, 5);
            } else {
                schedule_day.querySelector(".day-type").innerHTML = schedule.daytype;
                schedule_day.querySelector(".start-time").innerHTML = schedule.start_time.slice(0, 5);
                schedule_day.querySelector(".end-time").innerHTML = schedule.end_time.slice(0, 5);
                schedule_day.querySelector(".travel-distance").innerHTML = schedule.travel_distance + " km";
                schedule_day.querySelector(".transport").innerHTML = schedule.transport;
                schedule_day.querySelector(".emission").innerHTML = totalEmissions + " g";
            }
        });
    }
}
