const nightModeContainer = document.querySelector('.night-mode');
let toggleView = false;
nightModeContainer.addEventListener('click', () => {
    toggleView = !toggleView;
    nightModeContainer.style.setProperty('--sun-active', toggleView);
    document.body.style.setProperty('--main-background', toggleView ? '#080a11' : '#d4d4d4')
});
