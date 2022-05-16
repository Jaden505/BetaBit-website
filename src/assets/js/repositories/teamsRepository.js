/**
 * Repository responsible for all admin sided team related stuff from server - CRUD
 *
 * @author Dia Fortmeier
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class TeamsRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/admin/teams"
        this.#networkManager = new NetworkManager();
    }
    async postTeam(naam) {
        console.log(naam)
        return await this.#networkManager.doRequest(`${this.#route}`, "POST", {"naam" : naam})
    }

}