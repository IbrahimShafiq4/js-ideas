const navElement = document.querySelector('nav');
const navbarLinks = navElement.querySelectorAll('a');

const navPosition = navElement.getBoundingClientRect().top;

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    navbarLinks.forEach(link => {
        const sectionElement = document.querySelector(link.hash);

        if (scrollPosition + 50 > sectionElement.offsetTop && scrollPosition + 50 < sectionElement.offsetHeight + sectionElement.offsetTop) {
            link.classList.add('active');
        } else {
            link.classList.remove('active')
        }
    })
})