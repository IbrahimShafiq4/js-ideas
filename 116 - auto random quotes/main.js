/**
 * Random Quote Generator Application
 * 
 * Features:
 * - Fetches quotes from a JSON file
 * - Displays random quotes on demand
 * - Auto-generate quotes at intervals
 * - Clean DOM management with centralized references
 */

// Execute only after the DOM is fully loaded to ensure all elements exist
document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // DOM ELEMENTS REFERENCE MANAGEMENT
    // =============================================
    /**
     * Centralized element selector configuration.
     * Keys represent the reference names we'll use in code.
     * Values are CSS selectors matching the HTML elements.
     * 
     * Benefits:
     * - Single source of truth for element selectors
     * - Easy maintenance if HTML structure changes
     * - Clear mapping between JS and DOM
     */
    const elementSelectors = {
        generate: '.generate',       // Manual quote generator button
        auto: '.auto',              // Auto-generation toggle button
        stop: '.stop',              // Auto-generation stop button
        quoteDisplay: '.quote-display',  // Container for quote text
        quoteId: '.quote-id',       // Container for quote ID/number
        autoStatus: '.auto-status',  // Auto-generation status indicator
        audio: '.audio' // to make the user be able to hear the quote as a voice
    };

    /**
     * DOM References Object
     * 
     * Transforms elementSelectors into live DOM references:
     * - Uses Object.entries() to get [key, selector] pairs
     * - Maps each selector to its DOM element
     * - Converts back to object with Object.fromEntries()
     * 
     * Resulting structure example:
     * {
     *   generate: <button class="generate">,
     *   auto: <button class="auto">,
     *   ...
     * }
     */
    const dom = Object.fromEntries(
        Object.entries(elementSelectors).map(([referenceName, selector]) =>
            [referenceName, document.querySelector(selector)]
        )
    );

    // =============================================
    // APPLICATION STATE MANAGEMENT
    // =============================================
    /**
     * Auto-generation interval tracker
     * 
     * Stores the interval ID when auto-generation is active:
     * - Used to clear the interval when stopping
     * - Undefined when no auto-generation is running
     * @type {number|undefined}
     */
    let autoGenerationInterval;

    /**
     * Speech synthesis controller
     * 
     * Reference to the Web Speech API's speech synthesis interface:
     * - Used for text-to-speech functionality
     * - Initialized with the browser's speechSynthesis API
     * - Provides access to speech methods like speak(), cancel(), etc.
     * @type {SpeechSynthesis}
     */
    let speechSynths = speechSynthesis;

    // =============================================
    // CORE FUNCTIONALITY
    // =============================================

    /**
     * Fetches quotes data from JSON file
     * 
     * @async
     * @returns {Promise<Array>} Resolves with array of quote objects
     * @throws {Error} If fetch request fails
     * 
     * Quote object structure:
     * {
     *   text: string,
     *   id: string
     * }
     */
    async function fetchQuotes() {
        try {
            const response = await fetch('./quotes.json');
            if (!response.ok) throw new Error('Failed to fetch quotes');
            return await response.json();
        } catch (error) {
            console.error('Quote fetch error:', error);
            dom.quoteDisplay.textContent = 'Failed to load quotes';
            return [];
        }
    }

    /**
     * Generates and displays a random quote
     * 
     * Flow:
     * 1. Fetches latest quotes
     * 2. Selects random quote using valid array index
     * 3. Updates DOM with quote content
     * 
     * @async
     */
    async function displayRandomQuote() {
        const quotes = await fetchQuotes();

        // Safeguard against empty quotes array
        if (quotes.length === 0) {
            dom.quoteDisplay.textContent = 'No quotes available';
            dom.quoteId.textContent = '';
            return;
        }

        // Generate random index (0 to length-1)
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const { text, id } = quotes[randomIndex];

        // Update DOM elements
        dom.quoteDisplay.textContent = text;
        dom.quoteId.textContent = id;
    }

    /**
     * Toggles auto-generation of quotes
     * 
     * @param {boolean} start - True to start, false to stop
     * @param {number} intervalMs - Interval between quotes (default: 2000ms)
     */
    function toggleAutoGeneration(start, intervalMs = 2000) {
        if (start) {
            // Start new interval (clearing any existing one first)
            stopAutoGeneration();
            autoGenerationInterval = setInterval(displayRandomQuote, intervalMs);
            dom.autoStatus.textContent = 'Auto: ON';
        } else {
            stopAutoGeneration();
        }
    }

    /**
     * Stops auto-generation if active
     */
    function stopAutoGeneration() {
        if (autoGenerationInterval) {
            clearInterval(autoGenerationInterval);
            autoGenerationInterval = undefined;
            dom.autoStatus.textContent = 'Auto: OFF';
        }
    }

    /**
     * Converts a quote to speech and manages auto-generation state
     * 
     * - If auto-generation is ON before speaking, it will resume after speech ends.
     * - If auto-generation is OFF, it will not start it.
     * 
     * @param {string} quote - The quote text to be spoken
     */
    function speakQuoteWithAutoHandling(quote) {
        const wasAutoRunning = dom.autoStatus.textContent === 'Auto: ON';

        // Stop auto-generation while speaking
        stopAutoGeneration();

        const utterance = new SpeechSynthesisUtterance(quote);
        speechSynths.speak(utterance);

        utterance.onend = () => {
            console.log('Speech synthesis completed');

            if (wasAutoRunning) {
                toggleAutoGeneration(true); // Resume auto-generation
            }
        };
    }


    // =============================================
    // EVENT HANDLERS
    // =============================================

    // Manual quote generation
    dom.generate.addEventListener('click', () => {
        displayRandomQuote();
        toggleAutoGeneration(false)
    });

    // Auto-generation toggle
    dom.auto.addEventListener('click', () => toggleAutoGeneration(true));

    // Auto-generation stop
    dom.stop.addEventListener('click', stopAutoGeneration);

    // Audio Controller
    dom.audio.addEventListener('click', () => {
        const quote = dom.quoteDisplay.textContent;
        speakQuoteWithAutoHandling(quote)
    })

    // =============================================
    // INITIALIZATION
    // =============================================

    // Display first quote immediately on load
    displayRandomQuote();
});
