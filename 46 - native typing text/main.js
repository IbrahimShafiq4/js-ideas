const typedText = document.querySelector('.typed-text');
const cursor = document.querySelector('.cursor');

const words = ['Awesome❤️', 'Fun', 'Weird', 'Famous'];
const typingDelay = 200;
const erasingDelay = 200;
const newLetterDelay = 2000;

let index = 0;
let charIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    if (words.length) {
        setTimeout(type, typingDelay)
    }
})

function type() {
    if (charIndex < words[index].length) {
        typedText.innerHTML += words[index].charAt(charIndex)
        charIndex++;
        setTimeout(type, typingDelay)
    } else {
        setTimeout(erasing, erasingDelay)
    }
}

function erasing() {
    if (charIndex > 0) {
        typedText.innerHTML = words[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erasing, erasingDelay)
    } else {
        index++;
        if (index >= words.length) {
            index = 0;
        }
        setTimeout(type, typingDelay + 1100)
    }
}