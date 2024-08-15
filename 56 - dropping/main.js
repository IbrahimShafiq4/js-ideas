function dropping() {
    let box = document.querySelector(".box"); // هنا بجيب العنصر اللي اسمه .box من ال HTML
    let divEl = document.createElement("div"); // بعمل عنصر div جديد في الذاكرة
    divEl.setAttribute("class", "drops"); // بضيف للعنصر ده كلاس اسمه drops عشان ياخد الستايل بتاعه

    box.appendChild(divEl); // بدخل العنصر الجديد ده كـ child لـ .box

    let size = Math.random() * 100; // بحدد حجم العُنصر بشكل عشوائي
    divEl.style.width = `${15 + size}px`; // بحدد عرض العنصر على أساس الحجم اللي حددته
    let boxWidth = box.clientWidth; // بجيب عرض العنصر box

    divEl.style.left = Math.random() * boxWidth + 'px' // بخلي العنصر يتحرك على محور الـ X بشكل عشوائي

    // بعد 5 ثواني بمسح العنصر عشان ميزودش الحمل على الصفحة
    setTimeout(() => {
        box.removeChild(divEl);
    }, 5000);
}

// هنا بعمل dropping كل 200 ملي ثانية عشان يديني التأثير بتاع نزول الكور
setInterval(() => {
    dropping();
}, 200)
