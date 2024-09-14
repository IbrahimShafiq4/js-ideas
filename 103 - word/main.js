const boldBtn = document.getElementById('bold');
const italicBtn = document.getElementById('italic');
const underlineBtn = document.getElementById('underline');
const alignLeftBtn = document.getElementById('align-left');
const alignCenterBtn = document.getElementById('align-center');
const alignRightBtn = document.getElementById('align-right');
const textArea = document.getElementById('editor');

boldBtn.addEventListener('click', () => {
    document.execCommand('bold');
});

italicBtn.addEventListener('click', () => {
    document.execCommand('italic');
});

underlineBtn.addEventListener('click', () => {
    document.execCommand('underline');
});

alignLeftBtn.addEventListener('click', () => {
    document.execCommand('justifyLeft');
});

alignCenterBtn.addEventListener('click', () => {
    document.execCommand('justifyCenter');
});

alignRightBtn.addEventListener('click', () => {
    document.execCommand('justifyRight');
});
