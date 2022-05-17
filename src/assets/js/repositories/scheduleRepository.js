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
     * Updates the default schedule of the user to the corresponding email
     *
     * PUT request because data is being sent
     */
    async updateDefaultSchedule(day_type, begin_date, end_date, distance, vehicle, email, target_day) {
        return await this.#networkManager.doRequest(`${this.#route}/update/default`, "POST",
            {"begin_date": begin_date, "end_date": end_date, "email": email,
                "distance": distance, "vehicle": vehicle, "day_type": day_type, "target_day": target_day});
    }

    /**
     * Async function that requests schedule data to network manager which will send it to our back-end
     *
     * POST request, because given data is needed
     */
    async Schedule(begin_date, end_date, email) {
        return await this.#networkManager.doRequest(`${this.#route}`, "POST",
            {"begin_date": begin_date, "end_date": end_date, "email": email});
    }

    /**
     * Async function that posts schedule data to network manager which will send it to our database
     */
    async updateSchedule(day_type, begin_date, end_date, distance, vehicle, email, date) {
        return await this.#networkManager.doRequest(`${this.#route}/update`, "POST",
            {"begin_date": begin_date, "end_date": end_date, "email": email,
                "distance": distance, "vehicle": vehicle, "day_type": day_type, "date": date});
    }

    async getOptions(table) {
        return await this.#networkManager.doRequest(`${this.#route}/options`, "POST", {"table": table})
    }

    async getDayTypes() {
        return await this.#networkManager.doRequest(`${this.#route}/daytypes`, "POST")
    }

    async getTransportationOptions() {
        return await this.#networkManager.doRequest(`${this.#route}/transportation`, "POST")
    }
}