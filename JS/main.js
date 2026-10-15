// ========== انتظار تحميل الصفحة ==========
document.addEventListener("DOMContentLoaded", function () {

  // ========== قائمة التنقل في الهاتف والتابلت ==========
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");

  // لو الزر أو القائمة مش موجودين، منعملش حاجة
  if (menuToggle && mainNav) {

    // دالة بتفتح القائمة
    function openMenu() {
      mainNav.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "إغلاق القائمة");
    }

    // دالة بتقفل القائمة
    function closeMenu() {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "فتح القائمة");
    }

    // الحالة الأولية: القائمة مقفولة
    closeMenu();

    // الضغط على الزر يفتح أو يقفل القائمة
    menuToggle.addEventListener("click", function () {
      if (mainNav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // الضغط على أي رابط داخل القائمة يقفلها
    // (الرابط نفسه بيروح للصفحة بشكل طبيعي من href)
    var navLinks = mainNav.querySelectorAll("a");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", closeMenu);
    }

    // الضغط على زر Esc يقفل القائمة
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

});
