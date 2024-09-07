// هنا بنجيب العناصر من الـ HTML باستخدام الـ id بتاع كل عنصر عشان نستخدمهم
const monthName = document.getElementById('month-name');  // ده العنصر اللي هيعرض اسم الشهر
const dayName = document.getElementById('day-name');      // ده العنصر اللي هيعرض اسم اليوم
const dayNum = document.getElementById('day-number');     // ده العنصر اللي هيعرض رقم اليوم
const year = document.getElementById('year');             // ده العنصر اللي هيعرض السنة

// بنجيب التاريخ الحالي باستخدام كائن الـ Date
const date = new Date();

// هنا بنعرض اسم الشهر الحالي في العنصر monthName
// بنستخدم toLocaleString عشان نجيب اسم الشهر بصيغة نص طويل (زي "January")
monthName.innerText = date.toLocaleString('en', { month: 'long' });

// هنا بنعرض اسم اليوم الحالي في العنصر dayName
// بنستخدم toLocaleDateString عشان نجيب اسم اليوم بصيغة نص طويل (زي "Saturday")
dayName.innerText = date.toLocaleDateString('en', { weekday: 'long' });

// هنا بنعرض رقم اليوم في العنصر dayNum
// بنستخدم toLocaleString عشان نجيب اليوم برقم من خانتين (زي "07")
dayNum.innerText = date.toLocaleString('en', { day: '2-digit' });

// هنا بنعرض السنة الحالية في العنصر year
// برضه بنستخدم toLocaleString عشان نجيب السنة بصيغة رقم (زي "2024")
year.innerText = date.toLocaleString('en', { year: 'numeric' });

// اللينك ده بيديك كودات اللغة لو حبيت تغير اللغة في toLocaleString أو toLocaleDateString
// https://www.sitepoint.com/iso-2-letter-language-codes/
