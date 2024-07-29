document.querySelectorAll('.outer-span').forEach(span => {
    span.addEventListener('mouseenter', () => {
        span.classList.add('active-outer-span');
    });
    span.addEventListener('mouseleave', () => {
        span.classList.remove('active-outer-span');
    });
});

let allSpans = document.querySelectorAll('.outer-span');

document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('last-span')) {
        allSpans.forEach(span => {
            span.classList.add('active-outer-span');
        });
    }
});

document.querySelector('.last-span').addEventListener('mouseleave', () => {
    allSpans.forEach(span => {
        span.classList.remove('active-outer-span');
    });
});
