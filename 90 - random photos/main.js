const
    imageContainer = document.querySelector('.image-container'),
    button = document.querySelector('button');
let imageCounts;
button.addEventListener('click', () => {
    addNewImage();
    imageCounts = 10;
})

function addNewImage() {
    for (let i = 0; i <= imageCounts; i++) {
        let image = document.createElement('img');
        image.src = `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 2000)}`
        imageContainer.appendChild(image)
    }
}