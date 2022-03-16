/**
 * Repository responsible for all schedules from server - CRUD
 *
 * @author Jaden van Rijswijk
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class ScheduleRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/schedule"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function that requests default schedule data to network manager which will send it to our back-end
     *
     * GET request, because no given data is needed
     */
    async defaultSchedule(email) {
        return await this.#networkManager.doRequest(`${this.#route}/default`, "POST", {"email": email});
    }

    /**
     * Async function that requests schedule data to network manager which will send it to our back-end
     *
     * POST request, because given data is needed
     */
    async Schedule(begin_date, end_date, email) {
        return await this.#networkManager.doRequest(`${this.#route}`, "POST", {"begin_date": begin_date, "end_date": end_date, "email": email});
    }
}