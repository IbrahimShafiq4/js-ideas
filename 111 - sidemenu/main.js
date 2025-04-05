// ==============================================
// DOM ELEMENTS
// ==============================================

const elements = {
    // Main containers
    aside: document.querySelector('aside'),
    logo: document.querySelector('.logo'),
    logoIcon: document.querySelector('.logo i'),
    logoHeading: document.querySelector('.logo h3'),
    asideContent: document.querySelector('.aside-content'),
    topContent: document.querySelector('.t-content'),
    bottomContent: document.querySelector('.b-content'),

    // Search elements
    searchBar: document.querySelector('.search-bar'),
    searchIcon: document.querySelector('.search-bar i'),
    searchInput: document.querySelector('#search-input'),

    // Link containers
    topBottomContent: document.querySelector('.tb-content'),
    bottomBottomContent: document.querySelector('.bb-content'),

    // User profile
    user: document.querySelector('.user'),
    userImage: document.querySelector('.user figure img'),
    userDetails: document.querySelector('.user-details'),
    userName: document.querySelector('.user-details h4'),
    userEmail: document.querySelector('.user-details p'),
    userArrowIcon: document.querySelector('.user-details i'),

    // Controls
    collapseBtn: document.querySelector('i[role="button"]'),
    gearBtn: document.querySelector('.fa-gears'),
    settingsAppearance: document.querySelector('.settings-appearance'),

    // Link creation form
    selectGroup: document.querySelector('select'),
    linkName: document.querySelector('#link_name'),
    linkLink: document.querySelector('#link_link'),
    linkColor: document.querySelector('#link_color'),
    addBtn: document.querySelector('button')
};

// ==============================================
// STATE MANAGEMENT
// ==============================================

const state = {
    socialLinks: [],
    otherLinks: [],
    isInitialized: false,
    draggedItem: null
};

// ==============================================
// INITIALIZATION
// ==============================================

/**
 * Initializes the sidebar application
 */
function initializeApp() {
    // Load saved data from localStorage
    loadFromStorage();

    // Setup event listeners
    setupEventListeners();

    // Initialize UI state
    updateLinksDisplay();
    updateSearchIconCursor();

    state.isInitialized = true;
}

/**
 * Loads saved links from localStorage
 */
function loadFromStorage() {
    const savedData = JSON.parse(localStorage.getItem('sidebarLinks')) || {};

    // Clear existing content while preserving original HTML elements
    clearLinkContainers();

    // Add saved social links
    if (savedData.socialLinks) {
        savedData.socialLinks.forEach(link => {
            if (!document.getElementById(link.id)) {
                createLink(elements.topBottomContent, {
                    name: link.name,
                    type: 'social',
                    color: link.color,
                    url: link.url,
                    id: link.id
                });
            }
        });
    }

    // Add saved other links
    if (savedData.otherLinks) {
        savedData.otherLinks.forEach(link => {
            if (!document.getElementById(link.id)) {
                createLink(elements.bottomBottomContent, {
                    name: link.name,
                    type: 'other',
                    color: link.color,
                    url: link.url,
                    id: link.id
                });
            }
        });
    }

    // Update state with current links
    updateLinkState();
    setupDragAndDrop();
}

/**
 * Clears dynamically added links while preserving original HTML
 */
function clearLinkContainers() {
    const dynamicSocialLinks = elements.topBottomContent.querySelectorAll('li:not([data-original])');
    const dynamicOtherLinks = elements.bottomBottomContent.querySelectorAll('li:not([data-original])');

    dynamicSocialLinks.forEach(link => link.remove());
    dynamicOtherLinks.forEach(link => link.remove());
}

// ==============================================
// LINK MANAGEMENT
// ==============================================

/**
 * Creates a new link element
 * @param {HTMLElement} container - The parent container
 * @param {Object} options - Link options
 * @param {string} options.name - Link display name
 * @param {string} options.type - 'social' or 'other'
 * @param {string} options.color - Link color
 * @param {string} options.url - Link URL
 * @param {string} [options.id] - Optional ID
 */
