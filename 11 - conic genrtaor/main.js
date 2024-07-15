const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D', '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC', '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399','#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933','#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
const segments = [];

const pie = document.querySelector('.pie');
const values = document.querySelector('.values');
const code = document.querySelector('code');

start();

function getNewColor() {
    let OK = false;
    let thisColor = '';
    while (!OK) {
        OK = true;
        thisColor = colorArray[Math.floor(Math.random() * colorArray.length)];
        segments.forEach(segment => {
            if (segment.color === thisColor) {
                OK = false;
            }
        });
    }
    return thisColor;
}

function createNewSegment() {
    const min = 10;
    const max = 100;
    const thisSegments = {
        color: getNewColor(),
        value: min + Math.floor(Math.random() * (max-min))
    }
    segments.push(thisSegments);
}

function start() {
    const initCount = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < initCount; i++) {
        createNewSegment();
    }
    drawValues();
    drawPie();
}

function drawValues() {

    values.innerHTML = '';
    pie.innerHTML = '';

    segments.forEach((segment, ix) => {
        const valueDiv = document.createElement('div');
        valueDiv.classList = 'value';
        valueDiv.style.backgroundColor = segment.color;
        valueDiv.innerHTML = `
            <input type="number" min="1" step="1" class="value_input" value="${segment.value}" oninput="setNewValue(${ix}, this.value)">
            <button class="value_button">
                <input class="value_color" type="color" value="${segment.color}" oninput="setColor(${ix}, this)">
                <i class="fas fa-paint-brush"></i>
            </button>
            <button class="value_button" onclick="removeSegment(${ix})" ${segments.length > 2 ? '' : 'disabled="true"'}"><i class="fas fa-times"></i></button>
        `;
        values.appendChild(valueDiv);

        const dial = document.createElement('div');
        dial.classList = 'pie_dial';
        pie.appendChild(dial);
    });

    const valueDiv = document.createElement('div');
    valueDiv.classList = 'value clickable';
    valueDiv.style.backgroundColor = "#777";
    valueDiv.innerHTML = `
        <button class="value_button"><i class="fas fa-plus"></i></button>
        <div class="value_addText">Add segment</div>
    `;
    valueDiv.onclick = () => { createNewSegment(); drawValues(); drawPie(); }
    values.appendChild(valueDiv);
}

function drawPie() {

    const dials = document.querySelectorAll('.pie_dial');
    let total = 0;

    segments.forEach(segment => {
        total += segment.value;
    });

    let lastDeg = 0;
    let conic = '';
    let codeText = '';

    segments.forEach((segment, ix) => {
        const thisDeg = (segment.value * 360 / total) + lastDeg;
        conic += `${segment.color} ${lastDeg}deg, ${segment.color} ${thisDeg}deg, `;
        codeText += `${segment.color} ${Math.round(lastDeg * 1000) / 1000}deg, ${segment.color} ${Math.round(thisDeg * 1000) / 1000}deg, <br>`
        dials[ix].style.transform = `rotate(${thisDeg}deg)`;
        lastDeg = thisDeg;
    });

    conic = conic.substr(0, conic.length - 2);
    pie.style.backgroundImage = `
        radial-gradient(circle at 45% 55%, transparent 100px, #fff7 130px, transparent 160px),
        radial-gradient(circle at 55% 45%, transparent 100px, #0007 130px, transparent 160px),
        conic-gradient(${conic})`;

    code.innerHTML = `
        .pieChart {
            <div class="indent">
            background-image: conic-gradient (
                <div class="indent">
                    ${codeText.substr(0, codeText.length - 6)}
                </div>
                );
            </div>
        }`;
}

function setNewValue(ix, value) {
    segments[ix].value = Number(value);
    drawPie();
}

function setColor(ix, input) {
    segments[ix].color = input.value;
    input.parentElement.parentElement.style.backgroundColor = input.value;
    drawPie();
}

function removeSegment(ix) {
    if (segments.length < 3) {
        return false;
    }
    segments.splice(ix, 1);
    drawValues();
    drawPie();
}