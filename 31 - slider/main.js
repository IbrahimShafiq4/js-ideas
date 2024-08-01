let prev = document.querySelector('.prev');
let next = document.querySelector('.next');

next.addEventListener('click', () => {
    let items = document.querySelectorAll('.item');
    document.querySelector('.box').appendChild(items[0]);
})

prev.addEventListener('click', () => {
    let items = document.querySelectorAll('.item');
    document.querySelector('.box').prepend(items[items.length - 1]);
})