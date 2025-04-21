/**
 * Main application initialization when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * DOM element references configuration
   * Maps component names to their selectors and types
   */
  const DOM_ELEMENTS = {
    eventNameInput: {
      selector: '.event-name',
      type: "single",
    },
    eventDateInput: {
      selector: '.event-date',
      type: "single",
    },
    eventOrganizerInput: {
      selector: '.organizer',
      type: "single",
    },
    addEventButton: {
      selector: '.add-event',
      type: "single",
    },
    eventsContainer: {
      selector: '.events',
      type: 'single'
    },
    addEventForm: {
      selector: '.add-box',
      type: 'single',
    },
    deleteEvents: {
      selector: ".delete-events",
      type: 'single',
    }
  };

  /**
   * Helper function to safely get DOM elements
   * @param {Object} config - Element configuration
   * @param {string} config.selector - CSS selector
   * @param {string} config.type - 'single' or 'multiple'
   * @returns {Element|NodeList} The selected element(s)
   */
  const getDOMElement = ({ selector, type }) => {
    try {
      return type === 'single'
        ? document.querySelector(selector)
        : document.querySelectorAll(selector);
    } catch (error) {
      console.error(`Error selecting element: ${selector}`, error);
      return type === 'single' ? null : [];
    }
  };

  // Create references to all DOM elements
  const elements = Object.fromEntries(
    Object.entries(DOM_ELEMENTS).map(([key, config]) => [key, getDOMElement(config)])
  );

  let isEditing = false;
  let currentEditingIndex = null;

  /**
   * Sets minimum date restriction on the date input field
   * Prevents selecting dates before today and validates manual input
   */
  function initializeDateRestrictions() {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    if (!elements.eventDateInput) {
      console.error('Date input element not found');
      return;
    }

    // Set minimum date attribute
    elements.eventDateInput.min = todayFormatted;

    // Validate on input change
    elements.eventDateInput.addEventListener('input', () => {
      if (elements.eventDateInput.value < todayFormatted) {
        elements.eventDateInput.value = todayFormatted;
        console.warn('Date cannot be in the past. Set to today.');
      }
    });

    // Additional validation when field loses focus
    elements.eventDateInput.addEventListener('blur', () => {
      if (elements.eventDateInput.value && elements.eventDateInput.value < todayFormatted) {
        elements.eventDateInput.value = todayFormatted;
      }
    });
  }

  /**
   * Creates and displays an error message for a form field
   * @param {HTMLElement} inputElement - The input element with error
   */
  function showValidationError(inputElement) {
    // Generate error message from input's name attribute
    const fieldName = inputElement.getAttribute('name').split('-').join(' ');
    const errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;

    // Create error element
    const errorElement = document.createElement('p');
    errorElement.className = 'error-text';
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '4px';
    errorElement.style.fontSize = '0.8rem';
    errorElement.textContent = errorMessage;

    // Style the invalid input (your original styling)
    inputElement.style.borderColor = 'red';
    inputElement.style.marginBottom = '0';

    // Style the error and invalid input
    inputElement.classList.add('invalid-input');
    inputElement.insertAdjacentElement('afterend', errorElement);
  }

  /**
   * Clears all validation errors from the form
   */
  function clearValidationErrors() {
    // Remove all error messages
    document.querySelectorAll('.error-text').forEach(el => el.remove());

    // Reset input styles (your original styling)
    document.querySelectorAll('input').forEach(input => {
      input.style.borderColor = '#ccc';
      input.style.marginBottom = '20px';
    });
  }

  /**
   * Validates the event form and returns validation status
   * @returns {boolean} True if form is valid, false otherwise
   */
  function validateEventForm() {
    clearValidationErrors();
    let isValid = true;

    // Check each required field
    document.querySelectorAll('input').forEach((input) => {
      if (!input.value.trim()) {
        showValidationError(input);
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Creates a new event object from form data
   * @returns {Object} Event object with name, date, organizer and timestamp
   */
  function createEventFromForm() {
    return {
      name: elements.eventNameInput.value.trim(),
      date: elements.eventDateInput.value.trim(),
      organizer: elements.eventOrganizerInput.value.trim(),
      timeStamp: new Date(elements.eventDateInput.value).getTime()
    };
  }

  /**
   * Handles the form submission for adding a new event
   */
  function handleAddEvent() {
    if (!validateEventForm()) return;

    const events = getStoredEvents();

    if (isEditing) {
      // Update the existing event
      events[currentEditingIndex] = createEventFromForm();
      isEditing = false;
      currentEditingIndex = null;
      elements.addEventButton.innerHTML = 'Add Event';
    } else {
      // Add a new event
      const newEvent = createEventFromForm();
      events.push(newEvent);
    }

    saveEvents(events);
    document.querySelectorAll('input').forEach(input => input.value = "");
    renderEvents();
  }


  /**
   * Retrieves events from localStorage
   * @returns {Array} Array of stored events
   */
  function getStoredEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
  }

  /**
   * Saves events to localStorage
   * @param {Array} events - Array of events to save
   */
  function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
  }

  /**
   * Renders all events to the events container
   */
  function renderEvents() {
    const events = getStoredEvents();
    elements.eventsContainer.innerHTML = "";

    if (events.length === 0) {
      elements.eventsContainer.innerHTML = '<p class="no-events">No events scheduled yet</p>';
      return;
    }

    events.forEach((event, index) => {
      const eventElement = document.createElement('div');
      eventElement.className = 'event-card';
      eventElement.dataset.eventIndex = index;

      eventElement.innerHTML = `
        <div class="event">
          <h3 class="event-title">${event.name} <i class="fa-solid fa-pen edit-btn"></i></h3>
          <p class="event-organizer"><span>By</span> ${event.organizer}</p>
          <p class="event-date"><span>On</span> ${formatDisplayDate(event.date)}</p>
          <p class="event-countdown"><span>Time Left</span> ${formatCountdown(event.timeStamp)}</p>
          <button type="button" class="delete-btn" data-index="${index}">Delete</button>
        </div>
      `;
      elements.eventsContainer.appendChild(eventElement);
    });
  }


  /**
   * Formats a date string for display
   * @param {string} dateString - Date string in YYYY-MM-DD format
   * @returns {string} Formatted date string
   */
  function formatDisplayDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  /**
   * Formats a timestamp into a countdown string
   * @param {number} timestamp - Event timestamp in milliseconds
   * @returns {string} Formatted countdown string
   */
  function formatCountdown(timestamp) {
    const now = Date.now();
    const timeRemaining = timestamp - now;

    if (timeRemaining <= 0) return "Event has passed";

    // Calculate time units
    const seconds = Math.floor(timeRemaining / 1000) % 60;
    const minutes = Math.floor(timeRemaining / (1000 * 60)) % 60;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60)) % 24;
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    // Format with leading zeros
    const pad = (num) => num.toString().padStart(2, '0');

    // Return appropriate format based on time remaining
    if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    if (hours > 0) return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    return `${pad(minutes)}m ${pad(seconds)}s`;
  }

  /**
   * Handles deletion of an event
   * @param {number} index - Index of event to delete
   */
  function handleDeleteEvent(index) {
    const events = getStoredEvents();
    events.splice(index, 1);
    saveEvents(events);
    renderEvents();
  }

  function handleDeleteAllEvents() {
    localStorage.removeItem('events');
    renderEvents();
  }


  elements.deleteEvents.addEventListener('click', handleDeleteAllEvents)

  // Initialize date restrictions
  initializeDateRestrictions();

  // Set up event listeners
  elements.addEventButton?.addEventListener('click', handleAddEvent);
  elements.eventsContainer?.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.dataset.index, 10);
      if (!isNaN(index)) handleDeleteEvent(index);
    }
  });

  elements.eventsContainer?.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const eventIndex = parseInt(e.target.closest('.event-card')?.dataset.eventIndex, 10);
      const events = getStoredEvents();
      const event = events[eventIndex];
      if (event) {
        editEvent(event, eventIndex);
      }
    }
  });


  function editEvent(event, index) {
    elements.eventNameInput.value = event.name;
    elements.eventDateInput.value = event.date;
    elements.eventOrganizerInput.value = event.organizer;

    isEditing = true;
    currentEditingIndex = index;
    elements.addEventButton.innerHTML = 'Edit Event';
  }

  // Set up countdown timer and initial render
  setInterval(renderEvents, 1000);
  renderEvents();
});