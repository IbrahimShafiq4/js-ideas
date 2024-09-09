const checkboxInput = document.querySelector('input');
const circleDiv = document.querySelector('.circle');
checkboxInput.addEventListener('click', () => {
    circleDiv.classList.toggle('active-circle');
    document.body.classList.toggle('dark-mode');
})