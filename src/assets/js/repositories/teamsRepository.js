/**
 * Repository responsible for all monthly leaderboards from server - CRUD
 *
 * @author Dia Fortmeier
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class teamsRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/admin/teams"
        this.#networkManager = new NetworkManager();
    }


}