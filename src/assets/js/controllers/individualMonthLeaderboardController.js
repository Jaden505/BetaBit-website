/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 * @author Dia Fortmeier & Jaden van Rijswijk
 */

import {Controller} from "./controller.js";
import {MonthLeaderboardRepository} from "../repositories/monthLeaderboardRepository.js";
import {App} from "../app.js";

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

        // Search bar on keyup call display function
        let currentController = this;
        let searchbar = document.getElementById("searchbar");
        searchbar.onkeyup = async function () {
            let users = await currentController.getUsers(searchbar.value);
            currentController.displayIndividualMonthLeaderboard(users);
        };

        this.#currentMonth();
        this.weekCounter();
        await this.displayIndividualMonthLeaderboard(await this.getUsers());
        this.createTopThreeLeaderboardIcons();
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
        let currentMonth = this.today.toLocaleString('default', {month: 'long'});
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
            const countDate = getNextDayOfTheWeek("Monday", false);
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

        // let timer = setInterval(countdown, second);
        window.onunload = function () {clearInterval(timer)} // WERKT NIET
        countdown();
        // setInterval(countdown, second);
    }

    /**
     * checks if the given email is the same as the email of the user thats logged in
     * if yes, adds extra css to highlight their placement
     * @param email email that gets checked
     * @param listRank classlist that gets changed so that its highlighted
     * @author Mairo Tzouvelekis
     */

    static createUserHighlight(email, listRank) {
        if (email === App.sessionManager.get("email")) {
            listRank.classList.add("list-rank-Highlighted");
        }
    }

    /**
     * @param search_string
     * @returns users
     */
    async getUsers(search_string = "") {
        if (search_string === "") {return await this.#monthLeaderboard.individualMonthLeaderboard();}
        else {return await this.#monthLeaderboard.searchUsers(search_string);}
    }

    createTopThreeLeaderboardIcons() {
        const rankOne = [1, "#FFD700"];
        const rankTwo = [2, "#C0C0C0"];
        const rankThree = [3, "#D7995B"];

        let styleElem = document.head.appendChild(document.createElement("style"));
        for (let i = 1; i <= rankThree[0]; i++) {
            styleElem.innerHTML += `
                     #placement_${i}:before {visibility: visible;}
                     #placement_${i}:after {visibility: visible;}
                 `;

            if (i === rankOne[0]) {
                styleElem.innerHTML += `
                     #placement_${i}:before {color: ${rankOne[1]};}
                     #placement_${i}:after {color: ${rankOne[1]};}
                 `;
            } else if (i === rankTwo[0]) {
                styleElem.innerHTML += `
                     #placement_${i}:before {color: ${rankTwo[1]};}
                     #placement_${i}:after {color: ${rankTwo[1]};}
                 `;
            } else if (i === rankThree[0]) {
                styleElem.innerHTML += `
                     #placement_${i}:before {color: ${rankThree[1]};}
                     #placement_${i}:after {color: ${rankThree[1]};}
                 `;
            }
        }
    }

    /**
     * Gets the users and all their current month points.
     * Creates the elements needed to make leaderboard entries, and displays the data in those elements.
     * @author Dia Fortmeier
     * @memberOf IndividualMonthLeaderboardController
     * @name displayIndividualMonthLeaderboard
     * @function
     * @public
     * @returns {Promise<void>}
     * @instance
     */
    async displayIndividualMonthLeaderboard(leaderboardUsers) {
        const leaderboardContainer = this.#monthLeaderboardView.querySelector(".leaderboard-list");
        let rankPlacementNumber = 0;

        leaderboardContainer.innerHTML = ""

        leaderboardUsers.forEach(function (lu) {
            const listRank = document.createElement("div");
            const rankPlacement = document.createElement("div");
            const rankUser = document.createElement("div");
            const userImage = document.createElement("img");
            const userName = document.createElement("div");
            const rankPoints = document.createElement("div");
            const pointsLabel = document.createElement("span");
            const pointsTotal = document.createElement("span");

            listRank.classList.add("list-rank");
            rankPlacement.classList.add("rank-placement");
            rankUser.classList.add("rank-user");
            userImage.classList.add("user-image");
            userName.classList.add("user-name");
            rankPoints.classList.add("rank-points");
            pointsLabel.classList.add("points-label");
            pointsTotal.classList.add("points-total");

            rankPlacementNumber++;
            rankPlacement.id = `placement_${rankPlacementNumber.toString()}`;
            rankPlacement.textContent = rankPlacementNumber.toString();
            userName.textContent = lu.username;

            let nameList = userName.textContent.split(" ").join("+");
            userImage.src = `https://ui-avatars.com/api/?name=${nameList}&background=B70D31&color=fff`;
            pointsLabel.textContent = "Punten";
            pointsTotal.textContent = lu.points;

            leaderboardContainer.appendChild(listRank);
            rankUser.append(userImage, userName);
            rankPoints.append(pointsLabel, pointsTotal);
            listRank.append(rankPlacement, rankUser, rankPoints);

            IndividualMonthLeaderboardController.createUserHighlight(lu.email, listRank);
        });
    }

    _stop = () => {
        clearInterval(this.timerId);
    }
}