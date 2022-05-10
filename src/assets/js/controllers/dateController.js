/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 * @author Dia Fortmeier
 */

import {Controller} from "./controller.js";
import {MonthLeaderboardRepository} from "../repositories/monthLeaderboardRepository.js";
import {App} from "../app.js";

export class DateController extends Controller {
    #monthLeaderboardView
    #monthLeaderboard
    today

    constructor() {
        super();

        this.#monthLeaderboard = new MonthLeaderboardRepository();
        this.today = new Date;

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#monthLeaderboardView = await super.loadHtmlIntoContent("html_views/individualMonthLeaderboard.html");
    }

/**
 * Counter that checks and displays how long until Monday of next week
 * @public
 * @author Dennis Bleeker, Dia Fortmeier
 */
weekCounter() {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
        const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
            .indexOf(dayName.slice(0, 3).toLowerCase());
        if (dayOfWeek < 0) return;
        refDate.setHours(0, 0, 0, 0);
        refDate.setDate(refDate.getDate() + +!!excludeToday +
            (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
        return refDate;
    }

    const countdown = () => {
        this.today = new Date;
        const countDate = getNextDayOfTheWeek("Sunday", false);
        const gap = countDate - this.today.getTime();

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.querySelector('.updateText #day').innerText = textDay + "d";
        document.querySelector('.updateText #hour').innerText = textHour + "u";
        document.querySelector('.updateText #minute').innerText = textMinute + "m";
        document.querySelector('.updateText #second').innerText = textSecond + "s";
    };

    countdown();
    setInterval(countdown, second);
}}