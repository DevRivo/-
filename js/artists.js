/* ========================================
   صفحة الفنانين - مجتمع الفنون
======================================== */

document.addEventListener("DOMContentLoaded", function () {

    // عناصر الصفحة
    const searchInput = document.getElementById("artistSearch");
    const specialtySelect = document.getElementById("artistSpecialty");
    const categoryButtons = document.querySelectorAll(".artist-category");
    const artistsGrid = document.getElementById("artistsGrid");
    const artistsEmpty = document.getElementById("artistsEmpty");
    const artistsCount = document.getElementById("artistsCount");
    const emptyTitle = document.getElementById("artistsEmptyTitle");
    const emptyMessage = document.getElementById("artistsEmptyMessage");

    // التأكد من وجود عناصر الصفحة
    if (
        !searchInput ||
        !specialtySelect ||
        !artistsGrid ||
        !artistsEmpty ||
        !artistsCount
    ) {
        return;
    }

    /*
     * لا نضيف حسابات وهمية.
     * ستُعرض حسابات الفنانين الحقيقية عند ربط
     * الموقع بنظام حسابات وقاعدة بيانات.
     *
     * يمكن تمرير بيانات الفنانين إلى الصفحة
     * من خلال window.ArtCommunityArtists.
     */

    const artists = Array.isArray(window.ArtCommunityArtists)
        ? window.ArtCommunityArtists
        : [];

    // أسماء التخصصات
    const specialties = {
        traditional: "الرسم التقليدي",
        digital: "الرسم الرقمي",
        portrait: "البورتريه",
        anime: "الأنمي والمانجا",
        nature: "رسم الطبيعة",
        calligraphy: "الخط العربي",
        other: "تخصصات أخرى"
    };

    // تنسيق الأرقام
    function formatNumber(number) {
        return new Intl.NumberFormat("ar-EG").format(number);
    }

    // الحصول على نص آمن
    function safeText(value, fallback = "") {
        if (typeof value !== "string") {
            return fallback;
        }

        return value.trim() || fallback;
    }

    // البحث والتصفية
    function filterArtists() {
        const searchText = searchInput.value
            .trim()
            .toLocaleLowerCase("ar");

        const selectedSpecialty = specialtySelect.value;

        return artists.filter(function (artist) {
            if (!artist || typeof artist !== "object") {
                return false;
            }

            const name = safeText(artist.name)
                .toLocaleLowerCase("ar");

            const bio = safeText(artist.bio)
                .toLocaleLowerCase("ar");

            const specialtyName = (
                specialties[artist.specialty] || "تخصصات أخرى"
            ).toLocaleLowerCase("ar");

            const matchesSearch =
                !searchText ||
                name.includes(searchText) ||
                bio.includes(searchText) ||
                specialtyName.includes(searchText);

            const matchesSpecialty =
                selectedSpecialty === "all" ||
                artist.specialty === selectedSpecialty;

            return matchesSearch && matchesSpecialty;
        });
    }

    // إنشاء عنصر نصي
    function createTextElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        element.textContent = text;

        return element;
    }

    // إنشاء رابط داخلي آمن
    function createInternalLink(path, label, className) {
        const link = document.createElement("a");

        link.href = path;
        link.textContent = label;

        if (className) {
            link.className = className;
        }

        return link;
    }

    // التحقق من صحة رابط الصورة
    function getSafeImageURL(value) {
        if (typeof value !== "string" || !value.trim()) {
            return "";
        }

        try {
            const url = new URL(value, window.location.href);

            if (
                url.protocol === "https:" ||
                url.origin === window.location.origin
            ) {
                return url.href;
            }
        } catch (error) {
            return "";
        }

        return "";
    }

    // إنشاء بطاقة فنان
    function createArtistCard(artist) {
        const card = document.createElement("article");
        card.className = "artist-card";

        // الصورة الشخصية
        const avatar = document.createElement("div");
        avatar.className = "artist-avatar";

        const imageURL = getSafeImageURL(artist.avatar);
        const artistName = safeText(artist.name, "فنان");

        if (imageURL) {
            const image = document.createElement("img");

            image.src = imageURL;
            image.alt = "الصورة الشخصية لـ " + artistName;
            image.loading = "lazy";

            avatar.appendChild(image);
        } else {
            avatar.textContent = artistName.charAt(0);
        }

        card.appendChild(avatar);

        // اسم الفنان
        card.appendChild(
            createTextElement(
                "h3",
                "artist-name",
                artistName
            )
        );

        // نبذة الفنان
        card.appendChild(
            createTextElement(
                "p",
                "artist-bio",
                safeText(artist.bio, "لم يضف الفنان نبذة شخصية بعد.")
            )
        );

        // التخصص
        card.appendChild(
            createTextElement(
                "span",
                "artist-specialty",
                specialties[artist.specialty] || "تخصصات أخرى"
            )
        );

        // إحصائيات الفنان
        const stats = document.createElement("div");
        stats.className = "artist-stats";

        const followers = Number.isFinite(Number(artist.followers))
            ? Math.max(0, Number(artist.followers))
            : 0;

        const drawings = Number.isFinite(Number(artist.drawings))
            ? Math.max(0, Number(artist.drawings))
            : 0;

        const followersStat = document.createElement("div");
        followersStat.className = "artist-stat";

        followersStat.appendChild(
            createTextElement(
                "strong",
                "",
                formatNumber(followers)
            )
        );

        followersStat.appendChild(
            createTextElement("span", "", "المتابعون")
        );

        const drawingsStat = document.createElement("div");
        drawingsStat.className = "artist-stat";

        drawingsStat.appendChild(
            createTextElement(
                "strong",
                "",
                formatNumber(drawings)
            )
        );

        drawingsStat.appendChild(
            createTextElement("span", "", "الرسومات")
        );

        stats.appendChild(followersStat);
        stats.appendChild(drawingsStat);

        card.appendChild(stats);

        // الأزرار
        const actions = document.createElement("div");
        actions.className = "artist-actions";

        const profileLink = createInternalLink(
            "profile.html",
            "الملف الشخصي",
            ""
        );

        actions.appendChild(profileLink);

        const followLink = createInternalLink(
            "login.html",
            "تسجيل الدخول للمتابعة",
            "follow-button"
        );

        actions.appendChild(followLink);

        card.appendChild(actions);

        return card;
    }

    // تحديث حالة أزرار التخصصات
    function updateCategoryButtons() {
        const selectedSpecialty = specialtySelect.value;

        categoryButtons.forEach(function (button) {
            const isActive =
                button.dataset.specialty === selectedSpecialty;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });
    }

    // عرض النتائج
    function renderArtists() {
        const filteredArtists = filterArtists();

        artistsGrid.replaceChildren();

        artistsCount.textContent =
            formatNumber(filteredArtists.length) + " فنان";

        if (filteredArtists.length === 0) {
            artistsEmpty.hidden = false;

            if (artists.length === 0) {
                emptyTitle.textContent =
                    "كن أول فنان في مجتمعنا!";

                emptyMessage.textContent =
                    "لا توجد حسابات فنانين منشورة حتى الآن. " +
                    "يمكنك إنشاء حسابك والانضمام إلى المجتمع.";
            } else {
                emptyTitle.textContent =
                    "لم نعثر على فنانين";

                emptyMessage.textContent =
                    "جرّب البحث بكلمات أخرى أو اختر تخصصًا مختلفًا.";
            }

            return;
        }

        artistsEmpty.hidden = true;

        const fragment = document.createDocumentFragment();

        filteredArtists.forEach(function (artist) {
            fragment.appendChild(createArtistCard(artist));
        });

        artistsGrid.appendChild(fragment);
    }

    // البحث أثناء الكتابة
    searchInput.addEventListener("input", renderArtists);

    // تغيير التخصص من القائمة
    specialtySelect.addEventListener("change", function () {
        updateCategoryButtons();
        renderArtists();
    });

    // تغيير التخصص من الأزرار
    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const specialty = button.dataset.specialty;

            if (!specialty) {
                return;
            }

            specialtySelect.value = specialty;

            updateCategoryButtons();
            renderArtists();
        });
    });

    // بدء الصفحة
    updateCategoryButtons();
    renderArtists();

});
