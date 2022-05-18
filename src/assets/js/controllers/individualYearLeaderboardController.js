/**
 * Responsible for handling the actions happening on yearLeaderboard views
 *
 */

import {Controller} from "./controller.js";
import {UtilsController} from "./utilsController.js";
import {LeaderboardRepository} from "../repositories/leaderboardRepository.js";
import {App} from "../app.js";

export class IndividualYearLeaderboardController extends Controller {
    #yearLeaderboardView
    #yearLeaderboard
    #utilsController

    constructor() {
        super();

        this.#yearLeaderboard = new LeaderboardRepository();
        this.#utilsController = new UtilsController();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @memberOf IndividualYearLeaderboardController
     * @name setupView
     * @function
     * @private
     * @instance
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#yearLeaderboardView = await super.loadHtmlIntoContent("html_views/individualYearLeaderboard.html");

        // Redirect button
        this.#yearLeaderboardView.querySelector("#monthLeaderboard").addEventListener("click", event => App.loadController(App.CONTROLLER_INDIVIDUAL_MONTH_LEADERBOARD));

        // Search bar on keyup call display function
        let currentController = this;
        let searchbar = document.getElementById("searchbar");
        searchbar.onkeyup = async function () {
            let users = await currentController.getUsers(searchbar.value);
            currentController.displayIndividualYearLeaderboard(users);
        };

        this.#utilsController.currentYear();
        await this.displayIndividualYearLeaderboard(await this.getUsers());
        this.createTopThreeLeaderboardIcons();
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
     * Gets the users based on the search_string
     * @param search_string input of searchbar
     * @returns users users that match search_string
     * @author Jaden Rijswijk
     */
    async getUsers(search_string = "") {
        if (search_string === "") {return await this.#yearLeaderboard.individualLeaderboard(this.#utilsController.beginCurrentYear(), this.#utilsController.endCurrentYear());}
        else {return await this.#yearLeaderboard.searchUsers(search_string);}
    }

    /**
     * Adds three different icons for the top three on the leaderboard
     * @public
     * @author Amir Suleimani
     */
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
     * Creates a info card at the top of the leaderboard that shows your personal rank info.
     * @public
     * @author Dia Fortmeier
     */
    static createSessionUserPlacement(rank, rankId, username, userImage, points) {
        document.querySelector(".leaderboard-me .rank-placement").textContent = rank.toString();
        document.querySelector(".leaderboard-me .rank-placement").id = rankId;
        document.querySelector("#me-image").src = userImage;
        document.querySelector("#me-name").textContent = username;
        document.querySelector("#me-points-total").textContent = points;
    }

    /**
     * Gets the users and all their current year points.
     * Creates the elements needed to make leaderboard entries, and displays the data in those elements.
     * @author Dia Fortmeier
     * @memberOf IndividualYearLeaderboardController
     * @name displayIndividualYearLeaderboard
     * @function
     * @public
     * @returns {Promise<void>}
     * @instance
     */
    async displayIndividualYearLeaderboard(leaderboardUsers) {
        const leaderboardContainer = this.#yearLeaderboardView.querySelector(".leaderboard-list");
        let rankPlacementNumber = 0;

        leaderboardContainer.innerHTML = "";

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

            if (App.sessionManager.get("username") === lu.username) {
                IndividualYearLeaderboardController.createSessionUserPlacement(rankPlacementNumber, rankPlacement.id,
                    lu.username,`https://ui-avatars.com/api/?name=${nameList}&background=B70D31&color=fff`,
                    lu.points);
            }

            leaderboardContainer.appendChild(listRank);
            rankUser.append(userImage, userName);
            rankPoints.append(pointsLabel, pointsTotal);
            listRank.append(rankPlacement, rankUser, rankPoints);

            IndividualYearLeaderboardController.createUserHighlight(lu.email, listRank);
        });
    }

    _stop = () => {
        clearInterval(this.timerId);
    }
}