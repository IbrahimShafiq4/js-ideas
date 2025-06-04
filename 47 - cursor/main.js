let boxes = document.querySelectorAll('.box');

boxes.forEach((box) => {
    box.onmousemove = function (e) {
        let rect = box.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        box.style.setProperty('--x', `${x}px`);
        box.style.setProperty('--y', `${y}px`);
    }
});
