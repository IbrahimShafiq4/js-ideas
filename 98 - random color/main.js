const colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
const colorsWrapper = document.querySelector('.colors-wrapper');
const generateBtn = document.querySelector('button');

generateBtn.addEventListener('click', generateColors);

function generateColors() {
    // Clear previous colors
    colorsWrapper.innerHTML = ''; 
    
    for (let i = 0; i < 20; i++) {
        let color = '';

        // Generate a 6-character hex color
        for (let j = 0; j < 6; j++) {
            color += colors[Math.floor(Math.random() * colors.length)];
        }

        // Create color container div
        let colorContainerDiv = document.createElement('div');
        colorContainerDiv.classList.add('color-container');
        colorContainerDiv.style.setProperty('--clr', `#${color}`);
        colorContainerDiv.textContent = `#${color}`;

        // Create the copy button
        let copyColorDiv = document.createElement('div');
        copyColorDiv.textContent = 'Copy';
        copyColorDiv.classList.add('copy-button');
        colorContainerDiv.appendChild(copyColorDiv);

        // Append the color container to the wrapper
        colorsWrapper.appendChild(colorContainerDiv);
    }
    copyColor();
}

// Generate initial colors
generateColors();

function copyColor() {
    document.querySelectorAll('.color-container').forEach((item) => {
        // Select the copy button
        let copyButton = item.querySelector('.copy-button');
        
        // Add click event to copy the color code
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to the parent
            let colorCode = item.firstChild.textContent;
            navigator.clipboard.writeText(colorCode);

            // Change button text to 'Copied'
            copyButton.textContent = 'Copied';

            // Revert back to 'Copy' after 2 seconds
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });

        // Change the background color when the color container is clicked
        item.addEventListener('click', () => {
            let colorCode = item.firstChild.textContent;
            document.body.style.setProperty('--bg-color', colorCode);
        });
    });
}
