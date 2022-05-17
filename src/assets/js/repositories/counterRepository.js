/**
 * Repository responsible for counter date from database
 *
 * @author Dennis Bleeker
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class CounterRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/counter"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Updates the current update date of the leaderboard
     *
     * PUT request because data is being sent
     */
    async updateCounterDate(update_date) {
        return await this.#networkManager.doRequest(`${this.#route}/update/default`, "PUT",
            {"update_date": update_date});
    }

    /**
     *
     *
     *
     */
    async counterDate(update_date) {
        return await this.#networkManager.doRequest(`${this.#route}/default`, "POST", {"update_date": update_date});
    }
}