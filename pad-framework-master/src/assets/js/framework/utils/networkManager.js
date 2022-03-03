/**
 * Implementation of a network manager that does a Fetch request to specified route
 *
 * @author Lennard Fonteijn & Pim Meijer
 */
export class NetworkManager {
    /**
     * Does an AJAX request to server(NodeJS)
     * @param route - for example /users/login
     * @param data - for example {username: "test", password: "test}
     * @param method - POST or GET are supported for now, feel free to expand with other http verbs
     * @returns {Promise<any>}
     */
    async doRequest(route, method, data = {},) {
        const url = baseUrl + route

        let response;
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            };

            //if there is data passed add it do the fetch request's body(usually this is for a POST request)
            let json = "<none>";
            if (Object.entries(data).length !== 0) {
                json = JSON.stringify(data);
                options.body = json;
            }

            console.log(`Doing ${method} request to ${url}\n Sent JSON: ${json}`);

            response = await fetch(url, options);

            if (!response.ok) {
                const jsonErrResponse = await response.json();
                let errorMsg = response.statusText;

                //check if key reason exists(we define this key in back-end), it contains error reasons from back-end
                if ("reason" in jsonErrResponse) {
                    errorMsg = jsonErrResponse.reason;
                }

                return this.#onFail(response.status, errorMsg);
            }

            return await response.json();
        } catch (e) {
            let code = 1000;

            //get errorcode from fetch object if it exists
            if (typeof response !== "undefined") {
                code = response.status;
                e = response.statusText;
            }
            return this.#onFail(code, e)
        }
    }

    /**
     *
     * @param route - for example /upload
     * @param method - POST or GET are supported for now, feel free to expand with other http verbs
     * @param formData - should be instanceof FormData
     * @returns {Promise<any>}
     */
    async doFileRequest(route, method, formData) {
        const url = baseUrl + route

        if(!formData instanceof FormData) {
            console.log("Warning: you are doing a file request but data passed is not of type FormData")
        }

        console.log(`Doing file upload request(${method}) to ${url}\n`);
        let response;

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                const jsonErrResponse = await response.json();
                let errorMsg = response.statusText;

                //check if key reason exists(we define this key in back-end), it contains error reasons from back-end
                if ("reason" in jsonErrResponse) {
                    errorMsg = jsonErrResponse.reason;
                }

                return this.#onFail(response.status, errorMsg);
            }

            return await response.json();
        } catch (e) {
            let code = 1000;

            //get errorcode from fetch object if it exists
            if (typeof response !== "undefined") {
                code = response.status;
                e = response.statusText;
            }
            return this.#onFail(code, e)
        }
    }

    /**
     * generic fail handler which is always executed, add more specific error handling in controller
     * @private
     * @param errorCode - code from server or 1000 when this is not sent back
     * @param error - message with error status
     */
    #onFail(errorCode, error) {
        if (errorCode === 1000 && error === null) {
            //1. request did not arrive at server, error in client side code
            //2. server cant process request and can't give back valid json
            error = "Request did not arrive at server or no valid json response received from server. \n " +
                "Check Terminal in IntelliJ for server errors as well";
        }

        console.error(`Error with response code: ${errorCode} and message: ${JSON.stringify(error)}`)

        return Promise.reject({code: errorCode, reason: error});
    }


    /**
     * Helper method to see if valid JSON response came back from server
     * @param json
     * @returns {boolean} - valid json or not
     */
    #canParseJson(json) {
        try {
            JSON.parse(json);
        } catch (e) {
            return false;
        }
        return true;
    }
}