const body = document.body;
const mouse = document.querySelector('.mouse');

window.addEventListener('mousemove', (e) => {
    mouse.style.left = `${e.clientX}px`;
    mouse.style.top = `${e.clientY}px`;
})

body.addEventListener('dblclick', () => {
    body.classList.remove('active-body')
})

body.addEventListener('click', () => {
    body.classList.add('active-body')
})