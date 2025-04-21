// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", () => {
    /**
     * =============================
     * DOM ELEMENTS CONFIGURATION
     * =============================
     * Centralized configuration for all DOM elements used in the slider
     * Structure:
     * - selector: CSS selector string
     * - type: 'single' for one element or 'multiple' for NodeList
     */
    const DOM_ELEMENTS = {
        slider: {
            selector: '.slider',
            type: 'single'
        },
        imageSliders: {
            selector: '.image-sliders',
            type: 'single'
        },
        cardsSlidersContent: {
            selector: '.cards-sliders-content',
            type: 'single'
        },
        imageCounter: {
            selector: '.img-id',
            type: 'single'
        },
        nextButton: {
            selector: '.next-btn',
            type: 'single'
        },
        prevButton: {
            selector: '.prev-btn',
            type: 'single'
        },
        slides: {
            selector: '.slider img',
            type: 'multiple'
        },
        galleryContainer: {
            selector: '.gallery-container',
            type: 'single'
        },
        cardsBtnTransform: {
            selector: '.cards-btn-transform',
            type: 'single'
        },
        arrowLeft: {
            selector: '.arrow-left',
            type: 'single'
        },
        arrowRight: {
            selector: '.arrow-right',
            type: 'single'
        },
        cardsSlider: {
            selector: '.cards-slider',
            type: 'single'
        },
        cards: {
            selector: '.card',
            type: 'multiple'
        }
    };

    /**
     * =============================
     * UTILITY FUNCTIONS
     * =============================
     */

    /**
     * Safely retrieves DOM elements based on configuration
     * @param {Object} config - {selector: string, type: string}
     * @returns {Element|NodeList|null} Requested DOM element(s)
     */
    const getDOMElement = ({ selector, type }) => {
        try {
            return type === 'multiple'
                ? document.querySelectorAll(selector)
                : document.querySelector(selector);
        } catch (error) {
            console.error(`Element retrieval error for "${selector}":`, error);
            return type === 'multiple' ? [] : null;
        }
    };

    // Create element references object
    const elements = Object.fromEntries(
        Object.entries(DOM_ELEMENTS).map(([key, config]) => [key, getDOMElement(config)])
    );

    /**
     * =============================
     * STATE MANAGEMENT
     * =============================
     */
    let currentSlideIndex = 0;
    let currentCardIndex = 0;
    const totalSlides = elements.slides?.length || 0;
    const totalCards = elements.cards?.length || 0;
    let isCardView = false; // Track current view mode

    /**
     * =============================
     * GALLERY MANAGEMENT
     * =============================
     */

    /**
     * Initializes the thumbnail gallery from slider images
     */
    function initializeThumbnailGallery() {
        if (!elements.galleryContainer || !elements.slides?.length) return;

        // Clear and prepare gallery container
        elements.galleryContainer.innerHTML = '';
        elements.galleryContainer.style.gridTemplateColumns = `repeat(${elements.slides.length}, 1fr)`;

        // Clone slides to create thumbnails
        elements.slides.forEach(slide => {
            const thumbnail = slide.cloneNode(true);
            elements.galleryContainer.appendChild(thumbnail);
        });

        updateActiveThumbnail();
        setupThumbnailNavigation();
    }

    /**
     * Updates the active state of thumbnails
     */
    function updateActiveThumbnail() {
        if (!elements.galleryContainer?.children?.length) return;

        Array.from(elements.galleryContainer.children).forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === currentSlideIndex);
        });
    }

    /**
     * Sets up click handlers for thumbnail navigation
     */
    function setupThumbnailNavigation() {
        Array.from(elements.galleryContainer.children).forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => navigateToSlide(index));
        });
    }

    /**
     * =============================
     * CARD SCROLLING FUNCTIONS
     * =============================
     */

    /**
     * Calculates the number of visible cards based on screen size
     * @returns {number} Number of cards that should be visible
     */
    function getVisibleCardsCount() {
        if (window.innerWidth <= 600) return 1;  // Mobile
        if (window.innerWidth <= 900) return 2;  // Tablet
        return 3;  // Desktop
    }

    /**
     * Scrolls to a specific card with smooth behavior
     * @param {number} index - Index of card to scroll to
     */
    function scrollToCard(targetIndex) {

        if (!elements.cardsSlider || !elements.cards?.length) return;

        currentCardIndex = targetIndex;
        const container = elements.cardsSlider;

        container.scrollTo({
            left: elements.cards[targetIndex].offsetLeft - container.offsetLeft,
            behavior: 'smooth'
        });

        updateCardNavigationButtons();
        updateActiveCard();
    }

    /**
     * Updates the disabled state of card navigation buttons
     */
    function updateCardNavigationButtons() {
        if (elements.arrowLeft && elements.arrowRight) {
            // Only disable left button when at start
            elements.arrowLeft.disabled = currentCardIndex === 0;

            // Only disable right button when at end
            elements.arrowRight.disabled = currentCardIndex == elements.cards.length - 1;
        }
    }

    /**
     * Updates the active card styling
     */
    function updateActiveCard() {
        if (!elements.cards?.length) return;

        elements.cards.forEach((card, index) => {
            // const isActive = index >= currentCardIndex &&
            //     index < currentCardIndex + getVisibleCardsCount();
            // card.classList.toggle('active', currentCardIndex == index);
        });
    }

    /**
     * Updates the disabled state of card navigation buttons
     */
    function updateCardNavigationButtons() {
        if (elements.arrowLeft && elements.arrowRight) {
            elements.arrowLeft.disabled = currentCardIndex === 0;
            elements.arrowRight.disabled = currentCardIndex === totalCards - 3;
        }
    }

    /**
     * =============================
     * IMAGE SLIDER FUNCTIONS
     * =============================
     */

    /**
     * Navigates to a specific slide in the image slider
     * @param {number} targetIndex - Index of slide to display
     * @returns {boolean} True if navigation succeeded
     */
    function navigateToSlide(targetIndex) {
        if (!elements.slides?.length) return false;

        // Calculate new index with wrap-around
        const newIndex = (targetIndex + totalSlides) % totalSlides;

        // Update active slide
        elements.slides[currentSlideIndex]?.classList.remove('active');
        currentSlideIndex = newIndex;
        elements.slides[currentSlideIndex]?.classList.add('active');

        updateImageCounter();
        updateSliderNavigationButtons();
        return true;
    }

    /**
     * Updates the image counter display
     */
    function updateImageCounter() {
        if (elements.imageCounter) {
            elements.imageCounter.textContent = `Image ${currentSlideIndex + 1} of ${totalSlides}`;
        }
    }

    /**
     * Updates the disabled state of slider navigation buttons
     */
    function updateSliderNavigationButtons() {
        if (elements.prevButton && elements.nextButton) {
            elements.prevButton.disabled = currentSlideIndex === 0;
            elements.nextButton.disabled = currentSlideIndex === totalSlides - 1;
        }
    }

    /**
     * =============================
     * VIEW TRANSFORMATION
     * =============================
     */

    /**
     * Toggles between image slider and card carousel views
     */
    function toggleViewMode() {
        isCardView = !isCardView;

        // Toggle visibility of views
        elements.imageSliders?.classList.toggle('hidden', isCardView);
        elements.galleryContainer?.classList.toggle('hidden', isCardView);
        elements.cardsSlidersContent?.classList.toggle('hidden', !isCardView);

        // Initialize the appropriate view
        if (isCardView) {
            scrollToCard(0);
        } else {
            navigateToSlide(0);
        }

        // Update button text
        if (elements.cardsBtnTransform) {
            elements.cardsBtnTransform.textContent = isCardView ? 'Images?' : 'Cards?';
        }
    }

    /**
     * =============================
     * EVENT HANDLERS
     * =============================
     */

    function handlePreviousButtonClick() {
        navigateToSlide(currentSlideIndex - 1);
    }

    function handleNextButtonClick() {
        navigateToSlide(currentSlideIndex + 1);
    }

    function handleArrowLeftClick() {
        if (currentCardIndex > 0) {
            scrollToCard(currentCardIndex - 1);
        }
    }

    function handleArrowRightClick() {
        const visibleCards = getVisibleCardsCount();
        if (currentCardIndex < elements.cards.length - visibleCards) {
            scrollToCard(currentCardIndex + 1);
        }
    }

    function handleKeyboardNavigation(event) {
        if (isCardView) {
            // Card view keyboard navigation
            switch (event.key.toLowerCase()) {
                case 'arrowleft':
                case 'a':
                    handleArrowLeftClick();
                    break;
                case 'arrowright':
                case 'd':
                    handleArrowRightClick();
                    break;
            }
        } else {
            // Image view keyboard navigation
            switch (event.key.toLowerCase()) {
                case 'arrowleft':
                case 'a':
                    handlePreviousButtonClick();
                    break;
                case 'arrowright':
                case 'd':
                    handleNextButtonClick();
                    break;
            }
        }
    }

    /**
     * Handles window resize events
     */
    function handleResize() {
        if (isCardView) {
            // Recalculate card positions on resize
            scrollToCard(currentCardIndex);
        }
    }

    /**
     * =============================
     * INITIALIZATION
     * =============================
     */

    function initializeSlider() {
        // Initialize both views
        if (elements.slides?.length) {
            elements.slides[currentSlideIndex].classList.add('active');
            updateSliderNavigationButtons();
            updateImageCounter();
        }

        // Initialize gallery
        if (elements.galleryContainer) {
            initializeThumbnailGallery();
        }

        // Set up event listeners
        elements.prevButton?.addEventListener('click', handlePreviousButtonClick);
        elements.nextButton?.addEventListener('click', handleNextButtonClick);
        elements.arrowLeft?.addEventListener('click', handleArrowLeftClick);
        elements.arrowRight?.addEventListener('click', handleArrowRightClick);
        elements.cardsBtnTransform?.addEventListener('click', toggleViewMode);
        document.addEventListener('keydown', handleKeyboardNavigation);
        window.addEventListener('resize', handleResize);

        // Start with image slider view
        toggleViewMode(); // This will set the initial view state
    }

    // Start the slider
    initializeSlider();
});