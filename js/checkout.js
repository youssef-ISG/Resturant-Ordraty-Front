$(document).ready(function () {
    // 1. تحديث الـ Highlight البصري لطريقة الدفع المختارة
    function updatePaymentHighlight() {
        $('input[name="payment_method"]').each(function () {
            const $box = $(this).next(".payment-box");
            if ($(this).is(":checked")) {
                $box
                    .addClass("border-brand-red bg-red-50 shadow-lg scale-[1.02]")
                    .find("i")
                    .addClass("text-brand-red")
                    .removeClass("text-slate-300");
            } else {
                $box
                    .removeClass("border-brand-red bg-red-50 shadow-lg scale-[1.02]")
                    .find("i")
                    .removeClass("text-brand-red")
                    .addClass("text-slate-300");
            }
        });
    }

    updatePaymentHighlight();

    // 2. التحكم في إظهار/إخفاء سيكشن الدفع الإلكتروني
    $('input[name="payment_method"]').on("change", function () {
        updatePaymentHighlight();
        if ($(this).val() === "online") {
            $("#online-details-area")
                .stop()
                .slideDown(400)
                .removeClass("hidden");
        } else {
            $("#online-details-area").stop().slideUp(300);
        }
    });

    // 3. التبديل بين الـ Tabs (محفظة / بطاقة)
    $(".js-online-tab").on("click", function () {
        const target = $(this).data("target");

        // تنسيق الأزرار (Pill Style)
        $(".js-online-tab")
            .removeClass("bg-brand-blue text-white shadow-lg")
            .addClass("text-slate-500 hover:text-brand-blue");
        
        $(this)
            .addClass("bg-brand-blue text-white shadow-lg")
            .removeClass("text-slate-500 hover:text-brand-blue");

        // تبديل المحتوى بأنيميشن ناعم
        $("#wallet-content, #card-content").addClass("hidden");
        $(`#${target}-content`).hide().removeClass("hidden").fadeIn(300);
    });

    // 4. منطق تطبيق الكوبون (الجديد)
    $("#apply-coupon-btn").on("click", function() {
        const $btn = $(this);
        const code = $('input[name="coupon_code"]').val().trim();
        const $msg = $("#coupon-message");
        const $discountRow = $("#discount-row");
        const $finalTotal = $("#final-total");

        if(code === "") {
            $msg.text("يرجى إدخال الكود").addClass("text-amber-500").removeClass("hidden text-green-500");
            return;
        }

        // محاكاة عملية التحقق (تقدر تربطها بـ Ajax هنا)
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>'); // لودينج بسيط
        
        setTimeout(() => {
            if(code.toLowerCase() === "youssef50") { // مثال لكود صحيح
                $msg.text("تم تطبيق الخصم بنجاح!").addClass("text-green-500").removeClass("hidden text-amber-500");
                $discountRow.slideDown().removeClass("hidden");
                $finalTotal.text("540.00"); // تحديث السعر
                $btn.html('تم');
                $(".fa-circle-check").fadeIn().removeClass("hidden"); // إظهار أيقونة النجاح
            } else {
                $msg.text("كود الخصم غير صحيح").addClass("text-brand-red").removeClass("hidden text-green-500");
                $btn.html('تطبيق');
            }
        }, 800);
    });

    // 5. تنسيق رقم البطاقة (Format: **** **** **** ****)
    $("#card-num").on("input", function () {
        let val = this.value.replace(/\D/g, "");
        let formatted = val.match(/.{1,4}/g);
        this.value = formatted ? formatted.join(" ") : val;
    });

    // 6. تنسيق تاريخ الانتهاء (MM / YY)
    $("#card-exp").on("input", function () {
        let val = this.value.replace(/\D/g, "");
        if (val.length >= 2) {
            this.value = val.substring(0, 2) + " / " + val.substring(2, 4);
        } else {
            this.value = val;
        }
    });

    // 7. تحقق من رقم المحفظة (فودافون كاش وأخواتها)
    $("#wallet-phone").on("blur", function () {
        const phone = $(this).val();
        const regex = /^01[0125][0-9]{8}$/;
        if (!regex.test(phone) && phone !== "") {
            $("#wallet-error").slideDown().removeClass("hidden");
            $(this).addClass("border-brand-red");
        } else {
            $("#wallet-error").slideUp();
            $(this).removeClass("border-brand-red");
        }
    });
});