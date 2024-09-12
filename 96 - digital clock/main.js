const hours = document.getElementById('hours');
const hoursText = document.querySelector('#hours + .text');
const minutes = document.getElementById('minutes');
const minutesText = document.querySelector('#minutes + .text');
const seconds = document.getElementById('seconds');
const secondsText = document.querySelector('#seconds + .text');
const ampm = document.querySelector('#ampm');

function getTime() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    if (h > 12) {
        h = h - 12;
        ampm.textContent = `PM`;
    } else {
        ampm.textContent = `AM`;
    }

    h >= 10 ? hours.textContent = h : hours.textContent = `0${h}`;

    m >= 10 ? minutes.textContent = m : minutes.textContent = `0${m}`;

    s >= 10 ? seconds.textContent = s : seconds.textContent = `0${s}`
}

setInterval(() => {
    getTime()
}, 1000)