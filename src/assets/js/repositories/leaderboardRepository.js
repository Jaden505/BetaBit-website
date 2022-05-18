/**
 * Repository responsible for all monthly leaderboards from server - CRUD
 *
 * @author Dia Fortmeier
 * && Jaden van Rijswijk
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class LeaderboardRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/leaderboard"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function that requests individualLeaderboard data to network manager which will send it to our back-end
     *
     * POST request, because given data is needed
     */
    async individualLeaderboard(begin_date, end_date) {
        return await this.#networkManager.doRequest(`${this.#route}/individual`, "POST", {"begin_date": begin_date, "end_date": end_date});
    }

    /**
     * Async function that posts search string data to back-end and will respond with a json of found users
     *
     * POST request, because search string is needed
     */
    async searchUsers(search_string) {
        return await this.#networkManager.doRequest(`${this.#route}/search`, "POST", {"search_string": search_string});
    }
}