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
        console.log(naam+" repo")
        return await this.#networkManager.doRequest(`${this.#route}/teams`, "POST", {"naam" : naam})
    }

}