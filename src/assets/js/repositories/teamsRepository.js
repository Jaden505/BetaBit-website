/**
 * Repository responsible for all admin sided team related stuff from server - CRUD
 *
 * @author Mairo Tzouvelekis
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class TeamsRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/admin"
        this.#networkManager = new NetworkManager();
    }

    async postTeam(naam) {
        return await this.#networkManager.doRequest(`${this.#route}/teams`, "POST", {"naam" : naam})
    }
    async addMember(user_email,team_naam) {
        return await this.#networkManager.doRequest(`${this.#route}/teams/members`, "POST", {"user_email" : user_email, "team_naam": team_naam})
    }
    async getTeam() {
        return await this.#networkManager.doRequest(`${this.#route}/teams`, "GET")
    }


}