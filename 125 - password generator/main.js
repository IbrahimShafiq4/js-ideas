document.addEventListener('DOMContentLoaded', () => {
    // ======================
    // DOM Elements Configuration
    // ======================
    const DOM_ELEMENTS = {
        lengthInput: {
            selector: '#length',
            type: 'single'
        },
        closeDialogXMark: {
            selector: '.close-mark',
            type: 'single',
        },
        dialog: {
            selector: 'dialog',
            type: 'single'
        },
        generateBtn: {
            selector: '#generate',
            type: 'single',
        },
        savedPasswords: {
            selector: '#saved-passwords',
            type: 'single'
        },
        passwordResult: {
            selector: '#password',
            type: 'single'
        },
        copyDialog: {
            selector: '#copy-dialog',
            type: 'single'
        }
    };

    // ======================
    // Utility Functions
    // ======================
    const getElement = ({ selector, type }) => {
        try {
            return type === 'single'
                ? document.querySelector(selector)
                : document.querySelectorAll(selector);
        } catch {
            return type === 'single' ? null : [];
        }
    };

    // Initialize element references
    const ELEMENT_REF = Object.fromEntries(
        Object.entries(DOM_ELEMENTS).map(([key, config]) => [key, getElement(config)])
    );

    // Destructure element references
    const
        {
            lengthInput,
            closeDialogXMark,
            dialog,
            generateBtn,
            savedPasswords,
            passwordResult,
            copyDialog
        } = ELEMENT_REF;

    // ======================
    // State Management
    // ======================
    let passwords = JSON.parse(localStorage.getItem('passwords')) || [];

    // ======================
    // Event Handlers
    // ======================
    // Length input validation
    if (lengthInput) {
        lengthInput.addEventListener('input', () => {
            let value = lengthInput.value.replace(/\D/g, '');
            if (value !== '' && Number(value) > 32) {
                value = '32';
            }
            lengthInput.value = value;
        });

        lengthInput.addEventListener('blur', () => {
            if (lengthInput.value.trim() === '') {
                lengthInput.value = '10';
                lengthInput.focus();
            }
        });
    }

    // Dialog management
    closeDialogXMark?.addEventListener('click', clearDialog);
    dialog?.addEventListener('click', (e) => {
        if (e.target === dialog) {
            clearDialog();
        }
    });

    // Updated copyDialog click handler
    copyDialog?.addEventListener('click', (e) => {
        if (e.target === copyDialog || e.target.classList.contains('dialog-container')) {
            clearCopyDialog();
        }
    });

    // Global escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'escape') {
            clearDialog();
            clearCopyDialog();
        }
    });

    // Password generation handler
    generateBtn?.addEventListener('click', () => {
        if (!lengthInput.value || isNaN(lengthInput.value) || lengthInput.value <= 0) {
            showDialogMessage('Please enter a valid password length.');
            return;
        }

        const length = parseInt(lengthInput.value, 10);
        const includeNumbers = document.querySelector('#include-numbers').checked;
        const includeSpecial = document.querySelector('#include-special').checked;
        savedPasswords.innerHTML = '';

        const password = generatePassword(length, includeNumbers, includeSpecial);
        if (password) {
            passwordResult.innerHTML = `
                <span class="password-text">${password}</span>
                <span class="copy-btn" style="cursor:pointer; color:blue;">copy</span>
            `;
            copyBtnHandler(passwordResult, '.copy-btn', password);
            showAndHideDialogMessage('Password generated successfully!');
            passwords.unshift(password);
            localStorage.setItem('passwords', JSON.stringify(passwords));
            passwordsAppearance();
        } else {
            showDialogMessage('Failed to generate password.');
        }
    });

    // ======================
    // Core Functions
    // ======================
    function generatePassword(length = 10, includeNumbers = false, includeSpecial = false) {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const special = "!@#$%^&*()_+-=[]{}|;:',.<>?";

        let charactersPool = lowercase + uppercase;
        if (includeNumbers) charactersPool += numbers;
        if (includeSpecial) charactersPool += special;

        if (!charactersPool) {
            showDialogMessage('No character sets selected for password generation.');
            return '';
        }

        if (length == 0) {
            showDialogMessage('Password length must be greater than 0.');
            return '';
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersPool.length);
            password += charactersPool[randomIndex];
        }

        return password;
    }

    function passwordsAppearance() {
        savedPasswords.innerHTML = '';

        if (passwords.length === 0) {
            savedPasswords.innerHTML = '<p>No passwords saved yet.</p>';
            return;
        }

        // Keep only the last 10 passwords
        if (passwords.length > 10) passwords.pop();

        passwords.forEach((p, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <span class="counter-num">${index + 1}</span> 
                <span class="password-text">${escapeHTML(p)}</span>
                <span class="copy-btn">copy</span>
            `;

            copyBtnHandler(div, '.copy-btn', p);

            savedPasswords.appendChild(div);
        });
    }

    function copyBtnHandler(parent, copyChildClass, copyText) {
        const copyBtn = parent.querySelector(copyChildClass);
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyToClipboard(copyText);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'copy';
                }, 1000);
            });
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            setTimeout(() => {
                showAndHideCopyDialogMessage('Password copied to clipboard!');
            }, 100);
        }).catch(() => {
            setTimeout(() => {
                showAndHideCopyDialogMessage('Password copied to clipboard!');
            }, 100);
        });
    }

    // ======================
    // Dialog Functions
    // ======================
    function showCopyDialogMessage(message) {
        if (!copyDialog) return;
        copyDialog.querySelector('p').textContent = message;
        copyDialog.setAttribute('open', 'true');
    }

    function clearCopyDialog() {
        if (copyDialog?.hasAttribute('open')) {
            copyDialog.removeAttribute('open');
        }
    }

    function showDialogMessage(message) {
        if (!dialog) return;
        dialog.querySelector('p').textContent = message;
        dialog.setAttribute('open', 'true');
    };

    function clearDialog() {
        if (dialog?.hasAttribute('open')) {
            dialog.removeAttribute('open');
        }
    };

    function showAndHideDialogMessage(message) {
        showDialogMessage(message);
        setTimeout(() => {
            clearDialog();
        }, 1000);
    }

    function showAndHideCopyDialogMessage(message) {
        showCopyDialogMessage(message);
        setTimeout(() => {
            clearCopyDialog();
        }, 3000);
    }

    // ======================
    // ESCAPE HTML SYMBOLS IN A STRING
    // ======================
    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ======================
    // Initialization
    // ======================
    passwordsAppearance();
});