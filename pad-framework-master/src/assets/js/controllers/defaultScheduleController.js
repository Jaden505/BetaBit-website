/**
 * Responsible for creating and editing the users personal default schedule.
 * The default schedule gets repeated every week and can be changed using changeScheduleController.
 *
 * @author Jaden van Rijswijk
 */

import {Controller} from "./controller.js";

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

        this.#expandDayView()
    }

    #expandDayView() {
        const expandTab = this.#defaultScheduleView.getElementsByClassName("default-schedule-item")
        const expandableContent = this.#defaultScheduleView.getElementsByClassName("default-schedule-container-content")

        for (let i = 0; i < expandTab.length; i++) {
            expandTab[i].addEventListener("click", function (){
                // this.classList.toggle("acc-active");
                expandableContent[i].classList.toggle("acc-active")
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
