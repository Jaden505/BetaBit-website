/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 * @author Dia Fortmeier
 */

import { Controller } from "./controller.js";

export class IndividualMonthLeaderboardController extends Controller {
    #monthLeaderboardView

    constructor() {
        super();
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

        //countdown
        const countdown = () => {
            const countDate = new Date('May 17, 2022 00:00:00').getTime();
            const now = new Date().getTime();
            const gap = countDate - now;

            //tijd
            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;

            //tijd berekenen
            const textDay = Math.floor(gap / day);
            const textHour = Math.floor((gap % day) / hour);
            const textMinute = Math.floor((gap % hour) / minute);
            const textSecond = Math.floor((gap % minute) / second);

            document.querySelector('.day').innerText = textDay;
            document.querySelector('.hour').innerText = textHour;
            document.querySelector('.minute').innerText = textMinute;
            document.querySelector('.second').innerText = textSecond;

            console.log(gap,textDay,textHour,textMinute,textSecond)

            if(gap < 1000) {

            }

        };

        countdown();
        setInterval(countdown, 1000);

    }
}