function createLink(container, { name, type, color, url, id = null }) {
    // Generate unique ID if not provided
    const linkId = id || generateId();

    // Create list item
    const li = document.createElement('li');
    li.id = linkId;
    li.className = 'draggable';
    li.draggable = true;

    // Create anchor element
    const a = document.createElement('a');
    a.href = url;
    a.style.setProperty('--clr', color);

    // Set data attributes
    a.dataset.name = name;
    a.dataset.fulltext = name;
    a.dataset.color = color;
    a.dataset.url = url;

    // Set icon based on type
    const iconClass = type === 'social' ? 'fa-hashtag' : 'fa-gear';

    // Create link HTML
    a.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${name}</span>
        <button class="delete-btn" title="Delete this link">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    `;

    // Add delete functionality
    const deleteBtn = a.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        li.remove();
        saveToStorage();
        updateLinkState();
    });

    // Append elements
    li.appendChild(a);

    // Get or create UL container
    let ul = container.querySelector('ul');
    if (!ul) {
        ul = document.createElement('ul');
        container.appendChild(ul);
    }

    ul.appendChild(li);

    // Update state and setup drag-and-drop
    updateLinkState();
    setupDragAndDrop();

    return li;
}

/**
 * Updates the application state with current links
 */
function updateLinkState() {
    state.socialLinks = Array.from(elements.topBottomContent.querySelectorAll('li a'));
    state.otherLinks = Array.from(elements.bottomBottomContent.querySelectorAll('li a'));
}

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==============================================
// DRAG AND DROP
// ==============================================

/**
 * Sets up drag-and-drop functionality
 */
function setupDragAndDrop() {
    // Remove old event listeners first
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.tb-content ul, .bb-content ul');

    draggables.forEach(draggable => {
        draggable.removeEventListener('dragstart', handleDragStart);
        draggable.removeEventListener('dragend', handleDragEnd);
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
    });

    containers.forEach(container => {
        container.removeEventListener('dragover', handleDragOver);
        container.addEventListener('dragover', handleDragOver);
    });
}

/**
 * Handles drag start event
 * @param {DragEvent} e - Drag event
 */
function handleDragStart(e) {
    state.draggedItem = this;
    this.classList.add('dragging');
    setTimeout(() => (this.style.opacity = '0.4'), 0);
}

/**
 * Handles drag end event
 */
function handleDragEnd() {
    this.classList.remove('dragging');
    this.style.opacity = '1';
    saveToStorage();
}

/**
 * Handles drag over event
 * @param {DragEvent} e - Drag event
 */
function handleDragOver(e) {
    e.preventDefault();
    if (!state.draggedItem) return;

    const afterElement = getDragAfterElement(this, e.clientY);
    if (afterElement) {
        this.insertBefore(state.draggedItem, afterElement);
    } else {
        this.appendChild(state.draggedItem);
    }
}

/**
 * Finds the element after which to place the dragged item
 * @param {HTMLElement} container - The container element
 * @param {number} y - Vertical position
 * @returns {HTMLElement|null} The element after which to place
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        return offset < 0 && offset > closest.offset
            ? { offset, element: child }
            : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ==============================================
// STORAGE MANAGEMENT
// ==============================================

/**
 * Saves current state to localStorage
 */
function saveToStorage() {
    const socialLinksData = state.socialLinks.map(link => ({
        id: link.id,
        name: link.dataset.name,
        color: link.dataset.color || getComputedStyle(link).getPropertyValue('--clr'),
        url: link.href,
    }));

    const otherLinksData = state.otherLinks.map(link => ({
        id: link.id,
        name: link.dataset.name,
        color: link.dataset.color || getComputedStyle(link).getPropertyValue('--clr'),
        url: link.href,
    }));

    localStorage.setItem('sidebarLinks', JSON.stringify({
        socialLinks: socialLinksData,
        otherLinks: otherLinksData
    }));
}

// ==============================================
// UI UPDATES
// ==============================================

/**
 * Updates link display based on sidebar state
 */
function updateLinksDisplay() {
    const isCollapsed = elements.aside.classList.contains('collapse');
    const isSmallScreen = window.innerWidth <= 991;

    [...state.socialLinks, ...state.otherLinks].forEach(li => {
        if (!li.dataset.fulltext) {
            li.dataset.fulltext = li.textContent.trim();
            li.dataset.name = li.textContent.trim();
        }

        if (isCollapsed || isSmallScreen) {
            li.textContent = li.dataset.fulltext.charAt(0);
            li.style.textAlign = 'center';
        } else {
            li.textContent = li.dataset.fulltext;
            li.style.textAlign = 'left';
        }
    });
}

/**
 * Updates search icon cursor style
 */
function updateSearchIconCursor() {
    elements.searchIcon.style.cursor = elements.aside.classList.contains('collapse') ? 'pointer' : '';
}

/**
 * Toggles sidebar collapsed state
 */
function toggleSidebar() {
    elements.aside.classList.toggle('collapse');
    updateLinksDisplay();
    updateSearchIconCursor();
}

// ==============================================
// SEARCH FUNCTIONALITY
// ==============================================

/**
 * Handles search input
 */
function handleSearch() {
    const inputValue = elements.searchInput.value.trim();

    if (!inputValue) {
        resetLinkText([...state.socialLinks, ...state.otherLinks]);
        return;
    }

    [...state.socialLinks, ...state.otherLinks].forEach(link => {
        const originalText = link.dataset.name;
        const color = getComputedStyle(link).getPropertyValue('--clr');

        // Create a case-insensitive regex for the match
        const regex = new RegExp(`(${inputValue})`, 'gi');

        // Replace the matched letters with a span
        const highlighted = originalText.replace(regex, `<span style="color: ${color};">$1</span>`);

        link.innerHTML = highlighted;
    });
}

/**
 * Resets link text display
 * @param {Array} links - Links to reset
 */
function resetLinkText(links) {
    links.forEach(li => {
        li.innerHTML = li.innerHTML.replace(/<span[^>]*>([^<]*)<\/span>/g, '$1');
    });
}

// ==============================================
// EVENT HANDLERS
// ==============================================

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Search
    elements.searchInput.addEventListener('input', handleSearch);

    // Sidebar controls
    elements.collapseBtn.addEventListener('click', toggleSidebar);
    elements.searchIcon.addEventListener('click', () => {
        if (elements.aside.classList.contains('collapse')) toggleSidebar();
    });

    // Window resize
    window.addEventListener('resize', updateLinksDisplay);

    // Link creation form
    elements.selectGroup.addEventListener('change', () => {
        elements.linkName.disabled = false;
        elements.linkLink.disabled = false;
        elements.linkColor.disabled = false;
        elements.addBtn.disabled = false;
    });

    elements.addBtn.addEventListener('click', handleAddLink);

    // Settings panel
    elements.gearBtn.addEventListener('click', toggleSettings);
}

/**
 * Handles adding a new link
 */
function handleAddLink() {
    const selectedSection = elements.selectGroup.value;
    const name = elements.linkName.value.trim();
    const url = elements.linkLink.value.trim();
    const color = elements.linkColor.value;

    if (!name) return alert('Please enter a link name');
    if (!url) return alert('Please enter a URL');

    const container = selectedSection === 'tb-content'
        ? elements.topBottomContent
        : elements.bottomBottomContent;

    createLink(container, {
        name,
        type: selectedSection === 'tb-content' ? 'social' : 'other',
        color,
        url
    });

    // Reset form
    elements.linkName.value = '';
    elements.linkLink.value = '';

    saveToStorage();
    updateLinksDisplay();
}

/**
 * Toggles settings panel visibility
 */
function toggleSettings() {
    elements.settingsAppearance.classList.toggle('appear');
}

// ==============================================
// INITIALIZATION
// ==============================================

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);