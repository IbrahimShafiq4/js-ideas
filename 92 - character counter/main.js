const totalCharacters = document.querySelector('.total-chars');
const reminingChars = document.querySelector('.remining-chars');
const textArea = document.querySelector('textarea');
reminingChars.textContent = textArea.getAttribute('maxlength');

textArea.addEventListener('input', () => {
    totalCharacters.textContent = textArea.value.length;
    reminingChars.textContent = textArea.getAttribute('maxlength') - textArea.value.length;

})