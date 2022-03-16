/**
 * Responsible for handling the actions happening on schedule view
 *
 * @author Jaden van Rijswijk & Dia Fortmeier
 */

import { Controller } from "./controller.js";
import { ScheduleRepository } from "../repositories/scheduleRepository.js";
import { App } from "../app.js";

export class ScheduleController extends Controller{
    #scheduleView
    #schedule
    #date = new Date();
    static days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    static months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]

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
        this.#getWeekOfTheYear();
        if (screen.width < 992) {
            this.#createScheduleTabs();
        }
    }

    /**
     * Checks which day is equal to today and highlights it.
     */
    #highlightDay() {
        let day_containers = Array.from(document.getElementById("days_holder").children)
        let today = ScheduleController.days[this.#date.getDay()];

        for (let day of day_containers) {
            // Highlight current day
            if (day.id === today) {
                day.classList.add("current-day");

                if (screen.width < 992) {
                    day.classList.add("selected-day");
                    document.querySelector("#" + day.id + "_detail").classList.add("selected-day");
                }
            }
        }
    }

    /**
     * Gets the current dates for all seven days of the week.
     * @param date_type it can either be 'day', 'month' or 'date'
     * @returns {*[]}
     */
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
                date = ScheduleController.months[parseInt(month_decimal)-1];
            }
            else if (date_type === "date") {
                date = new Date(curr.setDate(first)).toISOString().slice(0, 10);
            }

            dates.push(date);
        }

        return dates;
    }

    /**
     * Displays the current dates for all seven days of the week, and also uses the first and last days of the week.
     */
    #displayCurrentDates() {
        let day_containers = document.getElementById("days_holder").children
        let current_days = this.#getCurrentDates("day");
        let current_months = this.#getCurrentDates("month");

        for (let i=0; i<7; i++) {
            let day = day_containers[i];
            day.querySelector(".date").innerHTML = current_days[i];
            day.querySelector(".month").innerHTML = current_months[i];

            document.querySelector("#first-weekDay").innerHTML =
                "maandag " + current_days[0] + " " + current_months[i] + " " + new Date().getFullYear();
            document.querySelector("#last-weekDay").innerHTML =
                "zondag " + current_days[6] + " " + current_months[i] + " " + new Date().getFullYear();
        }
    }

    /**
     * Calculates the current week number of the year.
     */
    #getWeekOfTheYear() {
        let currentDate = new Date();
        let oneJan = new Date(currentDate.getFullYear(),0,1);
        let numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
        let result = Math.ceil(( currentDate.getDay() + 1 + numberOfDays) / 7);

        document.querySelector("#schedule-week").innerHTML = result;
    }

    /**
     * Creates tabs for each schedule day.
     */
    #createScheduleTabs() {
        const items = document.querySelectorAll(".schedule-item");
        items.forEach(node => {
            node.addEventListener("click", e => {
                let activeTabs = document.querySelectorAll('.selected-day');

                activeTabs.forEach(function(tab) {
                    tab.className = tab.className.replace('selected-day', '');
                });

                // activate new tab and panel
                e.currentTarget.className += ' selected-day';
                let goodId = e.currentTarget.id + "_detail";
                document.getElementById(goodId).className += ' selected-day';
            });
        });
    }

    /**
     * Gets the default schedule, and schedule from the db.
     * It checks if the days exists in the schedule else it uses the default schedule day.
     * at the end the schedule gets put in the corresponding html fields.
     *
     * @returns {Promise<void>}
     */
    async #displaySchedule() {
        const email = App.sessionManager.get("email");
        const default_schedules = await this.#schedule.defaultSchedule(email);
        const schedules = await this.#schedule.Schedule(this.#getCurrentDates("date")[0], this.#getCurrentDates("date")[6], email);

        let day_schedules = schedules.slice(0);

        day_schedules.forEach(function(part, index) {
            let date = part.date;
            this[index] = ScheduleController.days[new Date(date).getDay()]
        }, day_schedules);

        default_schedules.forEach(function (s) {
            let schedule;
            let schedule_day;

            if (day_schedules.includes(s.day)) {
                schedule = schedules[day_schedules.indexOf(s.day)];
                schedule_day = document.getElementById(ScheduleController.days[new Date(schedule.date).getDay()] + "_detail");
            }
            else {
                schedule = s;
                schedule_day = document.getElementById(s.day + "_detail");
            }

            let totalEmissions = schedule.transport_emissions * schedule.travel_distance;

            schedule_day.querySelector(".day-type").innerHTML = schedule.daytype;
            schedule_day.querySelector(".start-time").innerHTML = schedule.start_time.slice(0, 5);
            schedule_day.querySelector(".end-time").innerHTML = schedule.end_time.slice(0, 5);
            schedule_day.querySelector(".travel-distance").innerHTML = schedule.travel_distance + " km";
            schedule_day.querySelector(".transport").innerHTML = schedule.transport;
            schedule_day.querySelector(".emission").innerHTML = totalEmissions + " g";
        });
    }
}
