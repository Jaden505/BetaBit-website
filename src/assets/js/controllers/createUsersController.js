/**
 * Responsible for handling the actions happening on the navigation
 *
 * @author Lennard Fonteijn & Pim Meijer
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

        this.#displayUsersAmount();
        this.#displayUsers();
    }

    async #sendUserData() {
        let errorHolder = document.getElementById('displayErrorCreateUsers');

        const email = document.getElementById("userEmail").value
        const name = document.getElementById("userName").value
        let role = document.getElementById("userRole").value
        const password = document.getElementById("userPassword").value

        role === 'admin' ? role = 1 : role = 2;

        if (email === "" || name === "" || password === "") {return errorHolder.innerHTML = "Vul alle velden in";}

        try {
            await this.#createUsers.addUser(email, name, role, password);

            this.#displayUsers();
            this.#displayUsersAmount();

            errorHolder.style.color = 'green';
            errorHolder.innerHTML = "Gebruiker is succesvol toegevoegd";
        }
        catch(error) {
            errorHolder.style.color = 'red';
            errorHolder.innerHTML = error.reason
        }
    }

    async #displayUsersAmount() {
        const users = await this.#createUsers.getUsers();
        const amount = users.length;
        const user_amount_holder = document.getElementById('amount_users');

        user_amount_holder.innerHTML = amount;
    }

    async #displayUsers() {
        const users = await this.#createUsers.getUsers();
        const users_holder_elem = document.getElementById("users")

        for (let ind in users) {
            let user = users[ind];

            let elem = document.createElement('p');

            if (ind % 2 === 0) {elem.style.backgroundColor = '#ebebeb'}

            elem.innerText = user['username'] + "\n" + user['email'];

            users_holder_elem.appendChild(elem)
        }
    }
}
