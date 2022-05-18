/**
 * Responsible for handling the actions happening on monthLeaderboard views
 *
 */

import {Controller} from "./controller.js";

export class DateController extends Controller {
    today

    constructor() {
        super();

        this.today = new Date;
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
            const countDate = getNextDayOfTheWeek("Sunday", false);
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

        countdown();
        setInterval(countdown, second);
    }
}