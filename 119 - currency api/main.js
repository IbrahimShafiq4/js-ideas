// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Define all DOM elements we need to work with in a centralized configuration object
    const DOM_ELEMENTS = {
        currencyInput: {
            selector: '.currency-changer__input',
            type: 'single',  // Single DOM element
        },
        currencyFromSelect: {
            selector: '.currency-changer__container__item:first-child .currency-changer__container__item__select',
            type: 'single',
        },
        fromTitle: {
            selector: ".currency-changer__container__item:first-child h6",  // Fixed selector to match actual structure
            type: 'single',
        },
        toTitle: {
            selector: ".currency-changer__container__item:last-child h6",  // Fixed selector to match actual structure
            type: 'single',
        },
        currencyToSelect: {
            selector: '.currency-changer__container__item:last-child .currency-changer__container__item__select',
            type: 'single',
        },
        fromCurrencyList: {
            selector: '.currency-changer__container__item:first-child ul',
            type: 'single',  // Changed to single as we need the UL element
        },
        toCurrencyList: {
            selector: '.currency-changer__container__item:last-child ul',
            type: 'single',
        },
        convertButton: {
            selector: '#convert',
            type: 'single',
        },
        resultDisplay: {
            selector: '#result span',
            type: 'single',
        },
        currencySelect: {
            selector: '.currency-changer__container__currency__item',  // The clickable header
            type: 'multiple',
        },
        swapContainer: {
            selector: '.currency-changer__swap__container__item',
            type: 'single',
        },
        selectFromList: {
            selector: '.currency-changer__container__item:first-child ul li',
            type: 'multiple',
        },
        selectToList: {
            selector: '.currency-changer__container__item:last-child ul li',
            type: 'multiple',
        }
    };

    // Helper function to safely get DOM elements
    const getElement = ({ selector, type }) => {
        try {
            return type === 'single'
                ? document.querySelector(selector)
                : document.querySelectorAll(selector);
        } catch (error) {
            console.error(`Error selecting element with selector: ${selector}`, error);
            return type === 'single' ? null : [];
        }
    };

    // Create a reference object with all our DOM elements
    const ELEMENT_REF = Object.fromEntries(
        Object.entries(DOM_ELEMENTS).map(([key, config]) => {
            return [key, getElement(config)];
        })
    );

    // Destructure all our element references for easier access
    const {
        currencyInput,
        fromCurrencyList,
        toCurrencyList,
        convertButton,
        resultDisplay,
        currencySelect,
        swapContainer,
        selectFromList,
        selectToList,
        fromTitle,
        toTitle
    } = ELEMENT_REF;

    // Initialize default values
    let fromCurrency = 'USD';
    let toCurrency = 'EGP';
    fromTitle.textContent = fromCurrency;
    toTitle.textContent = toCurrency;
    resultDisplay.textContent = '0.00 EGP';
    let currencyValue = 0;

    // API configuration
    const apiKey = 'ae65170cb6626f9ad9750b4f';

    /* ========== DROPDOWN FUNCTIONALITY ========== */

    // Toggle dropdown visibility when clicking on currency select header
    currencySelect.forEach((select) => {
        select.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent event from bubbling to document
            const parent = select.closest('.currency-changer__container__item__select');
            const list = parent.querySelector('ul');

            // Close all other dropdowns first
            document.querySelectorAll('ul').forEach(dropdown => {
                if (dropdown !== list) dropdown.classList.remove('active__list');
            });

            // Toggle current dropdown
            list.classList.toggle('active__list');
        });
    });

    // Close all dropdowns when clicking anywhere else in the document
    document.addEventListener('click', () => {
        document.querySelectorAll('ul').forEach(list => {
            list.classList.remove('active__list');
        });
    });

    // Prevent dropdown from closing when clicking inside it
    [fromCurrencyList, toCurrencyList].forEach(list => {
        if (list) {
            list.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });

    /* ========== CURRENCY SELECTION ========== */

    // Handle currency selection in the "From" dropdown
    selectFromList.forEach((item) => {
        item.addEventListener('click', () => {
            // Update active state in the list
            selectFromList.forEach(li => li.classList.remove('active__item'));
            item.classList.add('active__item');

            // Update displayed currency
            fromCurrency = item.textContent;
            fromTitle.textContent = fromCurrency;

            // Close the dropdown
            item.closest('ul').classList.remove('active__list');

            if (currencyInput.value) convertCurrency();  // Re-trigger conversion if there's a value in the input
        });
    });

    // Handle currency selection in the "To" dropdown
    selectToList.forEach((item) => {
        item.addEventListener('click', () => {
            // Update active state in the list
            selectToList.forEach(li => li.classList.remove('active__item'));
            item.classList.add('active__item');

            // Update displayed currency
            toCurrency = item.textContent;
            toTitle.textContent = toCurrency;
            resultDisplay.textContent = '0.00 ' + toCurrency;  // Reset result display

            // Close the dropdown
            item.closest('ul').classList.remove('active__list');

            if (currencyInput.value) convertCurrency();  // Re-trigger conversion if there's a value in the input
        });
    });

    /* ========== SWAP FUNCTIONALITY ========== */

    swapContainer.addEventListener('click', () => {
        // Swap the currencies
        [fromCurrency, toCurrency] = [toCurrency, fromCurrency];

        // Update the UI
        fromTitle.textContent = fromCurrency;
        toTitle.textContent = toCurrency;
        resultDisplay.textContent = '0.00 ' + toTitle.textContent;  // Reset result display

        // Update active items in both lists
        updateActiveItems();

        if (currencyInput.value) convertCurrency();  // Re-trigger conversion if there's a value in the input

    });

    // Helper function to update active items in both lists
    function updateActiveItems() {
        // Update "From" list active items
        selectFromList.forEach(item => {
            item.classList.toggle('active__item', item.textContent === fromCurrency);
        });

        // Update "To" list active items
        selectToList.forEach(item => {
            item.classList.toggle('active__item', item.textContent === toCurrency);
        });
    }

    /* ========== INPUT VALIDATION ========== */

    currencyInput.addEventListener('input', () => {
        // Ensure input is a valid number
        const value = parseFloat(currencyInput.value);
        if (!isNaN(value)) {
            currencyValue = value;
            currencyInput.value = value;
            convertCurrency()
        } else {
            currencyInput.value = '';
            currencyValue = 0;
        }
    });

    /* ========== CONVERSION FUNCTIONALITY ========== */

    async function convertCurrency() {
        // Validate input
        if (!currencyValue || currencyValue <= 0) {
            showErrorMessage('Please enter a valid amount');
            return;
        }

        try {
            const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${currencyValue}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.result === 'success') {
                // Format the result nicely
                const formattedResult = new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(data.conversion_result);

                resultDisplay.textContent = `${formattedResult} ${toCurrency}`;
            } else {
                throw new Error(data['error-type'] || 'Conversion failed');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            showErrorMessage('Failed to convert. Please try again.');
        }
    }

    // Helper function to show error messages
    function showErrorMessage(message) {
        // Remove any existing error messages
        document.querySelectorAll('.error__message').forEach(el => el.remove());

        const errorElement = document.createElement('p');
        errorElement.textContent = message;
        errorElement.classList.add('error__message');

        currencyInput.insertAdjacentElement('afterend', errorElement);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }

    // Initialize convert button
    convertButton.addEventListener('click', convertCurrency);

    // Set initial active items
    updateActiveItems();
});