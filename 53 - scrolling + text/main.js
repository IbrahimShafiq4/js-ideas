let textEl = document.querySelector('.text'); // هنا بنجيب العنصر اللي عنده الكلاس "text"
let textContentData = textEl.textContent; // هنا بنخزن النص اللي جوه العنصر في متغير
textEl.innerHTML = ''; // هنا بنفضي المحتوى اللي جوه العنصر

for (let char of textContentData) { 
    // هنا بنلف على كل حرف في النص
    let span = document.createElement('span'); // بنخلق عنصر جديد من نوع "span"
    span.textContent = char; // بنحط الحرف جوه العنصر اللي لسه عملناه
    textEl.appendChild(span); // بنضيف العنصر "span" الجديد ده كطفل للعنصر اللي فيه الكلاس "text"
}

let spans = document.querySelectorAll('span'); // هنا بنجيب كل عناصر الـ "span" اللي لسه ضفناها
window.addEventListener('scroll', (e) => { 
    // بنسمع حدث "السكرول" اللي بيحصل في الويندو
    let scrollPosition = window.scrollY; // هنا بنجيب قيمة السكرول الراسية (Y) يعني قد ايه المستخدم سكرول تحت
    spans.forEach((span, index) => { 
        // هنا بنلف على كل عنصر من عناصر "span" اللي جبناها
        if (scrollPosition >= (index + 1) * 10) { 
            // لو السكرول وصل لمستوى معين بنحسبه على حسب ترتيب الحرف
            span.classList.add('active'); // نضيف كلاس "active" للعنصر "span"
        } else { 
            // لو السكرول مبقاش في المستوى ده
            span.classList.remove('active'); // نشيل كلاس "active" من العنصر "span"
        }
    });
});
