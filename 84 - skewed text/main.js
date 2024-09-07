document.addEventListener('mousemove', textMove)

function textMove(e) {
    this.querySelectorAll('.layer').forEach(layer => {
        let x = (window.innerWidth - e.pageX * 2) / 2;
        layer.style.transform = `translateX(${x}px)`
    });
}