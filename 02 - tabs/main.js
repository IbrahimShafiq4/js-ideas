// Select all elements with the class 'tab_btn' and store them in the 'tabs' variable
const tabs = document.querySelectorAll('.tab_btn');

// Select all elements with the class 'content' and store them in the 'all_content' variable
const all_content = document.querySelectorAll('.content');

// Iterate over each tab element and attach a click event listener
tabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
        // When a tab is clicked, remove the 'active' class from all tabs
        removeActiveClass();
        // Add the 'active' class to the clicked tab
        tab.classList.add('active');
        // Adjust the width and position of the line element based on the clicked tab
        lineWidth(e);
        // Remove the 'active' class from all content elements
        displayAllContent();
        // Add the 'active' class to the content element that corresponds to the clicked tab
        showContent(index);
    });
});

// Function to remove the 'active' class from all tabs
function removeActiveClass() {
    tabs.forEach((tab) => {
        tab.classList.remove('active');
    });
}

// Function to adjust the width and position of the line element based on the clicked tab
function lineWidth(e) {
    let line = document.querySelector('.line');
    line.style.width = e.target.offsetWidth + 'px';
    line.style.left = e.target.offsetLeft + 'px';
}

// Function to remove the 'active' class from all content elements
function displayAllContent() {
    all_content.forEach((content) => content.classList.remove('active'));
}

// Function to add the 'active' class to the content element that corresponds to the clicked tab
function showContent(index) {
    all_content[index].classList.add('active');
}
