/**
 * Responsible for uploading files
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {Controller} from "./controller.js";
import {NetworkManager} from "../framework/utils/networkManager.js";

export class UploadController extends Controller {
    #uploadView
    #networkManager

    constructor() {
        super();
        this.#networkManager = new NetworkManager();
        this.#setupView()
    }

    /**
     * Loads contents of desired HTML file into the index.html .main div
     * @returns {Promise<void>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#uploadView = await super.loadHtmlIntoContent("html_views/upload.html")

        //from here we can safely get elements from the view via the right getter
        this.#uploadView.querySelector(".upload").addEventListener("click", async (event) => {
            event.preventDefault()

            const fileInput = this.#uploadView.querySelector("#sampleFile");

            //TODO: you should add validation to check if an actual file is selected
            const file = fileInput.files[0];
            const formData = new FormData()

            //set "sampleFile" as key, we read this key in de back-end
            formData.append("sampleFile", file)

            try {
                const repsonse = await this.#networkManager.doFileRequest("/upload", "POST", formData);
                console.log(repsonse);

                //here we know file upload is successful, otherwise would've triggered catch
                fileInput.value = "";

            } catch (e) {
                console.error(e);
            }
        });
    }
}