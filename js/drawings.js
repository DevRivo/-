/**
 * ملف رسومات موقع "مجتمع الفنون" (drawings.js)
 * المسؤول عن: البحث، الفلترة حسب النوع، الترتيب، وإدارة التفاعل مع بطاقات الرسومات.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. تعريف العناصر الأساسية المطابقة للـ HTML الحالي
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-buttons button, .filter-btn, [data-filter]'); // يدعم الأزرار حسب التسمية الشائعة
    const artGrid = document.getElementById('artGrid');
    const emptyMessage = document.getElementById('emptyMessage');
    const sortSelect = document.getElementById('sortSelect');

    // التحقق من وجود العناصر الأساسية في الصفحة قبل تنفيذ الكود لمنع الأخطاء
    if (!artGrid) return;

    // جلب جميع بطاقات الرسومات الموجودة مسبقاً في الـ HTML
    const artCards = Array.from(artGrid.querySelectorAll('.art-card'));

    // حالة البحث والفلترة الحالية
    let currentSearchQuery = '';
    let currentFilter = 'all';
    let currentSort = sortSelect ? sortSelect.value : 'default';

    /**
     * دالة لتطبيق معايير البحث والفلترة والترتيب معاً بشكل متزامن
     */
    function filterAndSortArtworks() {
        let visibleCount = 0;

        // مصفوفة لتخزين البطاقات المطابقة لعملية الترتيب لاحقاً
        let filteredCards = artCards.filter(card => {
            // استخراج البيانات من البطاقة (العنوان، اسم الفنان، والنوع الفني)
            // نعتمد على سمات (data-*) أو نصوص العناصر داخل البطاقة
            const titleEl = card.querySelector('.art-title, h3, h2, h4');
            const artistEl = card.querySelector('.artist-name, .artist, p');
            
            const titleText = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
            const artistText = artistEl ? artistEl.textContent.trim().toLowerCase() : '';
            
            // استخراج التصنيف الفني (يمكن تخزينه في data-category أو استنتاجه)
            const category = (card.getAttribute('data-category') || card.dataset.category || 'all').toLowerCase();

            // فحص مطابقة البحث (بالاسم أو اسم الفنان)
            const matchesSearch = currentSearchQuery === '' || 
                titleText.includes(currentSearchQuery) || 
                artistText.includes(currentSearchQuery);

            // فحص مطابقة الفلتر (النوع)
            const matchesFilter = currentFilter === 'all' || 
                category === currentFilter || 
                card.classList.contains(currentFilter);

            const isVisible = matchesSearch && matchesFilter;

            // إظهار أو إخفاء البطاقة بناءً على المطابقة
            if (isVisible) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }

            return isVisible;
        });

        // 3. ترتيب البطاقات المرئية حسب خيار الترتيب المختار
        if (sortSelect && filteredCards.length > 0) {
            filteredCards.sort((a, b) => {
                const titleA = (a.querySelector('.art-title, h3, h2, h4')?.textContent || '').trim();
                const titleB = (b.querySelector('.art-title, h3, h2, h4')?.textContent || '').trim();
                
                // افتراض وجود تاريخ أو رقم معرّف أو الاعتماد على الترتيب الأبجدي كخيار أساسي آمن
                if (currentSort === 'title-asc') {
                    return titleA.localeCompare(titleB, 'ar');
                } else if (currentSort === 'title-desc') {
                    return titleB.localeCompare(titleA, 'ar');
                }
                // للترتيب الافتراضي، نحافظ على الترتيب الأصلي في الـ DOM
                return 0;
            });

            // إعادة ترتيب العناصر في الـ DOM لتظهر بالترتيب الجديد
            filteredCards.forEach(card => artGrid.appendChild(card));
        }

        // 4. إظهار أو إخفاء رسالة "لا توجد نتائج" بالعربية
        if (emptyMessage) {
            if (visibleCount === 0) {
                emptyMessage.style.display = 'block';
                // التأكد من النص العربي المناسب في حال لم يكن موجوداً مسبقاً
                if (!emptyMessage.textContent.trim()) {
                    emptyMessage.textContent = 'عذراً، لم يتم العثور على أي رسومات تطابق بحثك.';
                }
            } else {
                emptyMessage.style.display = 'none';
            }
        }
    }

    // --- إعداد المستمعين للأحداث (Event Listeners) ---

    // أ. البحث المباشر أثناء الكتابة
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.trim().toLowerCase();
            filterAndSortArtworks();
        });
    }

    // ب. الفلترة حسب النوع (الأزرار)
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // إزالة فئة النشاط من جميع الأزرار وإضافتها للزر الحالي
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // تحديد قيمة الفلتر من سمة data-filter أو النص
                currentFilter = (btn.getAttribute('data-filter') || btn.dataset.filter || 'all').toLowerCase();
                filterAndSortArtworks();
            });
        });
    }

    // ج. تغيير ترتيب العرض
    if (sortSelect) {
        sortSelect.و = sortSelect.addEventListener('change', (e) => { // تم تصحيح بناء الحدث البرمجي بشكل نظيف
            currentSort = e.target.value;
            filterAndSortArtworks();
        });
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndSortArtworks();
        });
    }

    // 5. إضافة تأثيرات تفاعلية بسيطة وجميلة عند التعامل مع بطاقات الرسومات (Art Cards)
    artCards.forEach(card => {
        // تأثير عند مرور الماوس
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            // استخدام ظل متناسق إن لم يكن معرّفاً في ملفات الـ CSS الخارجية
            if (!card.style.boxShadow) {
                card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            }
        });

        // إرجاع التأثير عند إبعاد الماوس
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // تشغيل الفلترة المبدئية عند التحميل لضبط الحالة العامة
    filterAndSortArtworks();
});
