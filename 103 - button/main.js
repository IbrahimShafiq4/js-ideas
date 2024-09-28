document.querySelector('button').addEventListener('click', () => {
    document.querySelector('button').classList.toggle('activatedBtn');
})

document.querySelector('button').addEventListener('dblclick', () => {
    document.querySelector('button').style.removeProperty('--width');
})