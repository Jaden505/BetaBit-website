/**
 * Responsible for creating and editing the users personal default schedule.
 * The default schedule gets repeated every week and can be changed using changeDefaultScheduleController.
 *
 * @author Jaden van Rijswijk
 */

import { Controller } from "./controller.js";
import { App } from "../app.js";

export class DefaultScheduleController extends Controller {
    #defaultScheduleView

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
        this.#defaultScheduleView = await super.loadHtmlIntoContent("html_views/defaultSchedule.html")

        // Redirect buttons
        this.#defaultScheduleView.querySelector("#currentSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_SCHEDULE));
        this.#defaultScheduleView.querySelector("#editDefaultSchedule").addEventListener("click", event => App.loadController(App.CONTROLLER_CHANGE_DEFAULT_SCHEDULE));

        this.#expandDayView()
    }

    #expandDayView() {
        const expandTab = this.#defaultScheduleView.getElementsByClassName("default-schedule-item")
        const expandableContent = this.#defaultScheduleView.getElementsByClassName("default-schedule-container-content")
        const expandIcon = this.#defaultScheduleView.getElementsByClassName("expand-img")

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
