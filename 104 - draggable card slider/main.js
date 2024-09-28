const wrapper = document.querySelector('.wrapper');
const carousel = document.querySelector('.carousel');
const arrowBtns = document.querySelectorAll('.wrapper i');
const firstCardWidth = carousel.querySelector('.card').offsetWidth;
const carouselChildren = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;
let cardsPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Clone and append the last few cards to the start for infinite scrolling
carouselChildren.slice(-cardsPerView).reverse().forEach(card => {
    carousel.insertAdjacentElement('afterbegin', card.cloneNode(true));
});

// Clone and append the first few cards to the end for infinite scrolling
carouselChildren.slice(0, cardsPerView).forEach(card => {
    carousel.insertAdjacentElement('beforeend', card.cloneNode(true));
});

// Handle arrow button clicks
arrowBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        carousel.scrollLeft += btn.id === 'left' ? -firstCardWidth : firstCardWidth;
    });
});

// Dragging functionality
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add('dragging');
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove('dragging');
};

// Autoplay functionality
const autoPlay = () => {
    if (window.innerWidth < 800) return;
    timeoutId = setTimeout(() => {
        carousel.scrollLeft += firstCardWidth;
    }, 2500);
};

// Infinite scroll handling
const infiniteScroll = () => {
    const atStart = carousel.scrollLeft === 0;
    const atEnd = Math.ceil(carousel.scrollLeft) >= carousel.scrollWidth - carousel.offsetWidth;

    if (atStart) {
        carousel.classList.add('no-transition');
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove('no-transition');
    } else if (atEnd) {
        carousel.classList.add('no-transition');
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove('no-transition');
    }

    clearTimeout(timeoutId);
    if (!wrapper.matches(':hover')) autoPlay();
};

// Debounce function to avoid excessive event triggers
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

// Add event listeners
carousel.addEventListener('mousedown', dragStart);
carousel.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', dragStop);
carousel.addEventListener('scroll', debounce(infiniteScroll, 100)); // Debounce scroll for better performance
wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
wrapper.addEventListener('mouseleave', autoPlay);

// Initialize autoplay
autoPlay();