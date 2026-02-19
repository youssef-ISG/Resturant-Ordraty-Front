$(document).ready(function () {
    // === 1. منطق الـ Sidebar (القائمة الجانبية) ===
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

    let currentBasePrice = 0;
    let currentProductDefaultDesc = "";
    let defaultProductImage = "";
    function disableMainAddToCartBtn() {
        const btn = $("#modal-add-to-cart-btn");
        btn.prop("disabled", true)
           .addClass("bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300 opacity-80 shadow-none")
           .removeClass("bg-brand-blue hover:bg-brand-red shadow-brand-blue/20")
           .html(`<span>غير متوفر حالياً</span> <i class="fa-solid fa-circle-xmark"></i>`);
    }

    // وظيفة تفعيل الزر الرئيسي
    function enableMainAddToCartBtn() {
        const btn = $("#modal-add-to-cart-btn");
        btn.prop("disabled", false)
           .removeClass("bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300 opacity-80")
           .addClass("bg-brand-blue hover:bg-brand-red shadow-brand-blue/20")
           .html(`<span>أضف للطلب</span> <i class="fa-solid fa-cart-shopping"></i>`);
    }

    // دالة حساب السعر النهائي (Base Price + Extras Total) * Quantity
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

        // 1. معالجة الإضافات
        let extras = btn.data("extras") || [];
        if (typeof extras === "string") try { extras = JSON.parse(extras); } catch (e) { extras = []; }

        if (extras.length > 0) {
            $("#modal-extras-section").show();
            extras.forEach((extra) => {
                $("#modal-extras-container").append(`
                    <div class="extra-item flex items-center justify-between w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                        <div class="flex items-center gap-3 text-right">
                            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-red shadow-sm border border-gray-50">
                                <i class="fa-solid fa-plus text-[10px]"></i>
                            </div>
                            <div>
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
        } else { $("#modal-extras-section").hide(); }

        // 2. معالجة الأحجام (Variants) وفحص المخزن
        let variants = btn.data("variants") || [];
        if (typeof variants === "string") try { variants = JSON.parse(variants); } catch (e) { variants = []; }

        if (variants.length > 0) {
            $("#modal-variants-section").show();
            $("#modal-variants-container").empty();
            
            const allOut = variants.every(v => v.stock <= 0);

            variants.forEach((v, index) => {
                const isOutOfStock = v.stock <= 0;
                const isActive = (index === 0 && !isOutOfStock) ? "border-brand-red bg-red-50/30 active-variant shadow-md" : "border-gray-100 bg-white shadow-sm";
                const stockClasses = isOutOfStock ? "opacity-50 grayscale cursor-not-allowed select-none pointer-events-none" : "cursor-pointer hover:border-brand-red/30";

                $("#modal-variants-container").append(`
                    <div class="variant-card relative p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${isActive} ${stockClasses}" 
                         data-vdata="${encodeURIComponent(JSON.stringify(v))}" data-disabled="${isOutOfStock}">
                        ${isOutOfStock ? `
                            <div class="absolute inset-0 bg-white/10 rounded-2xl z-10"></div>
                            <span class="absolute -top-2 -left-2 bg-slate-800 text-white text-[9px] px-3 py-1 rounded-lg font-black z-20 shadow-lg italic">نفد</span>
                        ` : ''}
                        <div class="flex flex-col text-right">
                            <span class="text-slate-400 text-[9px] font-bold mb-1 uppercase">الحجم</span>
                            <span class="text-brand-blue font-black text-sm ${isOutOfStock ? 'line-through opacity-50' : ''}">${v.name}</span>
                        </div>
                        <div class="${isOutOfStock ? 'bg-slate-200 text-slate-400' : 'bg-brand-blue text-white group-hover:bg-brand-red'} px-4 py-2 rounded-xl font-black text-xs transition-colors">
                            ${v.price} ج.م
                        </div>
                    </div>
                `);
            });

            const firstAvailable = variants.find(v => v.stock > 0) || variants[0];
            updateModalWithVariant(firstAvailable);
            if (allOut) disableMainAddToCartBtn(); else enableMainAddToCartBtn();
        } else {
            $("#modal-variants-section").hide();
            updateModalWithVariant({ price: btn.data("price") || 0, name: btn.data("name"), description: currentProductDefaultDesc, stock: 1 });
            enableMainAddToCartBtn();
        }

        $("#product-modal-overlay").fadeIn(300).css("display", "flex");
        $("body").addClass("overflow-hidden");
    });

    $(document).on("click", ".variant-card", function () {
        if ($(this).data("disabled") === true) return;
        const v = JSON.parse(decodeURIComponent($(this).data("vdata")));
        $(".variant-card").removeClass("border-brand-red bg-red-50/30 active-variant shadow-md").addClass("border-gray-100 bg-white shadow-sm");
        $(this).addClass("border-brand-red bg-red-50/30 active-variant shadow-md").removeClass("border-gray-100 bg-white shadow-sm");
        updateModalWithVariant(v);
    });

    $(document).on("click", ".extra-qty-btn", function() {
        const $input = $(this).siblings(".extra-quantity-input");
        const $item = $(this).closest(".extra-item");
        let val = parseInt($input.val());
        if ($(this).hasClass("plus")) val++; else if (val > 0) val--;
        $input.val(val);
        if (val > 0) $item.addClass("border-brand-red bg-red-50/30 shadow-sm");
        else $item.removeClass("border-brand-red bg-red-50/30 shadow-sm");
        calculateTotalPrice();
    });

    function updateModalWithVariant(v) {
        if (!v) return;
        $("#modal-product-name").text(v.full_title || v.name);
        $("#modal-product-description").text(v.description || currentProductDefaultDesc);
        currentBasePrice = parseFloat(v.price) || 0;
        $("#modal-product-original-price").text(v.old_price ? v.old_price + " ج.م" : "");
        $("#modal-selected-variant-badge").text(v.unit || v.name || "");
        $("#modal-product-image").attr("src", v.image || defaultProductImage);
        
        if (v.stock <= 0) disableMainAddToCartBtn(); else enableMainAddToCartBtn();
        calculateTotalPrice();
    }

    $(document).on("click", ".qty-btn", function() {
        let input = $("#modal-quantity-input");
        let val = parseInt(input.val());
        if ($(this).hasClass("plus")) val++; else if (val > 1) val--;
        input.val(val);
        calculateTotalPrice();
    });

    $(document).on("click", ".modal-close-btn, #product-modal-overlay", function (e) {
        if (e.target !== this && !$(this).hasClass("modal-close-btn")) return;
        $("#product-modal-overlay").fadeOut(250);
        $("body").removeClass("overflow-hidden");
    });
});