const boxesContainer = document.querySelector('.boxes');
function renderBoxes() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const singleBox = document.createElement('div');
            singleBox.classList.add('box');
            singleBox.style.backgroundPosition = `-${j * 125}px -${i * 125}px`
            boxesContainer.appendChild(singleBox);
        }
    }
}
renderBoxes();