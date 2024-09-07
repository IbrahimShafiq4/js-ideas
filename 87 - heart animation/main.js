document.addEventListener('mousemove', (e) => {
    const xPosition = e.offsetX;
    const yPosition = e.offsetY;
    let span = document.createElement('span');
    span.style.left = `${xPosition}px`
    span.style.top = `${yPosition}px`
    const size = Math.random() * 100;
    span.style.width = `${size}px`
    span.style.height = `${size}px`
    document.body.appendChild(span);

    setTimeout(() => {
        span.remove()
    }, 3000)
})