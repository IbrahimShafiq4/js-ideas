function createCube() {
    let container = document.querySelector(".container");
    let zValues = [-3, -2, -1, 0, 1, 2, 3];

    zValues.forEach((z) => {
        let cube = document.createElement("div");
        cube.style.setProperty("--z", z);
        cube.classList.add('cube');

        for (let x = -3; x <= 3; x++) {
            let div = document.createElement("div");
            div.style.setProperty("--x", x);
            div.style.setProperty("--y", 0);
            let span = document.createElement("span");
            span.style.setProperty("--i", 3);
            div.appendChild(span);
            cube.appendChild(div);
        }
        container.appendChild(cube);
    });
}

function randomCubeActivation() {
    let spans = document.querySelectorAll('.cube span');
    setInterval(() => {
        let randomIndex = Math.floor(Math.random() * spans.length);
        let randomSpan = spans[randomIndex];

        randomSpan.classList.add('active-span');
        randomIndex % 2 == 0 ? randomSpan.classList.add('active-even-span') : randomSpan.classList.add('active-odd-span'); 

        setTimeout(() => {
            randomSpan.classList.remove('active-span');
        }, 2000)
        
    }, 500)
}
createCube()
randomCubeActivation()
