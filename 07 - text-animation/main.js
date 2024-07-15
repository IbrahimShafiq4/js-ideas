const text = document.querySelector('.second-txt');
const textLoad = () => {
    setTimeout(() => {
        text.textContent = "Freelancer";
    }, 0);
    setTimeout(() => {
        text.textContent = "Developer"
    }, 4000);
    setTimeout(() => {
        text.textContent = "Designer"
    }, 8000);
}

textLoad();
setInterval(textLoad, 12000)