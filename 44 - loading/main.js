document.addEventListener('DOMContentLoaded', () => {
    let container = document.querySelector('.container');
    let cardGlass = document.querySelector('.card-glass');
    let paragraph = document.querySelector('p');

    for(let j = 0; j < 4; j++) {
        let loader = document.createElement('div');
        loader.classList.add('loader');
        loader.style.setProperty('--j', j);

        for (let i = 1; i <= 20; i++) {
            let span = document.createElement('span');
            span.style.setProperty('--i', i);

            loader.appendChild(span);
        }
        container.appendChild(loader);
    }

    document.addEventListener('mousemove', (e) => {
        if (cardGlass) {
            let x = e.pageX;
            let y = e.pageY;
            cardGlass.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    if (paragraph) {
        paragraph.addEventListener('mouseenter', (e) => {
            console.log('hello');
            paragraph.classList.add('active');
        });
        
        paragraph.addEventListener('mouseleave', (e) => {
            console.log('hello');
            paragraph.classList.remove('active');
        });
    }
});
