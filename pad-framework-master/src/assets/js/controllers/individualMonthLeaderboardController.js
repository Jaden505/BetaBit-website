/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 * @author Dia Fortmeier
 */

import { Controller } from "./controller.js";

export class IndividualMonthLeaderboardController extends Controller {
    #monthLeaderboardView
    #today

    constructor() {
        super();
        this.#today = new Date;

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

        this.#weekCounter();
    }

    #weekCounter() {
        const countdown = () => {
            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;

            const nextMon = this.#today.getDate() - this.#today.getDay();
            const countDate = new Date(this.#today.setDate(nextMon)).setHours(24,0,0,0);
            const now = this.#today.getTime();
            const gap = countDate - now;

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
        setInterval(countdown, 1000);
    }
}