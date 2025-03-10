document.addEventListener("DOMContentLoaded", function () {
    const languageSwitcher = document.getElementById("languageSwitcher");
    const resources = {
        en: {
            translation: {
                "welcome": "Welcome",
                "description": "This is a multilingual website.",
                "contact_us": "Contact Us"
            }
        },
        ar: {
            translation: {
                "welcome": "مرحبًا",
                "description": "هذا موقع متعدد اللغات.",
                "contact_us": "اتصل بنا"
            }
        }
    };

    i18next.init({
        lng: localStorage.getItem("lang") || "en",
        resources
    }, function (err, t) {
        updateContent();
    });

    languageSwitcher.addEventListener("change", function () {
        const selectedLang = languageSwitcher.value;
        localStorage.setItem("lang", selectedLang);
        i18next.changeLanguage(selectedLang, updateContent);
        console.log(languageSwitcher.value)
    });

    function updateContent() {
        document.documentElement.dir = i18next.language === "ar" ? "rtl" : "ltr";
        languageSwitcher.value = localStorage.getItem('lang');

        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            element.textContent = i18next.t(key);
        });
    }
});
