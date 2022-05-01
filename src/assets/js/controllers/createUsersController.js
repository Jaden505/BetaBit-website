/**
 * Responsible for handling the actions happening on the navigation
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { App } from "../app.js";
import {AdminsRepository} from "../repositories/adminsRepository.js";
import {Controller} from "./controller.js";

export class createUsersController extends Controller {
    #createUsersView
    #createUsers

    constructor() {
        super();

        this.#createUsers = new AdminsRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html
     * @returns {Promise<void>}
     * @name setupView
     * @function
     * @private
     * @instance
     */
    async #setupView() {
        //await for when HTML is
        this.#createUsersView = await super.loadHtmlIntoContent("html_views/createUsers.html")

        this.#createUsersView.querySelector("#submitCreateUser").addEventListener("click", this.#sendUserData.bind(this))
    }

    async #sendUserData() {
        const email = document.getElementById("userEmail").value
        const name = document.getElementById("userName").value
        const role = document.getElementById("userRole").value
        const password = document.getElementById("userPassword").value

        if (role === 'admin') {this.#createUsers.addUser(email, name, 1, password)}
        else {await this.#createUsers.addUser(email, name, 2, password)}
    }
}
