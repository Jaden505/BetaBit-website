/**
 * Responsible for altering events in the default schedule
 *
 * @author Colin Laan
 */

import {Controller} from "./controller.js";
import { App } from "../app.js";

export class ChangeDefaultScheduleController extends Controller {
    #changeDefaultScheduleView

    constructor() {
        super();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#changeDefaultScheduleView = await super.loadHtmlIntoContent("html_views/changeDefaultSchedule.html")

        //Redirect buttons
        this.#changeDefaultScheduleView.querySelector("#defaultSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_DEFAULT_SCHEDULE));

        this.#expandDayView()
    }

    /**
     * Expands and retracts the detailed view of a day on the default schedule when the tab of it is clicked.
     */
    #expandDayView() {
        const expandTab = this.#changeDefaultScheduleView.getElementsByClassName("default-schedule-item")
        const expandableContent = this.#changeDefaultScheduleView.getElementsByClassName("default-schedule-container-content")
        const expandIcon = this.#changeDefaultScheduleView.getElementsByClassName("expand-img")

        for (let i = 0; i < expandTab.length; i++) {
            expandTab[i].addEventListener("click", function (){
                expandableContent[i].classList.toggle("acc-active")
                if (expandIcon[i].style.transform === "rotate(180deg)") {
                    expandIcon[i].style.transform = "rotate(0)"
                } else {
                    expandIcon[i].style.transform = "rotate(180deg)"
                }
                let panel = expandableContent[i];
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            })
        }
    }
}
