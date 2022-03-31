/**
 * Repository responsible for all monthly leaderboards from server - CRUD
 *
 * @author Dia Fortmeier
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class MonthLeaderboardRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/monthLeaderboard"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function that requests individualMonthLeaderboard data to network manager which will send it to our back-end
     *
     * GET request, because no given data is needed
     */
    async individualMonthLeaderboard() {
        return await this.#networkManager.doRequest(`${this.#route}/individual`, "GET");
    }
}