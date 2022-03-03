/**
 * Base controller with helper functions, mostly to load html into a given container
 *
 * @author Pim Meijer
 */
export class Controller {
    //# is a private field in Javascript
    #contentViewHtml
    #navigationViewHtml

    constructor() {
        //within the templateContent the HTML will be loaded
        this.#contentViewHtml = document.querySelector(".content");
        this.#navigationViewHtml = document.querySelector(".navigation");
    }

    /**
     * Load an html file specifically into .navigation of index.html
     * @param htmlFile - path to html file
     * @returns {Promise<*>}
     */
    async loadHtmlIntoNavigation(htmlFile) {
        return await this.#fetchHtmlView(htmlFile, true)

    }

    /**
     * Load an html file specifically into .content of index.html
     * @param htmlFile - path to html file
     * @returns {Promise<*>}
     */
    async loadHtmlIntoContent(htmlFile) {
        return await this.#fetchHtmlView(htmlFile, false)
    }

    /**
     * Load an html file into custom given DOM element
     * @param htmlFile - path to html file
     * @param element - DOM element to load the content of file into
     * @returns {Promise<*>}
     */
    async loadHtmlIntoCustomElement(htmlFile, element) {
        return await this.#fetchHtmlView(htmlFile, false, element)
    }

    /**
     * Private helper function to load HTML, children can simply call super.fetchHtmlView and pass the path of the HTML file
     * HTML will be loaded into .content of the index.html
     * @param htmlFile - path to html file
     * @param loadIntoNavigation - whether the passed html file should be loaded into the .navigation div instead of .content
     * @param customElement - DOM element to load HTML file into, optional param
     * @returns {Promise<void>}
     * @private
     */
    async #fetchHtmlView(htmlFile, loadIntoNavigation = false, customElement ) {
        let loadInto = loadIntoNavigation ? this.#navigationViewHtml : this.#contentViewHtml

        //if a HTML DOM element to load the content into is passed, load it into there and give that back
        if(customElement instanceof Element) {
            console.log("load html into custom element instead of index.html")
            loadInto = customElement
        }

        try {
            const response = await fetch(htmlFile);

            if(response.ok) {
                const htmlData = await response.text();

                //clear html and load htmlData from file
                loadInto.innerHTML = "";
                loadInto.innerHTML = htmlData;

            } else {
                console.error(response.statusText);
                loadInto.innerHTML = "<p>Failed to load HTML file</p>";
            }
        } catch(e) {
            console.error(e);
            loadInto.innerHTML = "<p>Failed to load HTML file</p>";
        }

        return loadInto
    }

    //optional getters
    getContentViewHtml() {
        return this.#contentViewHtml;
    }

    getNavigationViewHtml() {
        return this.#navigationViewHtml;
    }
}