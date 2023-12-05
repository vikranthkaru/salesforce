import { LightningElement } from 'lwc';

export default class FlipFlopTimer extends LightningElement {
    newSeconds; newMinutes; newHours;
    showHours = false; showMinutes = false; showSeconds = false;
    connectedCallback() {
        this.func_GetData();
    }

    async func_GetData() {

        this.setTimeInterval = setInterval(() => {
            let date = new Date();
            let hours; let minutes; let seconds;
            seconds = date.getSeconds().toString();
            if (seconds.length == 1) {
                seconds = "0" + seconds;
            }
            minutes = date.getMinutes().toString();
            if (minutes.length == 1) {
                minutes = "0" + minutes;
            }
            hours = date.getHours();
            if (hours > 12) {
                hours = hours - 12;
            }
            if (hours == 0) {
                hours = 12;
            }
            hours = hours.toString();
            if (hours.length == 1) {
                hours = "0" + hours;
            }

            let myhour = this.template.querySelectorAll('.clock .flipper:nth-child(1) div:not(.new) .text');
            let myminute = this.template.querySelectorAll('.clock .flipper:nth-child(2) div:not(.new) .text');
            let mysecond = this.template.querySelectorAll('.clock .flipper:nth-child(3) div:not(.new) .text');
            const flipperElements = this.template.querySelectorAll('.flipper');
            flipperElements.forEach(element => {
                element.classList.remove('flipping');
            });
            //this.showSeconds = false; this.showHours = false; this.showMinutes = false;
            if (myhour.length > 0) {
                if (myhour[0].textContent !== hours) {
                    // Find the closest flipper element and call a function
                    this.newHours = hours;
                    const flipper = myhour[0].closest('.flipper');
                    if (flipper) {
                        this.func_flipNumber(flipper, hours, 'hours');
                    }
                }
            }

            if (myminute.length > 0) {
                if (myminute[0].textContent !== minutes) {
                    // Find the closest flipper element and call a function
                    this.newMinutes = minutes;
                    const flipper = myminute[0].closest('.flipper');
                    if (flipper) {
                        this.func_flipNumber(flipper, minutes, 'minutes');
                    }
                }
            }
            if (mysecond.length > 0) {
                if (mysecond[0].textContent !== seconds) {
                    // Find the closest flipper element and call a function
                    const flipper = mysecond[0].closest('.flipper');
                    if (flipper) {
                        this.func_flipNumber(flipper, seconds, 'seconds');
                    }
                }
            }

        }, 300);
    }

    func_flipNumber(el, newnumber, typeparam) {
        // Find elements matching .top and .bottom
        const topElements = el.querySelectorAll('.top');
        const bottomElements = el.querySelectorAll('.bottom');
        // Clone the elements and add the 'new' class
        topElements.forEach((topElement) => {
            if (typeparam === 'seconds') {
                this.showSeconds = true;
                let secondstop = this.template.querySelector('.secondstop');
                secondstop.classList.add('new');
            }
            if (typeparam === 'minutes') {
                this.showMinutes = true;
                let minutestop = this.template.querySelector('.minutestop');
                minutestop.classList.add('new');
            }
            if (typeparam === 'hours') {
                this.showHours = true;
                let hourstop = this.template.querySelector('.hourstop');
                hourstop.classList.add('new');
            }

        });

        bottomElements.forEach((bottomElement) => {
            if (typeparam === 'seconds') {
                this.showSeconds = true;
                let secondsbottom = this.template.querySelector('.secondsbottom');
                secondsbottom.classList.add('new');
                // secondsbottom.textContent = newnumber;
            }
            if (typeparam === 'minutes') {
                this.showMinutes = true;
                let minutesbottom = this.template.querySelector('.minutesbottom');
                minutesbottom.classList.add('new');
            }
            if (typeparam === 'hours') {
                this.showHours = true;
                let hoursbottom = this.template.querySelector('.hoursbottom');
                hoursbottom.classList.add('new');
            }
        });
        el.classList.add('flipping');
        const nonNewTopElements = el.querySelectorAll('.top:not(.new) .text');
        nonNewTopElements.forEach((textElement) => {
            // textElement.classList.add('topnew');
            textElement.textContent = newnumber;
            if (typeparam === 'seconds') {
                this.newSeconds = newnumber;
            }
            //  setTimeout(function () {
            const nonNewBottomElements = el.querySelectorAll('.bottom:not(.new) .text');
            nonNewBottomElements.forEach((textElement) => {
                // textElement.classList.add('bottomnew');
                textElement.textContent = newnumber;
            });
            //   }, 500);

        });

    }


}