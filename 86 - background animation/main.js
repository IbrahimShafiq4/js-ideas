let section = document.querySelector('section');

for (let i = 0; i < 300; i++) {
    let div = document.createElement('div')
    section.appendChild(div)
}

document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('div').forEach((item) => {
        let x = (item.offsetLeft) - e.pageX;
        let y = (item.offsetTop) - e.pageY;
        
        let distenation = Math.sqrt(x * x + y * y);

        item.style.transform = `rotate(${distenation / 2}deg)`
    })
})