const container = document.querySelector('.container');
for(var i = 1; i <= 200; i++) {
    const blocks = document.createElement('div');
    blocks.classList.add('block');
    container.appendChild(blocks);
}

function generate() {
    anime({
        targets: '.block',
        translateX: function() {
            return anime.random(-1000, 1000)
        },
        
        translateY: function() {
            return anime.random(-1000, 1000)
        },

        scale: function() {
            return anime.random(1,5)
        },

        opacity: function() {
            return anime.random(Math.random(), Math.random(), 1)
        }
    })
}
