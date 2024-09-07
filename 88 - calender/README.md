### إيه هو `toLocaleString()`؟

ده ميثود (دالة) في الجافا سكريبت بنستخدمه عشان نحول التاريخ أو الرقم لسترينج (نص) بناءً على اللغة (locale) والمنطقة اللي بنحددها. بمعنى، لو عايز تعرض التاريخ أو الأرقام بشكل مناسب للغة معينة (زي العربي أو الإنجليزي) أو حتى طريقة تنسيق مختلفة، بنستخدم `toLocaleString()`.

### مثال بسيط:

```javascript
const date = new Date();
console.log(date.toLocaleString("en-US")); // "9/7/2024, 12:00:00 AM"
console.log(date.toLocaleString("ar-EG")); // "٧‏/٩‏/٢٠٢٤ ١٢:٠٠:٠٠ ص"
```

في المثال ده، بنعرض التاريخ مرتين:

- مرة بصيغة اللغة الإنجليزية في الولايات المتحدة (`en-US`).
- مرة بصيغة اللغة العربية في مصر (`ar-EG`).

### استخدام Options لتنسيق التاريخ:

ممكن نحدد إيه بالضبط اللي إحنا عايزين نعرضه من التاريخ باستخدام الـ options.

#### مثال: عرض اسم الشهر والسنة بس

```javascript
const date = new Date();
console.log(date.toLocaleString("en", { month: "long", year: "numeric" }));
// "September 2024"
```

هنا استخدمنا:

- `month: 'long'` عشان نعرض اسم الشهر بالكامل.
- `year: 'numeric'` عشان نعرض السنة.

#### مثال: عرض اليوم والشهر والسنة

```javascript
const date = new Date();
console.log(
  date.toLocaleString("en", { day: "2-digit", month: "long", year: "numeric" })
);
// "07 September 2024"
```

هنا:

- `day: '2-digit'` بيعرض اليوم كرقم من خانتين (مثلاً "07" بدل "7").
- `month: 'long'` بيعرض الشهر كاسم طويل.
- `year: 'numeric'` بيعرض السنة.

### عرض الوقت بالتنسيق المناسب:

ممكن كمان نعرض الوقت بشكل مخصص.

#### مثال: عرض الساعة والدقيقة والثانية

```javascript
const date = new Date();
console.log(
  date.toLocaleString("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
);
// "12:00:00 AM"
```

هنا:

- `hour: '2-digit'` بيعرض الساعة كرقم من خانتين.
- `minute: '2-digit'` بيعرض الدقايق كرقم من خانتين.
- `second: '2-digit'` بيعرض الثواني كرقم من خانتين.

### استخدام لغات مختلفة:

#### مثال: التاريخ والوقت بالفرنسية

```javascript
const date = new Date();
console.log(
  date.toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  })
);
// "samedi 07 septembre 2024"
```

- هنا بنستخدم اللغة الفرنسية (`fr-FR`)، وعرضنا اليوم، الشهر، السنة، واسم اليوم.

#### مثال: عرض التاريخ بالعربي

```javascript
const date = new Date();
console.log(
  date.toLocaleString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  })
);
// "السبت، ٠٧ سبتمبر ٢٠٢٤"
```

هنا:

- بنعرض التاريخ بالصيغة العربية.

### الخلاصة:

الميزة في `toLocaleString()` إنها مرنة جدًا وتقدر تتحكم في عرض التاريخ أو الوقت بناءً على اللغة اللي انت عايزها. وكمان ممكن تحدد إيه اللي يظهر بالظبط (اليوم، الشهر، السنة، الساعة...) بناءً على الخيارات اللي بتحطها.

تقدر تشوف الـ ISO كودات اللغات عشان تختار اللغة اللي تناسبك من هنا:
[ISO Language Codes](https://www.sitepoint.com/iso-2-letter-language-codes/).
