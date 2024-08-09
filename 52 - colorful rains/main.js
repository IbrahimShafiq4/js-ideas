function falling() {
    // هنا بعمل عنصر جديد من نوع div
    let divEl = document.createElement('div');
    
    // بضيف للعنصر class اسمه 'circle' علشان يديله التنسيقات المطلوب
    divEl.setAttribute('class', 'circle');
    
    // بعد كده بضيف العنصر ده للصفحة علشان يظهر فيها
    document.body.appendChild(divEl);
    
    // بحسب حجم عشوائي للعنصر عشان كل دايرة تبقى بحجم مختلف
    let size = Math.random() * 50;
    
    // بحدد عرض العنصر بحيث يكون على الأقل 5px ويزيد بالرقم العشوائي اللي حسبناه
    divEl.style.width = `${5 + size}px`;
    
    // بحدد مكان العنصر بشكل عشوائي في العرض بتاع الشاشة
    divEl.style.left = Math.random() * innerWidth + 'px';
    
    // بجيب زاوية عشوائية من 0 لـ 360 درجة لتغيير اللون
    let angle = Math.random() * 360;

    // بضيف للعنصر تأثير ضوء أخضر حوالين الدائرة
    divEl.style.boxShadow = '0 0 20px #0f0'
    
    // بغير لون الدائرة باستخدام الفلتر hue-rotate بزاوية عشوائية
    divEl.style.filter = `hue-rotate(${angle}deg)`;

    // بعد 10 ثواني بشيل العنصر من الصفحة علشان مايتراكمش
    setTimeout(() => {
        document.body.removeChild(divEl)
    }, 10000)
}

// بكرر عملية إنشاء الدوائر كل 200 ملي ثانية
setInterval(() => {
    falling()
}, 200)
