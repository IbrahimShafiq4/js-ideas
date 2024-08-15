// بنجيب كل الأزرار اللي عندها الكلاس .btn من الصفحة
let buttons = document.querySelectorAll('.btn');

// بنعمل Loop على كل زرار من الأزرار اللي جبناها
buttons.forEach(button => {
    
    // بنخزن النص اللي مكتوب جوه الزرار في متغير اسمه textBtn
    let textBtn = button.innerHTML;
    
    // بنفضي محتوى الزرار عشان نبدأ نحط كل حرف في سبان لوحده
    button.innerHTML = '';
    
    // بنعمل Loop على كل حرف في النص اللي كان جوه الزرار
    for (const char of textBtn) {
        
        // بنعمل عنصر span جديد
        let span = document.createElement('span');
        
        // بنحط الحرف جوه الـ span، لو الحرف كان مسافة بنحط بدلها مسافة غير قابلة للكسر
        span.textContent = char === ' ' ? '\u00A0' : char;
        
        // بنضيف الـ span اللي عملناه جوا الزرار
        button.appendChild(span);
    }

    // بنجيب كل الـ spans اللي جوه الزرار اللي بنشتغل عليه دلوقتي
    let spans = button.querySelectorAll('span');

    // بنضيف حدث لما نمرر الماوس فوق الزرار
    button.addEventListener('mouseenter', () => {
        
        // بنعمل Loop على كل span جواه
        spans.forEach((span, index) => {
            
            // بنضيف الكلاس "hover" لكل span بترتيب، كل واحدة بعد التانية بفارق 50 ميلي ثانية
            setTimeout(() => {
                span.classList.add('hover');
            }, index * 50);
        });
    });

    // بنضيف حدث لما نرفع الماوس من فوق الزرار
    button.addEventListener('mouseleave', () => {
        
        // بنعمل Loop على كل span جواه
        spans.forEach((span, index) => {
            
            // بنشيل الكلاس "hover" من كل span بترتيب، كل واحدة بعد التانية بفارق 50 ميلي ثانية
            setTimeout(() => {
                span.classList.remove('hover');
            }, index * 50);
        });
    });
});