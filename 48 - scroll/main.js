// Select the first element with the class 'text'
let textEl = document.querySelector('.text');

// Get the text content of the selected element
let textContent = textEl.textContent;

// Clear the inner HTML of the selected element
textEl.innerHTML = '';

// Initialize an empty array to hold span elements
let spans = [];

// Loop through each character in the text content
for (let char of textContent) {
    // Create a new span element
    let span = document.createElement('span');
    
    // Set the text content of the span to the current character
    span.textContent = char;
    
    // Append the span element to the selected element
    textEl.appendChild(span);
    
    // Add the span element to the spans array
    spans.push(span);
}

// Add an event listener for the 'scroll' event on the window
window.addEventListener('scroll', () => {
    // Get the current scroll distance from the top of the window
    let scrollDistance = window.scrollY;
    
    // Loop through each span element in the spans array
    spans.forEach((span, index) => {
        // If the scroll distance is greater than or equal to a certain value
        if (scrollDistance >= (index + 1) * 50) {
            // Translate the span horizontally based on its index
            span.style.transform = `translate(${index * 20}px, 0)`;
            
            // Add the 'active' class to the span
            span.classList.add('active');
        } else {
            // Translate the span to a random position within the viewport
            span.style.transform = `translate(${Math.random() * 100 - 50}vw, ${Math.random() * 100 - 50}vh)`;
            
            // Remove the 'active' class from the span
            span.classList.remove('active');
        }
    });
});

// Dispatch a 'scroll' event to the window to initialize the effect
window.dispatchEvent(new Event('scroll'));