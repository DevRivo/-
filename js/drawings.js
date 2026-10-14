/* ========================================
   صفحة الرسومات - مجتمع الفنون
======================================== */

document.addEventListener("DOMContentLoaded", function () {

    // عناصر الصفحة
    const searchInput = document.getElementById("drawingSearch");
    const categorySelect = document.getElementById("drawingCategory");
    const categoryButtons = document.querySelectorAll(".category-chip");
    const drawingsGrid = document.getElementById("drawingsGrid");
    const drawingsEmpty = document.getElementById("drawingsEmpty");
    const resultsCount = document.getElementById("resultsCount");
    const emptyTitle = document.getElementById("emptyTitle");
    const emptyMessage = document.getElementById("emptyMessage");

    // التأكد من وجود عناصر صفحة الرسومات
    if (
        !searchInput ||
        !categorySelect ||
        !drawingsGrid ||
        !drawingsEmpty ||
        !resultsCount
    ) {
        return;
    }

    /*
     * لا نضيف رسومات تجريبية.
     *
     * يمكن تمرير الرسومات الحقيقية إلى الصفحة
     * من نظام التخزين أو الخادم مستقبلًا عن طريق:
     *
     * window.ArtCommunityDrawings = [...]
     *
     * GitHub Pages وحده لا يوفر قاعدة بيانات
     * مشتركة للمستخدمين.
     */

    const drawings = Array.isArray(window.ArtCommunityDrawings)
        ? window.ArtCommunityDrawings
        : [];

    // التصنيفات المتاحة
    const categories = {
        traditional: "الرسم التقليدي",
        digital: "الرسم الرقمي",
        portrait: "البورتريه",
        anime: "الأنمي والمانجا",
        nature: "الطبيعة",
        calligraphy: "الخط العربي"
    };

    // تنسيق الأرقام باللغة العربية
    function formatNumber(number) {
        return new Intl.NumberFormat("ar-EG").format(number);
    }

    // اسم التصنيف
    function getCategoryName(category) {
        return categories[category] || "فن متنوع";
    }

    // منع ظهور بيانات فارغة
    function safeText(value, fallback = "") {
        if (typeof value !== "string") {
            return fallback;
        }

        return value.trim() || fallback;
    }

    // اختيار التصنيف الحالي
    function getSelectedCategory() {
        return categorySelect.value || "all";
    }

    // البحث عن الرسومات وتصفيتها
    function filterDrawings() {
        const searchText = searchInput.value
            .trim()
            .toLocaleLowerCase("ar");

        const selectedCategory = getSelectedCategory();

        return drawings.filter(function (drawing) {
            if (!drawing || typeof drawing !== "object") {
                return false;
            }

            const title = safeText(drawing.title)
                .toLocaleLowerCase("ar");

            const description = safeText(drawing.description)
                .toLocaleLowerCase("ar");

            const artist = safeText(drawing.artist)
                .toLocaleLowerCase("ar");

            const categoryName = getCategoryName(drawing.category)
                .toLocaleLowerCase("ar");

            const matchesSearch =
                !searchText ||
                title.includes(searchText) ||
                description.includes(searchText) ||
                artist.includes(searchText) ||
                categoryName.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                drawing.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }

    // إنشاء عنصر نصي بطريقة آمنة
    function createTextElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        element.textContent = text;

        return element;
    }

    // إنشاء بطاقة رسمة
    function createDrawingCard(drawing) {
        const card = document.createElement("article");
        card.className = "drawing-card";

        const title = safeText(drawing.title, "رسمة فنية");

        const description = safeText(
            drawing.description,
            "لا يوجد وصف لهذه الرسمة."
        );

        const artistName = safeText(
            drawing.artist,
            "فنان"
        );

        const level = safeText(
            drawing.level,
            "غير محدد"
        );

        // صورة الرسمة، إن وُجد رابط صالح
        if (
            typeof drawing.image === "string" &&
            drawing.image.trim()
        ) {
            try {
                const imageURL = new URL(
                    drawing.image,
                    window.location.href
                );

                if (
                    imageURL.protocol === "https:" ||
                    imageURL.origin === window.location.origin
                ) {
                    const image = document.createElement("img");

                    image.className = "drawing-card-image";
                    image.src = imageURL.href;
                    image.alt = title;
                    image.loading = "lazy";

                    card.appendChild(image);
                }
            } catch (error) {
                // نتجاهل رابط الصورة غير الصالح.
            }
        }

        const content = document.createElement("div");
        content.className = "drawing-card-content";

        content.appendChild(
            createTextElement(
                "h3",
                "drawing-card-title",
                title
            )
        );

        content.appendChild(
            createTextElement(
                "p",
                "drawing-card-description",
                description
            )
        );

        content.appendChild(
            createTextElement(
                "span",
                "drawing-card-level",
                "المستوى: " + level
            )
        );

        content.appendChild(
            createTextElement(
                "span",
                "",
                "التصنيف: " + getCategoryName(drawing.category)
            )
        );

        const artist = document.createElement("div");
        artist.className = "drawing-card-artist";

        artist.appendChild(
            createTextElement(
                "span",
                "drawing-card-artist-name",
                "الفنان: " + artistName
            )
        );

        content.appendChild(artist);

        // عدد الإعجابات والتعليقات
        const actions = document.createElement("div");
        actions.className = "drawing-card-actions";

        const likes = Number.isFinite(Number(drawing.likes))
            ? Math.max(0, Number(drawing.likes))
            : 0;

        const comments = Number.isFinite(Number(drawing.comments))
            ? Math.max(0, Number(drawing.comments))
            : 0;

        actions.appendChild(
            createTextElement(
                "span",
                "",
                "الإعجابات: " + formatNumber(likes)
            )
        );

        actions.appendChild(
            createTextElement(
                "span",
                "",
                "التعليقات: " + formatNumber(comments)
            )
        );

        content.appendChild(actions);
        card.appendChild(content);

        return card;
    }

    // تحديث الرسومات المعروضة
    function renderDrawings() {
        const filteredDrawings = filterDrawings();

        drawingsGrid.replaceChildren();

        resultsCount.textContent =
            formatNumber(filteredDrawings.length) + " رسمة";

        if (filteredDrawings.length === 0) {
            drawingsEmpty.hidden = false;

            if (drawings.length === 0) {
                emptyTitle.textContent = "كن أول من يشارك فنه!";

                emptyMessage.textContent =
                    "لا توجد رسومات منشورة حتى الآن. " +
                    "يمكنك الانضمام إلى المجتمع والاستعداد لنشر أول رسمة لك.";
            } else {
                emptyTitle.textContent = "لم نعثر على رسومات";

                emptyMessage.textContent =
                    "جرّب كتابة اسم مختلف أو اختيار تصنيف آخر.";
            }

            return;
        }

        drawingsEmpty.hidden = true;

        const fragment = document.createDocumentFragment();

        filteredDrawings.forEach(function (drawing) {
            fragment.appendChild(createDrawingCard(drawing));
        });

        drawingsGrid.appendChild(fragment);
    }

    // البحث أثناء الكتابة
    searchInput.addEventListener("input", renderDrawings);

    // التصفية من القائمة
    categorySelect.addEventListener("change", function () {
        updateCategoryButtons();
        renderDrawings();
    });

    // تحديث شكل أزرار التصنيفات
    function updateCategoryButtons() {
        const selectedCategory = getSelectedCategory();

        categoryButtons.forEach(function (button) {
            const isActive =
                button.dataset.category === selectedCategory;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });
    }

    // التصفية باستخدام أزرار التصنيفات
    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const category = button.dataset.category;

            if (!category) {
                return;
            }

            categorySelect.value = category;

            updateCategoryButtons();
            renderDrawings();
        });
    });

    // عرض الحالة الأولية
    updateCategoryButtons();
    renderDrawings();

});
