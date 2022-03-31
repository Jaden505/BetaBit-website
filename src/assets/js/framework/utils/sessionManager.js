/**
 * Implementation of a simple Session Manager
 *
 * @author Lennard Fonteijn & Pim Meijer
 */
export class SessionManager {
    //# is a private field in Javascript
    #session

    constructor() {
        try {
            this.#session = JSON.parse(localStorage.getItem("session"));
        } catch (e) {
            console.error("Failed to parse JSON object out of local storage")
        }

        //create empty object in local storage if it was empty
        if(!this.#session) {
            this.#session = {};

            this.#saveSession();
        }
    }

     get(key) {
        return this.#session[key];
    }

     set(key, value) {
        this.#session[key] = value;

        this.#saveSession();
    }

     remove(key) {
        delete(this.#session[key]);

        this.#saveSession();
    }

    /**
     * Clears entire session object and saves it
     */
    clear() {
        this.#session = {};

        this.#saveSession();
    }

     #saveSession() {
        localStorage.setItem("session", JSON.stringify(this.#session));
    }

}