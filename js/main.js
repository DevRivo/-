// ملف الجافاسكريبت المشترك بين صفحات مجتمع الفنون

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  // فتح وإغلاق قائمة التنقل
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // إغلاق القائمة بعد الضغط على رابط
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // إغلاق القائمة بزر Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    // إغلاق القائمة عند تكبير الشاشة
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
});
