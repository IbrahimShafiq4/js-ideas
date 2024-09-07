const anchor = document.querySelector('.btn');
anchor.addEventListener('mouseover', (e) => {
    console.log('move')
    console.log(e)
    let xPosition = e.pageX - anchor.offsetLeft;
    let yPosition = e.pageY - anchor.offsetTop;
    
    anchor.style.setProperty('--x', `${xPosition}px`);
    anchor.style.setProperty('--y', `${yPosition}px`);
})