/* 
    To generate a random integer within a specific range, 
    you can use Math.random() in combination with Math.floor() or Math.ceil().

*/

let serial = document.querySelector('.serial');
let btn = document.querySelector('.generate');
let input = document.querySelector('input');

btn.addEventListener('click', () => {
    let inputValue = parseInt(input.value) || 10;
    let characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomSerial = "";

    for (let i = 0; i < inputValue; i++) {
        randomSerial += characters[Math.floor(Math.random() * characters.length)];
    }

    serial.innerHTML = randomSerial;
})

// Random Integer within a Range
// Example: Random Integer between min (inclusive) and max (exclusive)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

console.log(getRandomInt(1, 10));

// Example: Random Integer between min (inclusive) and max (inclusive)
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomValue = Math.random();
    const result = Math.floor(randomValue * (max - min + 1) + min);
    const combination = 
        `Math.random Value = ${randomValue}, ` +
        `Range Value (max - min + 1) = ${(max - min + 1)}, + min ${min} ` +
        `Result = ${result}`;
    return combination;
}

console.log(getRandomIntInclusive(1, 10));

function generateRandomString(length) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

console.log(generateRandomString(10));
