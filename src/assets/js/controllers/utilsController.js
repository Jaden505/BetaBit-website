/**
 * All utils used in other files
 */

import {Controller} from "./controller.js";

export class UtilsController extends Controller {
    today;

    constructor() {
        super();

        this.today = new Date;
    }

    /**
     * Gets the current year and displays it.
     * @author Jaden van Rijswijk
     * @memberOf IndividualYearLeaderboardController
     * @name currentYear
     * @function
     * @private
     * @instance
     */
    currentYear() {
        document.querySelector('#leaderboard-year').innerText = new Date().getFullYear();
    }

    /**
     * Gets the current month and displays it.
     * @author Dia Fortmeier
     * @memberOf IndividualMonthLeaderboardController
     * @name currentMonth
     * @function
     * @private
     * @instance
     */
    currentMonth() {
        let currentMonth = this.today.toLocaleString('default', {month: 'long'});
        currentMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
        document.querySelector('#leaderboard-month').innerText = currentMonth;
    }

    beginCurrentMonth() {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

        return firstDay.toISOString().slice(0, 10);
    }

    endCurrentMonth() {
        let date = new Date();
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return lastDay.toISOString().slice(0, 10);
    }

    beginCurrentYear() {
        let date = new Date();
        let currentYear = date.getFullYear();

        return currentYear + "-1-1";
    }

    endCurrentYear() {
        let date = new Date();
        let currentYear = date.getFullYear();

        return currentYear + "-12-31";
    }


    /**
     * Counter that checks and displays how long until Monday of next week
     * @public
     * @author Dennis Bleeker
     */
    weekCounter() {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
            const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
                .indexOf(dayName.slice(0, 3).toLowerCase());
            if (dayOfWeek < 0) return;
            refDate.setHours(0, 0, 0, 0);
            refDate.setDate(refDate.getDate() + +!!excludeToday +
                (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
            return refDate;
        }

        const countdown = () => {
            this.today = new Date;
            const countDate = getNextDayOfTheWeek("Monday", false);
            const gap = countDate - this.today.getTime();

            const textDay = Math.floor(gap / day);
            const textHour = Math.floor((gap % day) / hour);
            const textMinute = Math.floor((gap % hour) / minute);
            const textSecond = Math.floor((gap % minute) / second);

            document.querySelector('.updateText #day').innerText = textDay + "d";
            document.querySelector('.updateText #hour').innerText = textHour + "u";
            document.querySelector('.updateText #minute').innerText = textMinute + "m";
            document.querySelector('.updateText #second').innerText = textSecond + "s";
        };

        // let timer = setInterval(countdown, second);
        window.onunload = function () {
            clearInterval(timer)
        } // WERKT NIET
        countdown();
        // setInterval(countdown, second);
    }
}