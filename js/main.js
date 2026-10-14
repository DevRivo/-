/* ========================================
   مجتمع الفنون
   الوظائف المشتركة لجميع الصفحات
   الملف: js/main.js
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       1. قائمة الموبايل والتابلت
       ======================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "إغلاق القائمة" : "فتح القائمة"
            );

        });

        // إغلاق القائمة بعد اختيار صفحة

        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "فتح القائمة"
                );

            });

        });

        // إغلاق القائمة عند الضغط خارجها

        document.addEventListener("click", function (event) {

            const clickedInsideMenu =
                mainNav.contains(event.target);

            const clickedToggle =
                menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {

                mainNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "فتح القائمة"
                );

            }

        });

    }


    /* ========================================
       2. تحديد الصفحة الحالية في القائمة
       ======================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const allNavLinks =
        document.querySelectorAll(".main-nav .nav-link");

    allNavLinks.forEach(function (link) {

        const linkPage = new URL(
            link.href,
            window.location.href
        ).pathname.split("/").pop();

        if (linkPage === currentPage) {

            link.classList.add("active");

            link.setAttribute("aria-current", "page");

        } else {

            link.classList.remove("active");

            link.removeAttribute("aria-current");

        }

    });


    /* ========================================
       3. تحديث سنة حقوق النشر
       يعمل عند إضافة العنصر إلى الصفحة
       ======================================== */

    const yearElements =
        document.querySelectorAll("[data-current-year]");

    yearElements.forEach(function (element) {

        element.textContent = new Date().getFullYear();

    });


    /* ========================================
       4. رسائل بسيطة قابلة لإعادة الاستخدام
       ======================================== */

    window.ArtCommunity = window.ArtCommunity || {};

    window.ArtCommunity.showMessage = function (
        element,
        message,
        type = "info"
    ) {

        if (!element) {
            return;
        }

        element.textContent = message;

        element.classList.remove(
            "message-success",
            "message-error",
            "message-info"
        );

        element.classList.add("message");

        const allowedTypes = [
            "success",
            "error",
            "info"
        ];

        if (!allowedTypes.includes(type)) {
            type = "info";
        }

        element.classList.add("message-" + type);

        element.hidden = false;

    };


    /* ========================================
       5. أدوات مساعدة لتنسيق النصوص
       ======================================== */

    window.ArtCommunity.formatNumber = function (number) {

        const value = Number(number);

        if (!Number.isFinite(value)) {
            return "٠";
        }

        return new Intl.NumberFormat("ar-EG").format(value);

    };


    /* ========================================
       6. التحقق من الاتصال بالإنترنت
       ======================================== */

    window.ArtCommunity.isOnline = function () {

        return navigator.onLine;

    };

    window.addEventListener("online", function () {

        document.documentElement.classList.remove("offline");

    });

    window.addEventListener("offline", function () {

        document.documentElement.classList.add("offline");

    });

    if (!navigator.onLine) {

        document.documentElement.classList.add("offline");

    }

});
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "إغلاق القائمة" : "فتح القائمة"
        );
    });
}
