/**
 * Repository responsible for all admin requests and posts from server
 *
 * @author Jaden van Rijswijk
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class AdminsRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/admin"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function that adds user to database
     *
     * POST request, because given data is needed
     */
    async addUser(email, name, role, password) {
        return await this.#networkManager.doRequest(`${this.#route}/create/user`, "POST",
            {"email": email, "name": name, "role": role, "password": password});
    }

    /**
     * Async function that get all users from database with given search value
     *
     * POST request, because given data is needed
     */
    async getUsers(search_value) {
        return await this.#networkManager.doRequest(`${this.#route}/get/users`, "POST", {"search_value": search_value});
    }
}