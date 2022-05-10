/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 * @author Dia Fortmeier
 */

import {Controller} from "./controller.js";
import {MonthLeaderboardRepository} from "../repositories/monthLeaderboardRepository.js";
import {DateController} from "./dateController.js";
import {App} from "../app.js";

export class IndividualMonthLeaderboardController extends Controller {
    #monthLeaderboardView
    #monthLeaderboard
    today
    dateController

    constructor() {
        super();

        this.#monthLeaderboard = new MonthLeaderboardRepository();
        this.today = new Date;
        this.dateController = new DateController();

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
        this.dateController.weekCounter();
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
        let currentMonth = this.today.toLocaleString('default', {month: 'long'});
        currentMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
        document.querySelector('#leaderboard-month').innerText = currentMonth;
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
     * Gets the users and all their current month points.
     * Creates the elements needed to make leaderboard entries, and displays the data in those elements.
     * @author Dia Fortmeier
     * @memberOf IndividualMonthLeaderboardController
     * @name displayIndividualMonthLeaderboard
     * @function
     * @private
     * @returns {Promise<void>}
     * @instance
     */
    async #displayIndividualMonthLeaderboard() {
        const leaderboardUsers = await this.#monthLeaderboard.individualMonthLeaderboard();
        const leaderboardContainer = this.#monthLeaderboardView.querySelector(".leaderboard-list");
        const email = App.sessionManager.get("email");
        let rankPlacementNumber = 0;

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

}