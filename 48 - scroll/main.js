// بنختار أول عنصر في الصفحة عنده الكلاس 'text'
let textEl = document.querySelector('.text');

// بنجيب النص اللي جواه العنصر اللي اخترناه
let textContent = textEl.textContent;

// بنفضي المحتوى الداخلي للعنصر اللي اخترناه
textEl.innerHTML = '';

// بنعمل مصفوفة فاضية عشان نحط فيها العناصر اللي هنعملها بعد كده
let spans = [];

// بنعدي على كل حرف في النص اللي جبناه
for (let char of textContent) {
    // بنعمل عنصر سبان جديد
    let span = document.createElement('span');
    
    // بنحط الحرف الحالي جوا السبان الجديد
    span.textContent = char;
    
    // بنضيف السبان الجديد للعنصر اللي اخترناه
    textEl.appendChild(span);
    
    // بنضيف السبان ده للمصفوفة بتاعتنا
    spans.push(span);
}

// Add an event listener for the 'scroll' event on the window
window.addEventListener('scroll', () => {
    // بنجيب المسافة اللي تم سكرولها من أعلى الصفحة
    let scrollDistance = window.scrollY;
    
    // بنعدي على كل عنصر سبان في المصفوفة
    spans.forEach((span, index) => {
        // لو المسافة اللي اتعملها سكرول أكبر أو تساوي قيمة معينة
        if (scrollDistance >= (index + 1) * 50) {
            // بنحرك السبان أفقيًا بناءً على رقمه
            span.style.transform = `translate(${index * 20}px, 0)`;
            
            // بنضيف كلاس 'active' للسبان
            span.classList.add('active');
        } else {
            // بنحرك السبان لمكان عشوائي جوا الشاشة
            span.style.transform = `translate(${Math.random() * 100 - 50}vw, ${Math.random() * 100 - 50}vh)`;
            
            // بنشيل كلاس 'active' من السبان
            span.classList.remove('active');
        }
    });
});


// Dispatch a 'scroll' event to the window to initialize the effect
window.dispatchEvent(new Event('scroll'));
