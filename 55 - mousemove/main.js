document.addEventListener('DOMContentLoaded', () => {
    // هنا بنجيب العنصر اللي هو ".cursor" من الـ DOM
    let cursor = document.querySelector('.cursor');
    // بنكتب النص اللي عايزينه يظهر
    let textContent = 'Ibrahim Shafiq FE-Developer';

    // بنعمل لوب عشان نقطع النص دا لكل حرف ونحطه في سبان
    for (let i = 0; i < textContent.length; i++) {
        let span = document.createElement('span'); // بنعمل عنصر سبان
        span.classList.add('text'); // بنضيف كلاس "text" للسبان
        span.style.setProperty('--i', i); // بنحدد قيمة للمتغير --i لكل حرف عشان ممكن نستخدمه ف الـ CSS
        span.textContent = textContent[i]; // بنضيف الحرف للسبان
        cursor.appendChild(span); // بنضيف السبان دا لجوا العنصر اللي هو ".cursor"
    }

    // هنا بنعمل event listener عشان يتابع حركة الماوس
    document.addEventListener('mousemove', (e) => {
        // باستخدام GSAP بنعمل حركة لكل سبان باستخدام الـ X و Y الخاصة بالماوس
        gsap.to('.text', {
            x: e.clientX, // مكان الماوس في X
            y: e.clientY, // مكان الماوس في Y
            stagger: 0.05 // دا عشان كل سبان يتحرك بعد اللي قبله بشوية
        })
    })
})
