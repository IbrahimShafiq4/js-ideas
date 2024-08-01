const allTrafficLights = document.querySelectorAll('.light');
let currentIndex = 0;
const trafficText = document.querySelector('p');

function updateTrafficLights() {
    allTrafficLights.forEach((light, index) => {
        if (index === currentIndex) {
            if (index === 0) {
                light.style.backgroundColor = '#ff3822';
                light.style.boxShadow = `
                    inset 5px 5px 5px rgba(255, 255, 255, 0.5),
                    inset -5px -5px 5px rgba(255, 255, 255, 0.5),
                    0 0 60px 10px #ff3822
                `;
                trafficText.innerHTML = 'Ready';
            } else if (index === 1) {
                light.style.backgroundColor = '#eeff03';
                light.style.boxShadow = `
                    inset 5px 5px 5px rgba(255, 255, 255, 0.5),
                    inset -5px -5px 5px rgba(255, 255, 255, 0.5),
                    0 0 60px 10px #eeff03
                `;
                trafficText.innerHTML = 'Steady';
            } else if (index === 2) {
                light.style.backgroundColor = '#06ff59';
                light.style.boxShadow = `
                    inset 5px 5px 5px rgba(255, 255, 255, 0.5),
                    inset -5px -5px 5px rgba(255, 255, 255, 0.5),
                    0 0 60px 10px #06ff59
                `;
                trafficText.innerHTML = 'Go';
            }
        } else {
            light.style.backgroundColor = 'transparent';
            light.style.boxShadow = `
                inset -5px -5px 5px rgba(255, 255, 255, 0.8),
                inset 5px 5px 5px rgba(255, 255, 255, 0.5)
            `;
        }
    });

    currentIndex = (currentIndex + 1) % allTrafficLights.length;
}

setInterval(updateTrafficLights, 2000);
