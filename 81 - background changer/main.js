const numbers = document.querySelector('.numbers');
const numStr = numbers.textContent;

const splittedNum = numStr.split("");
numbers.textContent = '';

for (let i = 0; i < splittedNum.length; i++) {
    numbers.innerHTML+= `<span>${splittedNum[i]}</span>`
}