/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 * @author Dia Fortmeier
 */

import { Controller } from "./controller.js";
import { MonthLeaderboardRepository } from "../repositories/monthLeaderboardRepository.js";
import { App } from "../app.js";

export class IndividualMonthLeaderboardController extends Controller {
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

        this.#currentMonth();
        this.weekCounter();
        await this.#displayIndividualMonthLeaderboard();
    }

    /**
     * Gets the current month and displays it.
     * @author Dia Fortmeier
     * @memberOf IndividualMonthLeaderboardController
     * @name currentMonth
     * @function
     * @private
     * @instance
     */
    #currentMonth() {
        let currentMonth = this.today.toLocaleString('default', { month: 'long' });
        currentMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
        document.querySelector('#leaderboard-month').innerText = currentMonth;
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

        const countdown = () => {
            this.today = new Date;
            const nextMon = this.today.getDate() - this.today.getDay();
            const countDate = new Date(this.today.setDate(nextMon)).setHours(24,0,0,0);
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
    }

    async #displayIndividualMonthLeaderboard() {
        const leaderboardUsers = await this.#monthLeaderboard.individualMonthLeaderboard();
        const leaderboardContainer = this.#monthLeaderboardView.querySelector(".leaderboard-list");
        const email = App.sessionManager.get("email");
        let rankPlacementNumber = 0;

        leaderboardUsers.forEach(function (lu) {
            const listRank = document.createElement("div");
            const rankPlacement = document.createElement("div");
            const rankUser = document.createElement("div");
            const userImage = document.createElement("div");
            const userName = document.createElement("div");
            const rankPoints = document.createElement("div");
            const pointsTotal = document.createElement("span");

            listRank.classList.add("list-rank");
            rankPlacement.classList.add("rank-placement");
            rankUser.classList.add("rank-user");
            userImage.classList.add("user-image");
            userName.classList.add("user-name");
            rankPoints.classList.add("rank-points");
            pointsTotal.classList.add("points-total");

            rankPlacementNumber++;
            rankPlacement.textContent = rankPlacementNumber.toString();
            userImage.textContent = "[Foto]";
            userName.textContent = lu.username;
            rankPoints.textContent = "Punten";
            pointsTotal.textContent = lu.points;

            leaderboardContainer.appendChild(listRank);
            rankUser.append(userImage, userName);
            rankPoints.appendChild(pointsTotal);
            listRank.append(rankPlacement, rankUser, rankPoints);
        });
    }
}