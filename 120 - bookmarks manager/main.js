// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // ==============================================
    // DOM ELEMENTS CONFIGURATION
    // ==============================================
    // Centralized configuration object for all DOM elements
    // This makes it easy to maintain and modify selectors in one place
    const DOM_ELEMENTS = {
        addTitleInput: { selector: '#title', type: 'single' },
        addUrlInput: { selector: '#url', type: 'single' },
        addCategoryInput: { selector: '#category', type: 'single' },
        addBookmarkBtn: { selector: 'form button[type="button"]', type: 'single' },
        showAllBookmarksTitle: { selector: '.all', type: 'single' },
        deleteAllBtn: { selector: '.delete-all', type: 'single' },
        sortAscBtn: { selector: '.sort-asc', type: 'single' },
        sortDescBtn: { selector: '.sort-desc', type: 'single' },
        sortAlphaBtn: { selector: '.sort-alphabetical', type: 'single' },
        sortRevAlphaBtn: { selector: '.sort-reverse-alphabetical', type: 'single' },
        sortByDateBtn: { selector: '.sort-by-date', type: 'single' },
        sortByCategoryBtn: { selector: '.sort-by-category', type: 'single' },
        sortByWebsiteBtn: { selector: '.sort-by-website', type: 'single' },
        sortByUrlBtn: { selector: '.sort-by-url', type: 'single' },
        searchByInputBtn: { selector: '.serach-by-input', type: 'single' },
        searchByBtn: { selector: '.serach-by-btn', type: 'single' },
        verticalBookmarksBtn: { selector: '.vertical-bookmarks', type: 'single' },
        horizontalBookmarksBtn: { selector: '.horizontal-bookmarks', type: 'single' },
        searchInput: { selector: '#search', type: 'single' },
        searchButton: { selector: '.search-bar button', type: 'single' },
        bookmarksContainer: { selector: '.bookmarks', type: 'single' },
        categorySuggestions: { selector: '.category-suggestions div', type: 'single' },
        categoryButtonsContainer: { selector: '.category-buttons div', type: 'single' },
    };

    // ==============================================
    // HELPER FUNCTIONS
    // ==============================================

    /**
     * Safely retrieves DOM elements with error handling
     * @param {Object} config - Element configuration {selector, type}
     * @returns {Element|NodeList|null} - The selected element(s) or null if not found
     */
    const getElement = ({ selector, type }) => {
        try {
            return type === 'single' ? document.querySelector(selector) : document.querySelectorAll(selector);
        } catch (err) {
            console.error(`Error selecting ${selector}:`, err);
            return type === 'single' ? null : [];
        }
    };

    // Create references for all DOM elements using the configuration
    const ELEMENT_REF = Object.fromEntries(
        Object.entries(DOM_ELEMENTS).map(([key, config]) => [key, getElement(config)])
    );

    // Destructure the most commonly used elements for easy access
    const {
        addTitleInput,
        addUrlInput,
        addCategoryInput,
        addBookmarkBtn,
        deleteAllBtn,
        sortAscBtn,
        sortDescBtn,
        sortAlphaBtn,
        sortRevAlphaBtn,
        sortByDateBtn,
        sortByCategoryBtn,
        sortByWebsiteBtn,
        sortByUrlBtn,
        searchByInputBtn,
        searchByBtn,
        verticalBookmarksBtn,
        horizontalBookmarksBtn,
        searchInput,
        searchButton,
        bookmarksContainer,
        categorySuggestions,
        categoryButtonsContainer,
    } = ELEMENT_REF;

    // Set default view to horizontal
    bookmarksContainer.classList.add('horizontal');

    // ==============================================
    // INITIALIZATION
    // ==============================================
    displayBookmarks();

    // ==============================================
    // EVENT LISTENERS
    // ==============================================

    // Main bookmark interaction
    addBookmarkBtn.addEventListener('click', addBookmark);
    deleteAllBtn.addEventListener('click', deleteAllBookmarks);
    
    // View toggle buttons
    verticalBookmarksBtn.addEventListener('click', () => toggleView('vertical'));
    horizontalBookmarksBtn.addEventListener('click', () => toggleView('horizontal'));
    
    // Search functionality
    searchButton.addEventListener('click', searchBookmarks);
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') displayBookmarks();
    });

    // Sorting buttons
    sortAscBtn.addEventListener('click', () => sortBookmarks('asc'));
    sortDescBtn.addEventListener('click', () => sortBookmarks('desc'));
    sortAlphaBtn.addEventListener('click', () => sortBookmarks('alphabetical'));
    sortRevAlphaBtn.addEventListener('click', () => sortBookmarks('reverseAlphabetical'));
    sortByDateBtn.addEventListener('click', () => sortBookmarks('date'));
    sortByCategoryBtn.addEventListener('click', () => sortBookmarks('category'));
    sortByWebsiteBtn.addEventListener('click', () => sortBookmarks('website'));
    sortByUrlBtn.addEventListener('click', () => sortBookmarks('url'));

    // Reset button
    document.querySelector('.reset')?.addEventListener('click', () => {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        displayBookmarks(bookmarks);
    });

    // URL validation on input
    addUrlInput.addEventListener('input', validateUrlInput);

    // ==============================================
    // BOOKMARK MANAGEMENT FUNCTIONS
    // ==============================================

    /**
     * Adds a new bookmark to storage after validation
     */
    async function addBookmark() {
        // Get trimmed values from form inputs
        const [title, url, category] = [
            addTitleInput.value.trim(),
            addUrlInput.value.trim(),
            addCategoryInput.value.trim()
        ];

        // Validate required fields
        if (!title || !url || !category) {
            showErrorMessage(' is Required');
            return;
        }

        // Validate URL format
        if (!isValidUrl(url)) {
            showUrlError('URL must contain a valid domain (.com, .net, .org, etc.)');
            return;
        }

        try {
            // Fetch website logo
            const logoUrl = await fetchWebsiteLogo(url);
            
            // Create new bookmark object
            const newBookmark = {
                title: title,
                url: formatUrl(url),
                category: category,
                date: new Date().toISOString(),
                logo: logoUrl || null
            };

            // Save to local storage and update UI
            saveToLocalStorage(newBookmark);
            updateCategorySuggestions();
            resetForm();
            showSuccessMessage('Bookmark added successfully!');
        } catch (error) {
            console.error('Error adding bookmark:', error);
            showErrorMessage('Failed to add bookmark');
        }
    }

    /**
     * Validates URL format
     * @param {string} url - The URL to validate
     * @returns {boolean} - True if URL is valid
     */
    function isValidUrl(url) {
        // Check for common TLDs in the URL
        const pattern = /\.(com|net|org|io|gov|edu|co|us|uk|ca|au|de|fr|jp|cn|in|br|ru|info|biz|mobi|name|tv|cc|me|asia|xyz|tech|online|store|site|blog|club|design|art|dev|fun|live|news|space|website|wiki|app|dev|ai|io|cloud|digital|network|services|software|solutions|systems|tech|technology|today|tools|training|vision|works|world|wtf|zone)$/i;
        return pattern.test(url);
    }

    /**
     * Validates URL input in real-time
     */
    function validateUrlInput() {
        // Clear existing error messages
        const existingError = addUrlInput.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
            addUrlInput.style.borderColor = '';
            addUrlInput.style.marginBottom = '10px';
        }

        // Validate only if there's content
        if (addUrlInput.value.trim() && !isValidUrl(addUrlInput.value)) {
            showUrlError('URL must contain a valid domain (.com, .net, .org, etc.)');
        }
    }

    /**
     * Shows URL-specific error message
     * @param {string} message - Error message to display
     */
    function showUrlError(message) {
        const errorEl = document.createElement('p');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.color = '#f44336';
        errorEl.style.margin = '0 0 10px';

        addUrlInput.style.borderColor = '#f44336';
        addUrlInput.style.marginBottom = '0px';
        addUrlInput.insertAdjacentElement('afterend', errorEl);

        // Auto-remove error after 5 seconds
        setTimeout(() => {
            if (errorEl.parentNode) {
                errorEl.remove();
                addUrlInput.style.borderColor = '';
                addUrlInput.style.marginBottom = '10px';
            }
        }, 5000);
    }

    /**
     * Formats URL to ensure it has https:// protocol
     * @param {string} url - The URL to format
     * @returns {string} - Formatted URL
     */
    function formatUrl(url) {
        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }

    /**
     * Saves bookmark to local storage
     * @param {Object} bookmark - Bookmark object to save
     */
    function saveToLocalStorage(bookmark) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
    }

    /**
     * Displays all bookmarks in the UI
     * @param {Array|null} bookmarks - Optional array of bookmarks to display
     */
    function displayBookmarks(bookmarks = null) {
        let bookmarksToDisplay = bookmarks || JSON.parse(localStorage.getItem('bookmarks')) || [];
        bookmarksContainer.innerHTML = '';
        updateCategorySuggestions();

        // Show message if no bookmarks
        if (bookmarksToDisplay.length === 0) {
            bookmarksContainer.innerHTML = '<p class="warning-message">No bookmarks available</p>';
            return;
        }

        // Determine current view mode
        const viewClass = bookmarksContainer.classList.contains('horizontal') ? 'horizontal' : 'vertical';
        renderBookmarks(bookmarksToDisplay, viewClass);
    }

    /**
     * Renders bookmarks to the DOM
     * @param {Array} bookmarks - Array of bookmark objects
     * @param {string} viewType - 'horizontal' or 'vertical' view
     */
    function renderBookmarks(bookmarks, viewType) {
        bookmarksContainer.innerHTML = '';
        
        bookmarks.forEach((bookmark, index) => {
            const bookmarkElement = document.createElement('div');
            bookmarkElement.className = `bookmark ${viewType}-item`;
            bookmarkElement.dataset.index = index;

            // Format date for display
            const formattedDate = new Date(bookmark.date).toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Create HTML based on view type
            bookmarkElement.innerHTML = `
                ${viewType === 'horizontal' ? `
                    <figure>
                        <img src="${bookmark.logo || 'https://logo.clearbit.com/default.com'}" alt="${bookmark.title}" />
                    </figure>
                ` : ''}
                <div class="bookmark-info">
                    ${viewType === 'vertical' ? `
                        <figure>
                            <img src="${bookmark.logo || 'https://logo.clearbit.com/default.com'}" alt="${bookmark.title}" />
                        </figure>
                    ` : ''}
                    <h5>${bookmark.title}</h5>
                    <a href="${bookmark.url}" target="_blank">Visit Site</a>
                    <p class="category">${bookmark.category}</p>
                    <p class="date">${formattedDate}</p>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            bookmarksContainer.appendChild(bookmarkElement);
        });

        // Add delete event listeners
        bookmarksContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('delete-btn')) {
                const index = parseInt(e.target.closest('.bookmark').dataset.index, 10);
                deleteBookmark(index);
            }
        });
    }

    /**
     * Deletes a bookmark by index
     * @param {number} index - Index of bookmark to delete
     */
    function deleteBookmark(index) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

        if (index >= 0 && index < bookmarks.length) {
            // Find the bookmark element
            const bookmarkElement = bookmarksContainer.querySelector(`.bookmark[data-index="${index}"]`);
            
            if (bookmarkElement) {
                // Add fade-out animation
                bookmarkElement.classList.add('fade-out');

                // Remove after animation completes
                bookmarkElement.addEventListener('animationend', () => {
                    bookmarks.splice(index, 1);
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                    displayBookmarks();
                });
            } else {
                // Fallback without animation
                bookmarks.splice(index, 1);
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                displayBookmarks();
            }
        }
    }

    /**
     * Deletes all bookmarks after confirmation
     */
    function deleteAllBookmarks() {
        if (confirm('Are you sure you want to delete all bookmarks?')) {
            localStorage.removeItem('bookmarks');
            displayBookmarks();
        }
    }

    // ==============================================
    // SORTING FUNCTIONS
    // ==============================================

    /**
     * Sorts bookmarks based on criteria
     * @param {string} criteria - Sorting criteria
     */
    function sortBookmarks(criteria) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

        switch (criteria) {
            case 'asc':
                bookmarks.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'desc':
                bookmarks.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'alphabetical':
                bookmarks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'reverseAlphabetical':
                bookmarks.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'date':
                bookmarks.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'category':
                bookmarks.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'website':
                bookmarks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'url':
                bookmarks.sort((a, b) => a.url.localeCompare(b.url));
                break;
            default:
                break;
        }

        displayBookmarks(bookmarks);
    }

    // ==============================================
    // SEARCH FUNCTIONALITY
    // ==============================================

    /**
     * Filters bookmarks based on search term
     */
    function searchBookmarks() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;

        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const filtered = bookmarks.filter(bookmark =>
            bookmark.title.toLowerCase().includes(searchTerm) ||
            bookmark.url.toLowerCase().includes(searchTerm) ||
            bookmark.category.toLowerCase().includes(searchTerm)
        );

        displayBookmarks(filtered);
    }

    // ==============================================
    // CATEGORY MANAGEMENT
    // ==============================================

    /**
     * Updates category suggestions and filter buttons
     */
    function updateCategorySuggestions() {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const uniqueCategories = [...new Set(bookmarks.map(b => b.category))];

        // Update suggestions dropdown
        const suggestionsHTML = uniqueCategories.map(cat =>
            `<p class="category-suggest">${cat}</p>`
        ).join('');

        categorySuggestions.innerHTML = suggestionsHTML || '<p>No categories yet</p>';

        // Update filter buttons
        const buttonsHTML = uniqueCategories.map(cat =>
            `<button class="category-filter-btn">${cat}</button>`
        ).join('') + '<button class="reset">Reset</button>';

        categoryButtonsContainer.innerHTML = buttonsHTML || '<p>No categories to filter</p>';

        // Add event listeners to suggestions
        document.querySelectorAll('.category-suggest').forEach(btn => {
            btn.addEventListener('click', () => {
                addCategoryInput.value = btn.textContent;
            });
        });

        // Add event listeners to filter buttons
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterByCategory(btn.textContent);
            });
        });

        // Reset button
        document.querySelector('.reset')?.addEventListener('click', () => {
            displayBookmarks();
        });
    }

    /**
     * Filters bookmarks by category
     * @param {string} category - Category to filter by
     */
    function filterByCategory(category) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const filtered = bookmarks.filter(b => b.category === category);
        displayBookmarks(filtered);
    }

    // ==============================================
    // VIEW TOGGLE
    // ==============================================

    /**
     * Toggles between horizontal and vertical views
     * @param {string} view - 'horizontal' or 'vertical'
     */
    function toggleView(view) {
        bookmarksContainer.classList.remove('horizontal', 'vertical');
        bookmarksContainer.classList.add(view);
        displayBookmarks();
    }

    // ==============================================
    // UI HELPER FUNCTIONS
    // ==============================================

    /**
     * Resets the add bookmark form
     */
    function resetForm() {
        addTitleInput.value = '';
        addUrlInput.value = '';
        addCategoryInput.value = '';
    }

    /**
     * Shows error messages for form validation
     * @param {string} errMsg - Error message to display
     */
    function showErrorMessage(errMsg) {
        // Clear existing errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Reset input styles
        document.querySelectorAll('input:not(#search)').forEach(input => {
            input.style.borderColor = '';
            input.style.marginBottom = '10px';
        });

        // Show new errors if message provided
        if (errMsg) {
            document.querySelectorAll('input:not(#search)').forEach(input => {
                if (!input.value.trim()) {
                    const errorEl = document.createElement('p');
                    errorEl.className = 'error-message';
                    errorEl.textContent = `${input.getAttribute('placeholder')} ${errMsg}`;
                    errorEl.style.color = '#f44336';
                    errorEl.style.margin = '0 0 10px';

                    input.style.borderColor = '#f44336';
                    input.style.marginBottom = '0px';
                    input.insertAdjacentElement('afterend', errorEl);
                }
            });

            // Auto-remove errors after 3 seconds
            setTimeout(() => {
                document.querySelectorAll('.error-message').forEach((el) => el.remove())
                document.querySelectorAll('input:not(#search)').forEach(input => {
                    input.style.borderColor = '';
                    input.style.marginBottom = '10px';
                });
            }, 3000)
        }
    }

    /**
     * Shows success message
     * @param {string} message - Success message to display
     */
    function showSuccessMessage(message) {
        // Remove existing messages
        const existingMsg = document.querySelector('.success-message');
        if (existingMsg) existingMsg.remove();

        // Create new message element
        const successEl = document.createElement('div');
        successEl.className = 'success-message';
        successEl.textContent = message;
        successEl.style.color = '#4CAF50';
        successEl.style.margin = '10px 0';
        successEl.style.textAlign = 'center';
        successEl.style.fontWeight = 'bold';

        // Add to form
        const form = document.querySelector('form');
        form.insertBefore(successEl, form.lastElementChild);

        // Auto-remove after 3 seconds
        setTimeout(() => successEl.remove(), 3000);
    }

    /**
     * Fetches website logo using Clearbit API
     * @param {string} domain - Website domain
     * @returns {Promise<string>} - URL of the logo image
     */
    async function fetchWebsiteLogo(domain) {
        try {
            // Validate input
            if (!domain) {
                console.warn('No domain provided');
                return null;
            }

            // Clean the domain
            domain = domain.trim().toLowerCase();
            domain = domain.replace(/(https?:\/\/)?(www\.)?/, '');
            domain = domain.split('/')[0];

            const API_URL = `https://logo.clearbit.com/${domain}`;

            // Check if logo exists by trying to load the image
            return await new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";

                img.onload = function () {
                    resolve(API_URL);
                };

                img.onerror = function () {
                    resolve('https://logo.clearbit.com/default.com');
                };

                img.src = API_URL;
            });

        } catch (error) {
            console.error('Error checking website logo:', error);
            return null;
        }
    }
});