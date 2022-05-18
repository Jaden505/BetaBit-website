/**
 * Responsible for handling the actions happening on schedule view
 *
 */

import {Controller} from "./controller.js";
import {ScheduleRepository} from "../repositories/scheduleRepository.js";
import {App} from "../app.js";

export class ScheduleController extends Controller {
    #scheduleView
    #schedule
    #date = new Date();
    static days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    static months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]

    constructor() {
        super();

        this.#schedule = new ScheduleRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @memberOf ScheduleController
     * @name setupView
     * @function
     * @private
     * @instance
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#scheduleView = await super.loadHtmlIntoContent("html_views/schedule.html")

        // Redirect buttons
        this.#scheduleView.querySelector("#changeSchedule").addEventListener("click", function () {
            document.querySelector("#popupOverlay").style.display = 'block';
            App.loadController(App.CONTROLLER_CHANGE_SCHEDULE)
        });
        this.#scheduleView.querySelector("#defaultSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_DEFAULT_SCHEDULE));

        // Loads and displays dates
        this.#displaySchedule();
        this.#displayCurrentDates();
        this.#highlightDay();
        this.#getWeekOfTheYear();

        // Dynamic
        if (screen.width < 992) {
            this.#createScheduleTabs();
        }
    }

    /**
     * Checks which day is equal to today and highlights it.
     * @author Jaden Rijswijk
     * @memberOf ScheduleController
     * @name highlightDay
     * @function
     * @private
     * @instance
     */
    #highlightDay() {
        let day_containers = Array.from(this.#scheduleView.querySelector("#days_holder").children)
        let today = ScheduleController.days[this.#date.getDay()];

        for (let day of day_containers) {
            // Highlight current day
            if (day.id === today) {
                day.classList.add("current-day");

                if (screen.width < 992) {
                    day.classList.add("selected-day");
                    this.#scheduleView.querySelector("#" + day.id + "_detail").classList.add("selected-day");
                }
            }
        }
    }

    /**
     * Gets the current dates for all seven days of the week.
     * @param date_type it can either be 'day', 'month' or 'date'
     * @returns {*[]}
     * @author Jaden Rijswijk
     * @memberOf ScheduleController
     * @name getCurrentDates
     * @function
     * @private
     * @instance
     */
    #getCurrentDates(date_type) {
        let curr = new Date;
        let dates = [];

        for (let i = 1; i <= 7; i++) {
            let date;
            let first = curr.getDate() - curr.getDay() + i;

            if (date_type === "day") {
                date = new Date(curr.setDate(first)).toISOString().slice(8, 10);
            } else if (date_type === "month") {
                let month_decimal = new Date(curr.setDate(first)).toISOString().slice(5, 7)
                date = ScheduleController.months[parseInt(month_decimal) - 1];
            } else if (date_type === "date") {
                date = new Date(curr.setDate(first)).toISOString().slice(0, 10);
            }

            dates.push(date);
        }

        return dates;
    }

    /**
     * Displays the current dates for all seven days of the week, and also uses the first and last days of the week.
     * @author Jaden Rijswijk
     * @memberOf ScheduleController
     * @name displayCurrentDates
     * @function
     * @private
     * @instance
     */
    #displayCurrentDates() {
        let day_containers = this.#scheduleView.querySelector("#days_holder").children
        let current_days = this.#getCurrentDates("day");
        let current_months = this.#getCurrentDates("month");

        for (let i = 0; i < 7; i++) {
            let day = day_containers[i];
            day.querySelector(".date").innerHTML = current_days[i];
            day.querySelector(".month").innerHTML = current_months[i];

            this.#scheduleView.querySelector("#first-weekDay").innerHTML =
                "maandag " + current_days[0] + " " + current_months[i] + " " + new Date().getFullYear();
            this.#scheduleView.querySelector("#last-weekDay").innerHTML =
                "zondag " + current_days[6] + " " + current_months[i] + " " + new Date().getFullYear();
        }
    }

    /**
     * Calculates the current week number of the year.
     * @author Dia Fortmeier
     * @memberOf ScheduleController
     * @name getWeekOfTheYear
     * @function
     * @private
     * @instance
     */
    #getWeekOfTheYear() {
        Date.prototype.getWeekNumber = function () {
            let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
            let dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
        };

        let weekNumber = (new Date().getWeekNumber());

        this.#scheduleView.querySelector("#schedule-week").innerHTML = weekNumber.toString();
    }

    /**
     * Creates tabs for each schedule day.
     * @author Dia Fortmeier
     * @memberOf ScheduleController
     * @name createScheduleTabs
     * @function
     * @private
     * @instance
     */
    #createScheduleTabs() {
        const items = document.querySelectorAll(".schedule-item");
        items.forEach(node => {
            node.addEventListener("click", e => {
                let activeTabs = document.querySelectorAll('.selected-day');

                activeTabs.forEach(function (tab) {
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
     * Creates the right label for the transport icon.
     * Checks if the transport has an type added to it.
     * If it does then it returns the type.
     * If it doesn't then it returns the full transport
     * @param transport transport of the day
     * @author Dia Fortmeier
     * @memberOf ScheduleController
     * @name getTransportTypeLabel
     * @function
     * @private
     * @instance
     */
    static #getTransportTypeLabel(transport) {
        let transportLabel;
        let transportList = transport.split(" ");

        if (transportList.length > 1) {
            transportLabel = transportList[0];

            if (transportList[0] === "elektrische") {
                transportLabel = transportLabel.slice(0, transportLabel.length - 1);
            }
        } else {
            transportLabel = transport;
        }

        return transportLabel;
    }

    /**
     * Gets the default schedule, and schedule from the db.
     * It checks if the days exists in the schedule else it uses the default schedule day.
     * at the end the schedule gets put in the corresponding html fields.
     * @returns {Promise<void>}
     * @author Dia Fortmeier
     * @memberOf ScheduleController
     * @name displaySchedule
     * @function
     * @private
     * @instance
     */
    async #displaySchedule() {
        const email = App.sessionManager.get("email");
        const default_schedules = await this.#schedule.defaultSchedule(email);
        const schedules = await this.#schedule.Schedule(this.#getCurrentDates("date")[0], this.#getCurrentDates("date")[6], email);

        let day_schedules = schedules.slice(0);

        day_schedules.forEach(function (part, index) {
            let date = part.date;
            this[index] = ScheduleController.days[new Date(date).getDay()]
        }, day_schedules);

        default_schedules.forEach(function (s) {
            const noTransportDays = [3, 4, 5];
            const noWorkTimeDays = [4, 5];
            let schedule;
            let schedule_day;

            if (day_schedules.includes(s.day)) {
                schedule = schedules[day_schedules.indexOf(s.day)];
                schedule_day = document.getElementById(ScheduleController.days[new Date(schedule.date).getDay()] + "_detail");
            } else {
                schedule = s;
                schedule_day = document.getElementById(s.day + "_detail");
            }

            let totalEmissions = schedule.transport_emissions * schedule.travel_distance;
            let totalPoints = schedule.points_max;

            schedule_day.querySelector(".type-icon").classList.add(schedule.type_icon);
            schedule_day.querySelector(".day-type").innerHTML = schedule.daytype;

            if (noTransportDays.includes(schedule.schedule_daytype_id)) {
                let noWorkDay = schedule_day.querySelector(".work-time").parentElement;
                let dayDetails = noWorkDay.parentElement;

                while (dayDetails.firstChild) {
                    dayDetails.removeChild(dayDetails.firstChild);
                }
                dayDetails.appendChild(noWorkDay);
                if (noWorkTimeDays.includes(schedule.schedule_daytype_id)) {
                    noWorkDay.querySelector(".work-time").innerHTML = "n.v.t";
                } else {
                    schedule_day.querySelector(".work-time").innerHTML =
                        schedule.start_time.slice(0, 5) + " - " + schedule.end_time.slice(0, 5);
                }
            } else {
                schedule_day.querySelector(".work-time").innerHTML =
                    schedule.start_time.slice(0, 5) + " - " + schedule.end_time.slice(0, 5);
                schedule_day.querySelector(".travel-distance").innerHTML = schedule.travel_distance + " km";
                schedule_day.querySelector(".transport-icon").classList.add(schedule.transport_icon);
                schedule_day.querySelector(".transport").innerHTML =
                    ScheduleController.#getTransportTypeLabel(schedule.transport);
                schedule_day.querySelector(".emission").innerHTML = totalEmissions + " g";
                schedule_day.querySelector(".points").innerHTML = totalPoints + " punten";
            }
        });
    }
}
