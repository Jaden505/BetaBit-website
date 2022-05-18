/**
 * Responsible for create user accounts
 *
 * @author Jaden van Rijswijk
 */

import { AdminsRepository } from "../repositories/adminsRepository.js";
import { Controller } from "./controller.js";

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

        // Search bar on keyup call display function
        let currentController = this;
        let searchbar = document.getElementById("searchbarCreateUsers");
        searchbar.onkeyup = async function () {
            let users = await currentController.#createUsers.getUsers(searchbar.value);
            currentController.#displayUsers(users);
        };

        this.#displayUsersAmount();
        this.#displayUsers(await this.#createUsers.getUsers(""));
    }

    async #sendUserData() {
        let errorHolder = document.getElementById('displayErrorCreateUsers');

        const email = document.getElementById("userEmail").value
        const name = document.getElementById("userName").value
        let role = document.getElementById("userRole").value
        const password = createUsersController.generatePassword();

        role === 'admin' ? role = 1 : role = 2;

        if (email === "" || name === "" || password === "") {return errorHolder.innerHTML = "Vul alle velden in";}

        try {
            await this.#createUsers.addUser(email, name, role, password);

            this.#displayUsers(await this.#createUsers.getUsers(""));
            this.#displayUsersAmount();

            errorHolder.style.color = 'green';
            errorHolder.innerHTML = "Gebruiker is succesvol toegevoegd";
        }
        catch(error) {
            errorHolder.style.color = 'red';
            errorHolder.innerHTML = error.reason
        }
    }

    /**
     *  Returns amount of users currently in database
     */
    async #displayUsersAmount() {
        const users = await this.#createUsers.getUsers("");
        const amount = users.length;
        const user_amount_holder = document.getElementById('amount_users');

        user_amount_holder.innerHTML = amount;
    }

    async #displayUsers(users) {
        const users_holder = document.getElementById("users_list")

        users_holder.innerHTML = "";

        for (let ind in users) {
            let user = users[ind];

            let elem = document.createElement('p');

            if (ind % 2 === 0) {elem.style.backgroundColor = '#ebebeb'}

            elem.innerText = user['username'] + "\n" + user['email'];

            users_holder.appendChild(elem)
        }
    }

    /**
     * Returns random string of 8 letters and/or numbers
     */
    static generatePassword() {
        return Math.random().toString(36).slice(-8);
    }
}
