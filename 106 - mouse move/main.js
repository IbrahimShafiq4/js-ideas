const box = document.querySelector('.box');
box.addEventListener('mousemove', (e) => {
    let x = e.pageX - box.offsetLeft;
    let y = e.pageY - box.offsetTop;

    document.querySelector('span').style.left = x + 'px';
    document.querySelector('span').style.top = y + 'px';
})