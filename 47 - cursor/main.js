// Select all elements with the class 'box' and store them in a NodeList called 'boxes'
let boxes = document.querySelectorAll('.box');

// Iterate over each 'box' element in the NodeList
boxes.forEach((box) => {
    // Add an event listener for the 'mousemove' event on each 'box' element
    box.onmousemove = function (e) {
        // Get the position and dimensions of the 'box' element relative to the viewport
        let rect = box.getBoundingClientRect();
        // Calculate the X coordinate of the mouse cursor relative to the 'box' element
        let x = e.clientX - rect.left;
        // Calculate the Y coordinate of the mouse cursor relative to the 'box' element
        let y = e.clientY - rect.top;
        // Set the CSS custom property '--x' on the 'box' element with the calculated X coordinate
        box.style.setProperty('--x', `${x}px`);
        // Set the CSS custom property '--y' on the 'box' element with the calculated Y coordinate
        box.style.setProperty('--y', `${y}px`);
    }
});
