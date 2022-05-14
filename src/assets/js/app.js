/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { SessionManager } from "./framework/utils/sessionManager.js"
import { LoginController } from "./controllers/loginController.js"
import { NavbarController }  from "./controllers/navbarController.js"
import { UploadController }  from "./controllers/uploadController.js"
import { DashboardController }  from "./controllers/dashboardController.js"
import { ScheduleController }  from "./controllers/scheduleController.js"
import { ChangeScheduleController }  from "./controllers/changeScheduleController.js"
import { DefaultScheduleController }  from "./controllers/defaultScheduleController.js"
import { ChangeDefaultScheduleController } from "./controllers/changeDefaultScheduleController.js";
import { IndividualMonthLeaderboardController } from "./controllers/individualMonthLeaderboardController.js";
import { createUsersController } from "./controllers/createUsersController.js";
import { DateController } from "./controllers/dateController.js";

export class App {
    //we only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    //controller identifiers, add new controllers here
    static CONTROLLER_NAVBAR = "navbar";
    static CONTROLLER_LOGIN = "login";
    static CONTROLLER_LOGOUT = "logout";
    static CONTROLLER_DASHBOARD = "dashboard";
    static CONTROLLER_UPLOAD = "upload";
    static CONTROLLER_SCHEDULE = "schedule";
    static CONTROLLER_DEFAULT_SCHEDULE = "default_schedule";
    static CONTROLLER_CHANGE_SCHEDULE = "change_schedule";
    static CONTROLLER_CHANGE_DEFAULT_SCHEDULE = "change_default_schedule";
    static CONTROLLER_INDIVIDUAL_MONTH_LEADERBOARD = "individual_month_leaderboard";
    static CONTROLLER_CREATE_USERS = "create_users";
    static CONTROLLER_DATE = "date";

    constructor() {
        //Always load the navigation
        App.loadController(App.CONTROLLER_NAVBAR);

        //Attempt to load the controller from the URL, if it fails, fall back to the welcome controller.
        App.loadControllerFromUrl(App.CONTROLLER_DASHBOARD );
    }

    /**
     * Loads a controller
     * @param name - name of controller - see static attributes for all the controller names
     * @param controllerData - data to pass from on controller to another - default empty object
     * @returns {boolean} - successful controller change
     */
    static loadController(name, controllerData = {}) {
        console.log("loadController: " + name);

        //log the data if data is being passed via controllers
        if (controllerData && Object.entries(controllerData).length !== 0) {
            console.log(controllerData);
        }

        //load right controller based on the passed name to this function
        switch (name) {
            case App.CONTROLLER_NAVBAR:
                new NavbarController();
                break;

            case App.CONTROLLER_LOGIN:
                App.setCurrentController(name);
                App.isLoggedIn(() => new DashboardController(), () => new LoginController());
                break;

            case App.CONTROLLER_LOGOUT:
                App.setCurrentController(name);
                App.handleLogout();
                break;

            case App.CONTROLLER_DASHBOARD:
                App.setCurrentController(name);
                App.isLoggedIn(() => new DashboardController(), () => new LoginController());
                break;

            case App.CONTROLLER_UPLOAD:
                App.setCurrentController(name);
                App.isLoggedIn(() => new UploadController(),() => new LoginController());
                break;

            case App.CONTROLLER_SCHEDULE:
                App.setCurrentController(name);
                App.isLoggedIn(() => new ScheduleController(),() => new LoginController());
                break;

            case App.CONTROLLER_DEFAULT_SCHEDULE:
                App.setCurrentController(name);
                App.isLoggedIn(() => new DefaultScheduleController(),() => new LoginController());
                break;

            case App.CONTROLLER_CHANGE_SCHEDULE:
                App.setCurrentController(name);
                App.isLoggedIn(() => new ChangeScheduleController(),() => new LoginController());
                break;

            case App.CONTROLLER_CHANGE_DEFAULT_SCHEDULE:
                App.setCurrentController(name);
                App.isLoggedIn(() => new ChangeDefaultScheduleController(),() => new LoginController());
                break;

            case App.CONTROLLER_DATE:
                App.isLoggedIn(() => new DateController(),() => new LoginController());
                break;

            case App.CONTROLLER_INDIVIDUAL_MONTH_LEADERBOARD:
                App.setCurrentController(name);
                App.isLoggedIn(() => new IndividualMonthLeaderboardController(),() => new LoginController());
                break;
            case App.CONTROLLER_CREATE_USERS:
                App.setCurrentController(name);
                App.isLoggedInAdmin(() => new createUsersController(),() => new LoginController());
                break;
            default:
                return false;
        }

        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    static loadControllerFromUrl(fallbackController) {
        const currentController = App.getCurrentController();

        if (currentController) {
            if (!App.loadController(currentController)) {
                App.loadController(fallbackController);
            }
        } else {
            App.loadController(fallbackController);
        }
    }

    /**
     * Looks at current URL in the browser to get current controller name
     * @returns {string}
     */
    static getCurrentController() {
        return location.hash.slice(1);
    }

    /**
     * Sets current controller name in URL of the browser
     * @param name
     */
    static setCurrentController(name) {
        location.hash = name;
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */
    static isLoggedIn(whenYes, whenNo) {
        if (App.sessionManager.get("email")) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * Convenience functions to handle logged-in-admin states
     * @param whenYes - function when user is logged in admin
     * @param whenNo - function when user isn't
     */
    static isLoggedInAdmin(whenYes, whenNo) {
        if (App.sessionManager.get("email") && App.sessionManager.get("role") === 1) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * Removes username via sessionManager and loads the login screen
     */
    static handleLogout() {
        App.sessionManager.remove("email", "username", "role");

        //go to login screen
        App.loadController(App.CONTROLLER_LOGIN);
        location.reload();
    }
}

//When the DOM is ready, kick off our application.
window.addEventListener("DOMContentLoaded", _ => {
    new App();
});