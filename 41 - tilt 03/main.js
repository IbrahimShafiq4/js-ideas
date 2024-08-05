let ulList = document.querySelectorAll('ul li');
let body = document.body;

ulList.forEach((el) => {
    el.addEventListener('mouseenter', (e) => {
        let color = e.target.style.getPropertyValue('--clr');
        body.style.background = color;
    })

    el.addEventListener('mouseleave', () => {
        body.style.background = '#fff'
    })
})

VanillaTilt.init(document.querySelectorAll("ul li a"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.7
});