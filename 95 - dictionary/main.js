const darkModeLabel = document.querySelector('label');
const circle = document.querySelector('.circle');
const definationInput = document.querySelector('.defination-input');
const definationBtn = document.querySelector('.defination-btn');
const definationText = document.querySelector('.defination');
const usBtn = document.querySelector('.us-accent');
const ukBtn = document.querySelector('.uk-accent');
const ukAudio = document.querySelector('.uk-audio');
const usAudio = document.querySelector('.us-audio');

// Toggle dark mode
darkModeLabel.addEventListener('click', () => {
    circle.classList.toggle('active-circle');
    darkModeLabel.classList.toggle('active-label');
    document.body.classList.toggle('dark');
});

// Initially disable the audio buttons
usBtn.setAttribute('disabled', true);
ukBtn.setAttribute('disabled', true);

// Fetch the definition and audio files on button click
definationBtn.addEventListener('click', () => {
    getDefination();
});

async function getDefination() {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${definationInput.value}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const definition = data[0]['meanings'][0]['definitions'][0]['definition'];
        const usAudioSrc = data[0]['phonetics'][0]['audio'];
        const ukAudioSrc = data[0]['phonetics'][1]['audio'];

        // Update the definition text
        definationText.textContent = definition;

        // Handle US audio
        if (usAudioSrc) {
            usAudio.setAttribute('src', usAudioSrc);
            usBtn.removeAttribute('disabled'); // Enable if audio available
        } else {
            usAudio.removeAttribute('src'); // Clear any previous source
            usBtn.setAttribute('disabled', true); // Disable if no audio available
        }

        // Handle UK audio
        if (ukAudioSrc) {
            ukAudio.setAttribute('src', ukAudioSrc);
            ukBtn.removeAttribute('disabled'); // Enable if audio available
        } else {
            ukAudio.removeAttribute('src'); // Clear any previous source
            ukBtn.setAttribute('disabled', true); // Disable if no audio available
        }

    } catch (error) {
        alert(`Error fetching the definition: ${error}`);
    }
}

// Play US audio
usBtn.addEventListener('click', () => {
    usAudio.play();
});

// Play UK audio
ukBtn.addEventListener('click', () => {
    ukAudio.play();
});