const tabs = document.querySelectorAll('.tab_btn');
const all_content = document.querySelectorAll('.content');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
        removeActiveClass();
        tab.classList.add('active');
        lineWidth(e);
        displayAllContent();
        showContent(index)
    });
});

function removeActiveClass() {
    tabs.forEach((tab) => {
        tab.classList.remove('active');
    });
}

function lineWidth(e) {
    let line = document.querySelector('.line');
    line.style.width = e.target.offsetWidth + 'px';
    line.style.left = e.target.offsetLeft + 'px';
}

function displayAllContent() {
    all_content.forEach((content) => content.classList.remove('active'));
}

function showContent(index) {
    all_content[index].classList.add('active');
}