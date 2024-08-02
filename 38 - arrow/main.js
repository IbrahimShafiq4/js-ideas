document.addEventListener('DOMContentLoaded', () => {
    let container = document.querySelector('.container');
    for (let i = 0; i < 50; i++) {
        let arrow = document.createElement('div');
        arrow.classList.add('arrow');
        arrow.style.top = `${Math.random() * 100}vh`;
        arrow.style.left = `${Math.random() * 100}vw`;
        arrow.style.setProperty('--i', Math.random().toString());
        container.appendChild(arrow);
    }

    document.body.addEventListener('mousemove', rotation);

    function rotation() {
        let arrows = document.querySelectorAll('.arrow');
        arrows.forEach((arrow) => {
            let x = (arrow.getBoundingClientRect().left) + (arrow.clientWidth / 2);
            let y = (arrow.getBoundingClientRect().top) + (arrow.clientHeight / 2);

            let radian = Math.atan2(event.pageX - x, event.pageY - y);
            let rotationDegree = (radian * (100 / Math.PI) -1) + 270;
            arrow.style.transform = `rotate(${rotationDegree}deg)`
        })
    }
});
