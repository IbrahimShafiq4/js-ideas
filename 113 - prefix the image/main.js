// Select the first <img> element from the document to update its source later
const imgElement = document.querySelector('img');

// Define the main image URL and a fallback URL in case the main image fails to load
const imageUrl = 'https://www.publicdomainpictures.net/pictures/330000/velka/flag-of-palestine-gaza-strip-flag-themes-idea-design-1587109705dWI.jpg';
const fallbackImage = 'https://as2.ftcdn.net/v2/jpg/04/55/98/73/1000_F_455987396_XOaFhBVO8dl86tGVVrncrivScGadXqI8.jpg';

/**
 * Asynchronously validates the provided image URL.
 *
 * @param {string} url - The URL of the image to validate.
 * @param {string} defaultImage - The fallback image URL to use if validation fails.
 * @param {number} timeout - The maximum time in milliseconds to wait for the image to load (default is 5000 ms).
 * @returns {Promise<string>} - A promise that resolves to either the valid image URL or the default image URL.
 */
async function validateImage(url, defaultImage, timeout = 5000) {
    // Immediately return the default image if no URL is provided
    if (!url) return defaultImage;

    // Return a new Promise to handle asynchronous image loading
    return new Promise((resolve) => {
        // Create a new Image object to test the URL
        const testImage = new Image();

        // Create an AbortController to allow us to abort the image loading if it takes too long
        const controller = new AbortController();
        const signal = controller.signal; // Retrieve the abort signal from the controller

        // Set a timer to abort the image load if it exceeds the specified timeout
        const timer = setTimeout(() => {
            controller.abort();       // Abort the image load
            resolve(defaultImage);    // Resolve the promise with the fallback image URL
        }, timeout);

        // When the image successfully loads, clear the timer and resolve with the original URL
        testImage.onload = () => {
            clearTimeout(timer); // Clear the timeout as the image loaded in time
            resolve(url);        // Resolve the promise with the valid image URL
        };

        // If an error occurs while loading the image, clear the timer and resolve with the fallback URL
        testImage.onerror = () => {
            clearTimeout(timer); // Clear the timeout due to an error
            resolve(defaultImage); // Resolve the promise with the fallback image URL
        };

        // Begin loading the image by setting its source to the provided URL
        testImage.src = url;

        // Attach an event listener for the abort signal; if aborted, cancel the image load
        signal.addEventListener('abort', () => {
            testImage.src = ''; // Cancel image loading by clearing the src
        });
    });
}

// Use an Immediately Invoked Function Expression (IIFE) to call the async function at the top level
(async () => {
    // Await the result of the image validation: either the original or fallback image URL
    const validatedImage = await validateImage(imageUrl, fallbackImage);
    // Set the source of the image element to the validated image URL
    imgElement.src = validatedImage;
})();
