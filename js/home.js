/* ========================================
   مجتمع الفنون
   وظائف الصفحة الرئيسية
   الملف: js/home.js
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       1. الانتقال السلس بين أقسام الصفحة
       ======================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* ========================================
       2. إظهار تأثير بسيط عند ظهور الأقسام
       ======================================== */

    const sections = document.querySelectorAll(
        ".about-section, " +
        ".art-types-section, " +
        ".how-section, " +
        ".siraj-section, " +
        ".story-section, " +
        ".join-section"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("section-visible");

                        sectionObserver.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.08
            }
        );

        sections.forEach(function (section) {

            sectionObserver.observe(section);

        });

    } else {

        sections.forEach(function (section) {

            section.classList.add("section-visible");

        });

    }


    /* ========================================
       3. منع تكرار الضغط على الروابط
       من غير تعطيل التنقل الطبيعي
       ======================================== */

    const actionLinks = document.querySelectorAll(
        ".hero-actions a, " +
        ".section-bottom-action a, " +
        ".siraj-content a, " +
        ".join-section a"
    );

    actionLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            link.setAttribute("aria-busy", "true");

            window.setTimeout(function () {

                link.removeAttribute("aria-busy");

            }, 700);

        });

    });


    /* ========================================
       4. دعم عرض الصفحة عند فتح رابط لقسم
       ======================================== */

    function showLinkedSection() {

        const hash = window.location.hash;

        if (!hash) {
            return;
        }

        const target = document.getElementById(
            decodeURIComponent(hash.slice(1))
        );

        if (target) {

            window.setTimeout(function () {

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);

        }

    }

    showLinkedSection();

    window.addEventListener("hashchange", showLinkedSection);


    /* ========================================
       5. تجهيز رسالة ترحيب قابلة للاستخدام
       عند إضافة عنصر الترحيب للصفحة
       ======================================== */

    const welcomeElement = document.getElementById(
        "homeWelcomeMessage"
    );

    if (welcomeElement) {

        welcomeElement.textContent =
            "أهلًا بك في مجتمع الفنون، مساحة تجمع محبي الإبداع.";

        welcomeElement.hidden = false;

    }

});
