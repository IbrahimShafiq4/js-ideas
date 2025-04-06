// ==================== DOM ELEMENTS ====================
// Cache frequently accessed DOM elements
const settingsDiv = document.querySelector('.settings'); // Settings panel container
const gearBtn = document.querySelector('.settings i');   // Settings toggle button

// ==================== SPEECH SYNTHESIS SETUP ====================
const synth = window.speechSynthesis;  // Speech synthesis API interface
let voices = [];                      // Available voices list
let selectedVoice = null;             // Currently selected voice
let currentUtterance = null;          // Current speech utterance

// ==================== COPY FUNCTIONALITY SETUP ====================
let copyIconTimeout = null;           // Timeout for copy icon auto-hide
let currentCopyIcon = null;           // Reference to current copy icon element

// ==================== UI ELEMENTS CREATION ====================
// Create voice selection dropdown
const voiceSelect = document.createElement('select');
voiceSelect.classList.add('voice-select');
settingsDiv.appendChild(voiceSelect);

// ==================== EVENT LISTENERS SETUP ====================
// Toggle settings panel visibility
gearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsDiv.classList.toggle('settings-appeared');
});

// Close settings when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsDiv.contains(e.target) && !gearBtn.contains(e.target)) {
        settingsDiv.classList.remove('settings-appeared');
    }
});

// Remove copy icon when scrolling
window.addEventListener('scroll', () => {
    removeCopyIcon();
});

// ==================== CORE FUNCTIONS ====================

/**
 * Initialize voice synthesis and populate voice dropdown
 */
function initVoices() {
    // Some browsers load voices asynchronously
    if (synth.getVoices().length > 0) {
        populateVoices();
    } else {
        // Poll for voices if not immediately available
        const voiceCheck = setInterval(() => {
            if (synth.getVoices().length > 0) {
                clearInterval(voiceCheck);
                populateVoices();
            }
        }, 100);

        // Fallback event listener
        synth.addEventListener('voiceschanged', () => {
            clearInterval(voiceCheck);
            populateVoices();
        });
    }
}

/**
 * Populate voice selection dropdown with available voices
 */
function populateVoices() {
    voices = synth.getVoices().filter(voice => voice.lang.includes('en')); // Filter for English voices
    voiceSelect.innerHTML = '';

    // Add default placeholder option
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select a voice...';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    voiceSelect.appendChild(defaultOption);

    // Add all available voices to dropdown
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `(${voice.lang})${voice.default ? ' - DEFAULT' : ''}`;
        option.value = index;
        voiceSelect.appendChild(option);

        // Auto-select default voice if available
        if (voice.default) {
            selectedVoice = voice;
            voiceSelect.selectedIndex = index + 1; // +1 accounts for default option
        }
    });

    // Update voice selection handler
    voiceSelect.addEventListener('change', handleVoiceChange);
}

/**
 * Handle voice selection change
 */
function handleVoiceChange() {
    const selectedIndex = voiceSelect.selectedIndex - 1; // Account for default option
    if (selectedIndex >= 0) {
        selectedVoice = voices[selectedIndex];
        // Immediately speak selected text with new voice if available
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            textToAudio(selectedText);
        }
    }
}

/**
 * Convert text to speech with current settings
 * @param {string} text - Text to be spoken
 */
function textToAudio(text) {
    // Clean up any existing speech
    if (synth.speaking) {
        synth.cancel();
        // Small delay to allow cleanup
        return new Promise(resolve => setTimeout(() => {
            actuallySpeak(text);
            resolve();
        }, 50));
    } else {
        actuallySpeak(text);
    }
}

/**
 * Internal function to handle speech synthesis
 * @param {string} text - Text to be spoken
 */
function actuallySpeak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    // Configure voice if selected
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // Set speech parameters
    utterance.rate = 1.0;  // Normal speed
    utterance.pitch = 1.0; // Normal pitch

    // Event handlers for speech synthesis
    utterance.onerror = (err) => {
        console.warn('Speech error:', err);
        currentUtterance = null;
    };
    utterance.onend = utterance.onboundary = () => {
        currentUtterance = null;
    };

    // Attempt to speak the text
    try {
        synth.speak(utterance);
    } catch (err) {
        console.error('Speech synthesis failed:', err);
    }
}

/**
 * Handle text selection changes with debounce
 */
function handleSelection() {
    const selectedText = window.getSelection().toString().trim();
    
    // Only proceed if we have new selected text
    if (selectedText) {
        textToAudio(selectedText);
        showCopyIcon(selectedText);
    } else {
        removeCopyIcon();
    }
}

// ==================== COPY FUNCTIONALITY ====================

/**
 * Show copy icon near selected text
 * @param {string} selectedText - Currently selected text
 */
function showCopyIcon(selectedText) {
    const selection = window.getSelection();
    
    // Clear previous timeout and remove existing icon
    clearTimeout(copyIconTimeout);
    removeCopyIcon();

    // Get position of selected text
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Create and position copy icon
    currentCopyIcon = document.createElement('div');
    currentCopyIcon.className = 'copy-icon-container';
    currentCopyIcon.innerHTML = '<i class="fa-solid fa-copy"></i>';
    currentCopyIcon.style.position = 'absolute';
    currentCopyIcon.style.left = `${rect.right + window.scrollX + 10}px`;
    currentCopyIcon.style.top = `${rect.top + window.scrollY - 5}px`;
    currentCopyIcon.title = 'Copy to clipboard';

    // Set timeout to auto-hide after 5 seconds
    copyIconTimeout = setTimeout(removeCopyIcon, 5000);

    // Add click handler for copy functionality
    currentCopyIcon.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(selectedText);
            showCopyFeedback();
            showCopyNotification('Copied!');
        } catch (err) {
            showCopyNotification('Failed to copy');
        }
    });

    document.body.appendChild(currentCopyIcon);
}

/**
 * Show visual feedback when text is copied
 */
function showCopyFeedback() {
    if (!currentCopyIcon) return;
    
    currentCopyIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => {
        if (currentCopyIcon) {
            currentCopyIcon.innerHTML = '<i class="fa-solid fa-copy"></i>';
        }
    }, 2000);
}

/**
 * Remove the copy icon from DOM
 */
function removeCopyIcon() {
    if (currentCopyIcon) {
        currentCopyIcon.remove();
        currentCopyIcon = null;
    }
    clearTimeout(copyIconTimeout);
}

/**
 * Show temporary notification message
 * @param {string} message - Notification text
 */
function showCopyNotification(message) {
    // Remove any existing notification
    const existing = document.querySelector('.copy-notification');
    if (existing) existing.remove();

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-hide after 2 seconds with fade effect
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ==================== INITIALIZATION ====================
// Set up selection change handler with debounce
let selectionDebounce;
document.addEventListener('selectionchange', () => {
    clearTimeout(selectionDebounce);
    selectionDebounce = setTimeout(handleSelection, 300);
});

// Initialize the application
initVoices();