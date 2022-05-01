/**
 * Responsible for handling the actions happening on the navigation
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { App } from "../app.js";
import {Controller} from "./controller.js";

export class NavbarController extends Controller{
    #navbarView
    #prevController

    constructor() {
        super();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .navigation div
     * @returns {Promise<void>}
     * @memberOf NavbarController
     * @name setupView
     * @function
     * @private
     * @instance
     */
    async #setupView() {
        //await for when HTML is
        this.#navbarView = await super.loadHtmlIntoNavigation("html_views/navbar.html")

        //from here we can safely get elements from the view via the right getter
        const anchors = this.#navbarView.querySelectorAll("a.nav-link");

        //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))

        this.#removeLoginOrLogout();
        this.#adminTabsNavbar();
    }

    /**
     * Removes logout from nav when not logged in.
     * Removes login from nac when logged in.
     * @author Dia Fortmeier
     * @memberOf NavbarController
     * @name removeLoginOrLogout
     * @method
     * @private
     * @instance
     */
    #removeLoginOrLogout() {
        const navLogin = this.#navbarView.querySelector("#nav-login");
        const navLogout = this.#navbarView.querySelector("#nav-logout");

        function loggedIn() {
            navLogin.style.display = "none";
            navLogout.style.display = "block";
        }

        function loggedOut() {
            navLogout.style.display = "none";
            navLogin.style.display = "block";
        }

        App.isLoggedIn(() => loggedIn(), () => loggedOut());
    }

    #adminTabsNavbar() {
        const navCreateUsers = this.#navbarView.querySelector("#nav_create_users");

        function loggedInAdmin() {
            navCreateUsers.style.display = "block";
        }

        function loggedOutNoAdmin() {
            navCreateUsers.style.display = "none";
        }

        App.isLoggedInAdmin(() => loggedInAdmin(), () => loggedOutNoAdmin())
    }

    /**
     * Reads data attribute on each .nav-link and then when clicked navigates to specific controller
     * @param event - clicked anchor event
     * @returns {boolean} - to prevent reloading
     * @author Jaden Rijswijk
     * @memberOf NavbarController
     * @name handleClickNavigationItem
     * @method
     * @private
     * @instance
     */
    #handleClickNavigationItem(event) {
        //Get the data-controller from the clicked element (this)
        const clickedAnchor = event.target;
        const controller = clickedAnchor.dataset.controller;

       // Highlights current page in navbar
        if (this.#prevController != null) {this.#prevController.parentElement.classList.remove("active")}
        this.#prevController = clickedAnchor;

        if(typeof controller === "undefined") {
            console.error("No data-controller attribute defined in anchor HTML tag, don't know which controller to load!")
            return false;
        }

        clickedAnchor.parentElement.classList.add("active")

        //Pass the action to a new function for further processing
        App.loadController(controller);

        //Return false to prevent reloading the page
        return false;
    }
}
