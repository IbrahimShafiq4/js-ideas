document.querySelectorAll('a').forEach(link => {
    link.innerHTML = link.innerHTML.split('').map((letter, i) => {
        if (letter === ' ') {
            return ' '
        } else {
            return `<span style="transition-delay: ${i * 50}ms"> ${letter} </span>`
        }
    }).join('')
})