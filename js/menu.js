$(document).ready(function () {
    // === 1. منطق الـ Sidebar ===
    $('#open-sidebar').on('click', function() {
        $('#menu-sidebar').removeClass('translate-x-full');
        $('#menu-overlay').removeClass('hidden').addClass('opacity-100');
        $('body').addClass('overflow-hidden');
    });

    function closeSidebar() {
        $('#menu-sidebar').addClass('translate-x-full');
        $('#menu-overlay').addClass('opacity-0');
        setTimeout(() => { $('#menu-overlay').addClass('hidden'); }, 300);
        $('body').removeClass('overflow-hidden');
    }

    $('#close-sidebar, #menu-overlay').on('click', closeSidebar);

    $(document).on("click", ".accordion-trigger", function () {
        const $submenu = $(this).next(".submenu");
        const $arrow = $(this).find(".arrow-icon");
        $(".submenu").not($submenu).slideUp().addClass("hidden");
        $(".arrow-icon").not($arrow).removeClass("-rotate-90");
        $(".accordion-trigger").not($(this)).removeClass("text-brand-red bg-red-50");
        $submenu.slideToggle(300).toggleClass("hidden");
        $arrow.toggleClass("-rotate-90");
        $(this).toggleClass("text-brand-red bg-red-50");
    });

    // === 2. منطق الـ Product Modal المتطور ===
    let currentBasePrice = 0;
    let currentProductDefaultDesc = "";
    let defaultProductImage = "";

    function calculateTotalPrice() {
        let extrasTotal = 0;
        $(".extra-item").each(function () {
            const qty = parseInt($(this).find(".extra-quantity-input").val()) || 0;
            const price = parseFloat($(this).find(".extra-unit-price").text()) || 0;
            extrasTotal += (qty * price);
        });

        const mainQty = parseInt($("#modal-quantity-input").val()) || 1;
        const total = (currentBasePrice + extrasTotal) * mainQty;
        $("#modal-product-final-price").text(total.toFixed(2) + " ج.م");
    }

    // فتح المودال وتجهيز البيانات
    $(document).on("click", ".js-add-to-cart", function (e) {
        e.preventDefault();
        const btn = $(this);

        // تصفير المودال
        $("#modal-quantity-input").val(1);
        $("#modal-product-notes").val("");
        $("#modal-extras-container").empty();

        defaultProductImage = btn.data("image") || btn.closest(".group").find("img").attr("src");
        currentProductDefaultDesc = btn.data("description") || "وجبة شهية محضرة من أجود المكونات الطازجة.";
        
        $("#modal-product-category").text(btn.data("category") || "عام");

        // معالجة الإضافات بنظام الـ Quantity
        let extras = btn.data("extras") || [];
        if (typeof extras === "string") try { extras = JSON.parse(extras); } catch (e) { extras = []; }

        if (extras.length > 0) {
            $("#modal-extras-section").show();
            extras.forEach((extra) => {
                $("#modal-extras-container").append(`
                    <div class="extra-item flex items-center justify-between w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-red shadow-sm border border-gray-50">
                                <i class="fa-solid fa-plus text-[10px]"></i>
                            </div>
                            <div class="text-right">
                                <h6 class="text-sm font-black text-brand-blue">${extra.name}</h6>
                                <span class="text-[10px] font-bold text-slate-400">+ <span class="extra-unit-price">${extra.price}</span> ج.م</span>
                            </div>
                        </div>
                        <div class="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-inner">
                            <button type="button" class="extra-qty-btn plus w-8 h-8 flex items-center justify-center text-brand-blue hover:bg-red-50 hover:text-brand-red rounded-lg transition-all font-bold">+</button>
                            <input type="number" class="extra-quantity-input w-8 text-center bg-transparent font-black text-sm text-brand-blue outline-none" value="0" min="0" readonly />
                            <button type="button" class="extra-qty-btn minus w-8 h-8 flex items-center justify-center text-brand-blue hover:bg-red-50 hover:text-brand-red rounded-lg transition-all font-bold">-</button>
                        </div>
                    </div>
                `);
            });
        } else {
            $("#modal-extras-section").hide();
        }

        // معالجة الفارينت (الأحجام)
        let variants = btn.data("variants") || [];
        if (typeof variants === "string") try { variants = JSON.parse(variants); } catch (e) { variants = []; }

        if (variants.length > 0) {
            $("#modal-variants-section").show();
            $("#modal-variants-container").empty();
            variants.forEach((v, index) => {
                const isActive = index === 0 ? "border-brand-red bg-red-50/30 active-variant" : "border-gray-100 bg-white";
                $("#modal-variants-container").append(`
                    <div class="variant-card p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${isActive}" data-vdata="${encodeURIComponent(JSON.stringify(v))}">
                        <div class="flex flex-col text-right">
                            <span class="text-slate-400 text-[9px] font-bold mb-1 uppercase">الحجم</span>
                            <span class="text-brand-blue font-black text-sm">${v.name}</span>
                        </div>
                        <div class="bg-brand-blue text-white px-4 py-2 rounded-xl font-black text-xs group-hover:bg-brand-red transition-colors">${v.price} ج.م</div>
                    </div>
                `);
            });
            updateModalWithVariant(variants[0]);
        } else {
            $("#modal-variants-section").hide();
            updateModalWithVariant({ price: btn.data("price") || 0, name: btn.data("name"), description: currentProductDefaultDesc });
        }

        $("#product-modal-overlay").fadeIn(300).css("display", "flex");
        $("body").addClass("overflow-hidden");
    });

    // تبديل كمية الإضافات
    $(document).on("click", ".extra-qty-btn", function() {
        const $input = $(this).siblings(".extra-quantity-input");
        const $item = $(this).closest(".extra-item");
        let val = parseInt($input.val());

        if ($(this).hasClass("plus")) val++;
        else if (val > 0) val--;

        $input.val(val);
        if (val > 0) $item.addClass("border-brand-red bg-red-50/30 shadow-sm");
        else $item.removeClass("border-brand-red bg-red-50/30 shadow-sm");
        
        calculateTotalPrice();
    });

    // تحديث المودال عند اختيار حجم
    function updateModalWithVariant(v) {
        $("#modal-product-name").text(v.full_title || v.name);
        $("#modal-product-description").text(v.description || currentProductDefaultDesc);
        currentBasePrice = parseFloat(v.price) || 0;
        $("#modal-product-original-price").text(v.old_price ? v.old_price + " ج.م" : "");
        $("#modal-selected-variant-badge").text(v.unit || v.name || "");
        
        const imgSrc = v.image || defaultProductImage;
        $("#modal-product-image").attr("src", imgSrc);
        calculateTotalPrice();
    }

    $(document).on("click", ".variant-card", function () {
        const v = JSON.parse(decodeURIComponent($(this).data("vdata")));
        $(".variant-card").removeClass("border-brand-red bg-red-50/30 active-variant").addClass("border-gray-100 bg-white");
        $(this).addClass("border-brand-red bg-red-50/30 active-variant").removeClass("border-gray-100 bg-white");
        updateModalWithVariant(v);
    });

    // التحكم في كمية المنتج الأساسي
    $(document).on("click", ".qty-btn", function() {
        let input = $("#modal-quantity-input");
        let val = parseInt(input.val());
        if ($(this).hasClass("plus")) val++;
        else if (val > 1) val--;
        input.val(val);
        calculateTotalPrice();
    });

    // الإغلاق
    $(document).on("click", ".modal-close-btn, #product-modal-overlay", function (e) {
        if (e.target !== this && !$(this).hasClass("modal-close-btn")) return;
        $("#product-modal-overlay").fadeOut(250);
        $("body").removeClass("overflow-hidden");
    });
});