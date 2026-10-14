// تفاعلات الصفحة الرئيسية لمجتمع الفنون

document.addEventListener("DOMContentLoaded", function () {

  // ظهور الأقسام والبطاقات بحركة هادئة
  const elements = document.querySelectorAll(
    ".hero, section, .section-card, .feature-card, .category-card, .challenge-card, .drawing-card, .panel"
  );

  const style = document.createElement("style");

  style.textContent = `
    .home-reveal {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 500ms ease, transform 500ms ease;
    }

    .home-reveal.home-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .home-button-press {
      transition: transform 160ms ease, box-shadow 160ms ease;
    }

    .home-button-press:active {
      transform: translateY(2px) scale(0.98);
    }

    @media (prefers-reduced-motion: reduce) {
      .home-reveal,
      .home-button-press {
        transition: none !important;
      }

      .home-reveal {
        opacity: 1;
        transform: none;
      }
    }
  `;

  document.head.appendChild(style);

  elements.forEach(function (element, index) {
    element.classList.add("home-reveal");
    element.style.transitionDelay = (index % 5) * 60 + "ms";
  });

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(function (entries, observer) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add("home-visible");
          observer.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.12
    });

    elements.forEach(function (element) {
      observer.observe(element);
    });

  } else {

    elements.forEach(function (element) {
      element.classList.add("home-visible");
    });

  }

  // تأثير بسيط عند الضغط على الأزرار والروابط
  document.querySelectorAll("a, button").forEach(function (element) {
    element.classList.add("home-button-press");
  });

  // انتقال سلس داخل الصفحة
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

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

});
