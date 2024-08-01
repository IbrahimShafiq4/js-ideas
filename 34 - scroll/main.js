let box = document.querySelector('.box');

function moveNext() {
    let item = document.querySelectorAll('.item');
    box.appendChild(item[0]);
}

function movePrev() {
    let item = document.querySelectorAll('.item');
    box.prepend(item[item.length - 1])
}

window.addEventListener('wheel', (e) => {
    e.deltaY > 0 ? moveNext() : movePrev()
})