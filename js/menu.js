$(document).ready(function () {

    // فتح السايد بار
    $('#open-sidebar').on('click', function() {
        $('#menu-sidebar').removeClass('translate-x-full');
        $('#menu-overlay').removeClass('hidden').addClass('opacity-100');
        $('body').addClass('overflow-hidden'); // منع السكرول في الخلفية
    });

    // إغلاق السايد بار (عن طريق الزرار أو الضغط على الخلفية)
    function closeSidebar() {
        $('#menu-sidebar').addClass('translate-x-full');
        $('#menu-overlay').addClass('opacity-0');
        setTimeout(() => {
            $('#menu-overlay').addClass('hidden');
        }, 300);
        $('body').removeClass('overflow-hidden');
    }

    $('#close-sidebar, #menu-overlay').on('click', closeSidebar);
    // === 1. منطق الـ Accordion في الـ Sidebar ===
    $(document).on("click", ".accordion-trigger", function () {
        const $submenu = $(this).next(".submenu");
        const $arrow = $(this).find(".arrow-icon");

        // إغلاق أي قائمة أخرى مفتوحة
        $(".submenu").not($submenu).slideUp().addClass("hidden");
        $(".arrow-icon").not($arrow).removeClass("-rotate-90");
        $(".accordion-trigger").not($(this)).removeClass("text-brand-red bg-red-50");

        // فتح أو إغلاق القائمة الحالية
        $submenu.slideToggle(300).toggleClass("hidden");
        $arrow.toggleClass("-rotate-90");
        $(this).toggleClass("text-brand-red bg-red-50");
    });

    // === 2. منطق الـ Product Modal المتطور ===
    let defaultProductImage = "";
    let currentBasePrice = 0;
    let currentProductDefaultDesc = "";

    // وظيفة حساب السعر الإجمالي (فارينت + إضافات)
    function calculateTotalPrice() {
        let extrasTotal = 0;
        $(".extra-card.active").each(function () {
            extrasTotal += parseFloat($(this).data("price")) || 0;
        });
        const total = currentBasePrice + extrasTotal;
        $("#modal-product-final-price").text(total + " ج.م");
    }

    // وظيفة تحديث محتوى المودال عند تغيير الفارينت
    function updateModalWithVariant(v) {
        // تحديث النصوص بأنيميشن
        $("#modal-product-name").fadeOut(150, function () {
            $(this).text(v.full_title || v.name).fadeIn(150);
        });

        // تحديث الوصف (لو الفارينت له وصف خاص يعرضه، وإلا يعرض وصف المنتج الأساسي)
        const desc = v.description || currentProductDefaultDesc;
        $("#modal-product-description").fadeOut(150, function() {
            $(this).text(desc).fadeIn(150);
        });

        currentBasePrice = parseFloat(v.price) || 0;
        calculateTotalPrice();

        $("#modal-product-original-price").text(v.old_price ? v.old_price + " ج.م" : "");
        $("#modal-selected-variant-badge").text(v.unit || v.name || "");

        // تحديث المعرض والصورة الأساسية
        const galleryCont = $("#modal-product-gallery").empty();
        let imageList = [];

        if (v.images && v.images.length > 0) {
            imageList = Array.isArray(v.images) ? v.images : [v.images];
        } else if (v.image) {
            imageList = [v.image];
        } else {
            imageList = [defaultProductImage];
        }

        $("#modal-product-image").fadeOut(200, function () {
            $(this).attr("src", imageList[0]).fadeIn(200);
        });

        // بناء الـ Thumbnails لو في أكتر من صورة
        if (imageList.length > 1 || (imageList.length === 1 && imageList[0] !== defaultProductImage)) {
            imageList.forEach((imgSrc, i) => {
                const activeClass = i === 0 ? "border-brand-red shadow-md" : "border-slate-100";
                galleryCont.append(`
                    <div class="w-20 h-20 rounded-2xl border-2 ${activeClass} p-2 cursor-pointer hover:border-brand-red transition-all flex-shrink-0 bg-white thumb-wrapper">
                        <img src="${imgSrc}" class="w-full h-full object-contain js-modal-thumb" />
                    </div>
                `);
            });
        }
    }

    // فتح المودال وتجهيز البيانات الأساسية
    $(document).on("click", ".js-add-to-cart", function (e) {
        e.preventDefault();
        const btn = $(this);

        // التقاط البيانات الأساسية
        defaultProductImage = btn.data("image") || btn.closest(".group").find("img").attr("src");
        currentProductDefaultDesc = btn.data("description") || "وجبة شهية محضرة من أجود المكونات الطازجة يومياً.";

        // تصفير (Reset) المودال
        $("#modal-quantity-input").val(1);
        $("#modal-product-notes").val("");
        $("#modal-extras-container").empty();

        const productData = {
            name: btn.data("name") || "منتج",
            price: btn.data("price") || 0,
            category: btn.data("category") || "عام"
        };

        $("#modal-product-category").text(productData.category);

        // 1. معالجة الإضافات (Extras)
        let extras = btn.data("extras") || [];
        if (typeof extras === "string") {
            try { extras = JSON.parse(extras); } catch (e) { extras = []; }
        }

        if (extras.length > 0) {
            $("#modal-extras-section").show();
            extras.forEach((extra) => {
                $("#modal-extras-container").append(`
                    <div class="extra-card px-4 py-3 rounded-2xl border-2 border-gray-100 cursor-pointer transition-all flex items-center gap-3 hover:border-brand-red/30" 
                         data-price="${extra.price}" data-id="${extra.id}">
                        <span class="text-xs font-bold text-slate-900">${extra.name}</span>
                        <span class="text-[10px] font-black text-brand-red">+${extra.price}ج</span>
                        <i class="fa-solid fa-circle-check text-brand-red hidden check-icon"></i>
                    </div>
                `);
            });
        } else {
            $("#modal-extras-section").hide();
        }

        // 2. معالجة الإصدارات (Variants)
        let variants = btn.data("variants") || [];
        if (typeof variants === "string") {
            try { variants = JSON.parse(variants); } catch (e) { variants = []; }
        }

        if (variants.length > 0) {
            $("#modal-variants-section").show();
            $("#modal-variants-container").empty();
            variants.forEach((v, index) => {
                const isActive = index === 0 ? "border-brand-red bg-red-50/30 active-variant shadow-sm" : "border-gray-100 bg-white";
                const vString = encodeURIComponent(JSON.stringify(v));

                $("#modal-variants-container").append(`
                    <div class="variant-card p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${isActive}" data-vdata="${vString}">
                        <div class="flex flex-col text-right">
                            <span class="text-slate-400 text-[10px] font-bold mb-1 uppercase text-xs">حجم الوجبة</span>
                            <span class="text-brand-blue font-black text-base">${v.name}</span>
                        </div>
                        <div class="bg-brand-blue text-white px-4 py-2 rounded-xl font-black text-sm group-hover:bg-brand-red transition-colors">${v.price} ج.م</div>
                    </div>
                `);
            });
            updateModalWithVariant(variants[0]);
        } else {
            $("#modal-variants-section").hide();
            updateModalWithVariant({
                price: productData.price,
                name: productData.name,
                description: currentProductDefaultDesc
            });
        }

        $("#product-modal-overlay").fadeIn(300).css("display", "flex");
        $("body").addClass("overflow-hidden");
    });

    // تبديل اختيار الإضافات (حساب السعر لحظياً)
    $(document).on("click", ".extra-card", function () {
        $(this).toggleClass("active border-brand-red bg-red-50/30 shadow-sm");
        $(this).find(".check-icon").toggleClass("hidden animate-in zoom-in");
        calculateTotalPrice();
    });

    // تبديل الفارينت
    $(document).on("click", ".variant-card", function () {
        const v = JSON.parse(decodeURIComponent($(this).data("vdata")));
        $(".variant-card").removeClass("border-brand-red bg-red-50/30 active-variant shadow-sm").addClass("border-gray-100 bg-white");
        $(this).addClass("border-brand-red bg-red-50/30 active-variant shadow-sm").removeClass("border-gray-100 bg-white");
        updateModalWithVariant(v);
    });

    // منطق الـ Thumbnails في الجاليري
    $(document).on("click", ".js-modal-thumb", function () {
        const src = $(this).attr("src");
        $(".thumb-wrapper").removeClass("border-brand-red shadow-md").addClass("border-slate-100");
        $(this).closest(".thumb-wrapper").addClass("border-brand-red shadow-md");
        $("#modal-product-image").fadeOut(200, function() { $(this).attr("src", src).fadeIn(200); });
    });

    // إغلاق المودال (حل نهائي ومضمون)
    $(document).on("click", ".modal-close-btn", function (e) {
        e.preventDefault();
        $("#product-modal-overlay").fadeOut(250);
        $("body").removeClass("overflow-hidden");
        defaultProductImage = ""; // تنظيف الصورة المرجعية
    });

    // إغلاق عند الضغط خارج محتوى المودال
    $(document).on("click", "#product-modal-overlay", function (e) {
        if ($(e.target).is("#product-modal-overlay")) {
            $(".modal-close-btn").trigger("click");
        }
    });

    // التحكم في الكمية (Quantity)
    $(document).on("click", ".qty-btn.plus", function() {
        let input = $("#modal-quantity-input");
        input.val(parseInt(input.val()) + 1);
    });

    $(document).on("click", ".qty-btn.minus", function() {
        let input = $("#modal-quantity-input");
        if (parseInt(input.val()) > 1) input.val(parseInt(input.val()) - 1);
    });
});