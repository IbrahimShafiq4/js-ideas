let textEl = document.querySelector('.text');
let textContentData = textEl.textContent;
textEl.innerHTML = '';

for (let char of textContentData) {
    let span = document.createElement('span');
    span.textContent = char;
    textEl.appendChild(span);
}

let spans = document.querySelectorAll('span');
window.addEventListener('scroll', (e) => {
    let scrollPosition = window.scrollY;
    spans.forEach((span, index) => {
        if (scrollPosition >= (index + 1) * 10) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    })
})