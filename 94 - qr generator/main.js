const qrButton = document.querySelector('button');
const qrImage = document.querySelector('img');
const qrInput = document.querySelector('input');

qrButton.addEventListener('click', () => {
    if (!qrInput.value) {
        alert('please Enter A Valid data');
        return;
    } else {
        qrImage.setAttribute('alt', qrInput.value);
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrInput.value}`
    }
})