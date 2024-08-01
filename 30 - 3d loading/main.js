let text = document.querySelector('.text');

for(let i = 0; i <= 24; i++) {
    let span = document.createElement('span');
    span.innerHTML = `<b>LOADING</b>3D`;
    span.style.setProperty('--i', i);
    text.appendChild(span);
}