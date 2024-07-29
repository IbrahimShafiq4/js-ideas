document.addEventListener('DOMContentLoaded', () => {
    let cube = document.querySelector('.cube');
    let grids = document.querySelectorAll('.grid');

    grids.forEach(grid => {
        for (let i = 0; i < 100; i++) {
            let span = document.createElement('span');
            grid.appendChild(span);
        }
    });

    function addRandomActiveClass() {
        grids.forEach((grid) => {
            let spans = grid.querySelectorAll('span');

            let randomIndex = Math.floor(Math.random() * spans.length);
            let randomSpan = spans[randomIndex];
            
            randomSpan.classList.add(randomIndex % 2 === 0 ? 'active-even' : 'active-odd');
            
            let removeTime = Math.floor(Math.random() * 1000) + 500;
            
            setTimeout(() => {
                randomSpan.classList.remove('active-even');
                randomSpan.classList.remove('active-odd');
            }, removeTime);
        });
    }

    function randomInterval() {
        let interval = Math.floor(Math.random() * 200) + 100;
        addRandomActiveClass();
        setTimeout(randomInterval, interval);
    }

    randomInterval();

    document.addEventListener('mousemove', (e) => {
        let x = e.clientX / window.innerWidth - 0.5;
        let y = e.clientY / window.innerHeight - 0.5;
        cube.style.transform = `rotateX(${y * 360}deg) rotateY(${x * 360}deg)`;
    });
});
