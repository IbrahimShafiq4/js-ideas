(() => {
    const form = document.querySelector('form');
    const inputsData = ['Loan Amount $', 'Interest Rate %', 'Loan Duration (months)'];

    for (let i = 0; i < inputsData.length; i++) {
        const inputsDetails = document.createElement('div');
        inputsDetails.classList.add('input-data');

        const input = document.createElement('input');
        input.setAttribute('id', i);
        input.setAttribute('type', 'number');
        input.setAttribute('placeholder', inputsData[i]);

        if (i === 0) {
            input.setAttribute('min', '1');
            input.setAttribute('max', '500000');
            input.setAttribute('value', '10000');
        } else if (i === 1) {
            input.setAttribute('min', '0');
            input.setAttribute('max', '100');
            input.setAttribute('step', '0.1');
        } else if (i === 2) {
            input.setAttribute('min', '6');
            input.setAttribute('max', '48');
            input.setAttribute('value', '12');
        }

        const label = document.createElement('label');
        label.setAttribute('for', i);
        label.textContent = inputsData[i];

        inputsDetails.appendChild(label);
        inputsDetails.appendChild(input);
        form.appendChild(inputsDetails);
    }

    const calculateLoan = () => {
        const loanAmount = parseFloat(document.getElementById('0').value);
        const annualInterestRate = parseFloat(document.getElementById('1').value);
        const loanDurationMonths = parseFloat(document.getElementById('2').value);

        if (isNaN(loanAmount) || isNaN(annualInterestRate) || isNaN(loanDurationMonths)) {
            return "Invalid input";
        }

        const monthlyInterestRate = (annualInterestRate / 100) / 12;
        const monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanDurationMonths)) /
            (Math.pow(1 + monthlyInterestRate, loanDurationMonths) - 1);

        return monthlyPayment.toFixed(2);
    };

    const inputs = document.querySelectorAll('input');
    inputs.forEach(() => {
        form.addEventListener('input', () => {
            if (inputs[0].value && inputs[1].value && inputs[2].value) {
                const result = calculateLoan();
                document.getElementById('result').innerText = `Monthly Payment: $${result}`;
            }
        });
    });

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-data');
    resultDiv.setAttribute('id', 'result');
    form.appendChild(resultDiv);
})();