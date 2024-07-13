let rangeBtn = document.querySelector('.range-btn');
let rangeNum = document.querySelector(".range-num");
let resultInput = document.querySelector('.result-input');
let copyBtn = document.querySelector('.copy-btn');
let generateBtn = document.querySelector('.generate-btn');
let alertBx = document.querySelector('.alert');
let alertContent = document.querySelector('.alert p');

let uppercaseCheckbox = document.querySelector('#uppercase');
let lowercaseCheckbox = document.querySelector('#lowercase');
let numbersCheckbox = document.querySelector('#numbers');
let symbolsCheckbox = document.querySelector('#symbols');

let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let lowercase = 'abcdefghijklmnopqrstuvwxyz';
let numbers = '1234567890';
let symbols = '!@#$%^&*()_+=';

rangeBtn.addEventListener('input', (event) => {
    rangeNum.innerHTML = event.target.value;
});

generateBtn.addEventListener('click', () => {
    let alphabets = '';
    let generatedPassword = resultInput.value;

    alphabets += uppercaseCheckbox.checked ? uppercase : '';
    alphabets += lowercaseCheckbox.checked ? lowercase : '';
    alphabets += numbersCheckbox.checked ? numbers : '';
    alphabets += symbolsCheckbox.checked ? symbols : '';

    if (alphabets === '') {
        alertBx.classList.add('active');
        alertContent.innerHTML = 'Please Select One Checkbox';
    } else {
        do {
            generatedPassword = generatePassword(alphabets, rangeBtn.value, generatedPassword.length);
        } while (!isValidPassword(generatedPassword));

        resultInput.value = generatedPassword;
        logCheckedParents();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('alert')) {
        alertBx.classList.remove('active');
    }
});

resultInput.addEventListener('input', () => {
    updateCheckboxesAndStyles(resultInput.value);
});

function generatePassword(alphabets, length, existingLength) {
    let password = resultInput.value;
    for (let i = existingLength; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * alphabets.length);
        password += alphabets[randomIndex];
    }
    return password;
}

function isValidPassword(password) {
    let hasUppercase = uppercaseCheckbox.checked ? /[A-Z]/.test(password) : true;
    let hasLowercase = lowercaseCheckbox.checked ? /[a-z]/.test(password) : true;
    let hasNumbers = numbersCheckbox.checked ? /[0-9]/.test(password) : true;
    let hasSymbols = symbolsCheckbox.checked ? /[!@#$%^&*()]/.test(password) : true;

    return hasUppercase || hasLowercase || hasNumbers || hasSymbols;
}

function logCheckedParents() {
    let checkboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.parentElement.style.textDecoration = 'line-through';
            checkbox.nextElementSibling.style.color = '#f00';
        } else {
            checkbox.parentElement.style.textDecoration = 'none';
            checkbox.nextElementSibling.style.color = '#fff';
        }
    });
}

function updateCheckboxesAndStyles(value) {
    let checkboxes = [
        { checkbox: uppercaseCheckbox, regex: /[A-Z]/ },
        { checkbox: lowercaseCheckbox, regex: /[a-z]/ },
        { checkbox: numbersCheckbox, regex: /[0-9]/ },
        { checkbox: symbolsCheckbox, regex: /[!@#$%^&*()_=+]/ }
    ];

    checkboxes.forEach(item => {
        if (item.regex.test(value)) {
            item.checkbox.checked = true;
            item.checkbox.parentElement.style.textDecoration = 'line-through';
            item.checkbox.nextElementSibling.style.color = '#f00';
        } else {
            item.checkbox.checked = false;
            item.checkbox.parentElement.style.textDecoration = 'none';
            item.checkbox.nextElementSibling.style.color = 'initial';
        }
    });
}

copyBtn.addEventListener('click', () => {
    if (resultInput.value.length == 0) {
        alertBx.classList.add('active');
        alertContent.innerHTML = 'Please click on Generate Password Button';
    } else {
        resultInput.select();
        resultInput.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(resultInput.value);
    }
});
