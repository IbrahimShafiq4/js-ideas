const scrollIndicator = document.querySelector('div');

document.addEventListener('scroll', (e) => {
    scrollIndicator.style.width = `${Math.floor((window.scrollY / 10) / 4.1)}%`
})