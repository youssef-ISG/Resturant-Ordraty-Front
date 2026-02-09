      $(document).ready(function () {
        // 1. تحديث الـ Highlight البصري لطريقة الدفع المختارة
        function updatePaymentHighlight() {
          $('input[name="payment_method"]').each(function () {
            const $box = $(this).next(".payment-box");
            if ($(this).is(":checked")) {
              $box
                .addClass("border-brand-red bg-red-50 shadow-md scale-[1.02]")
                .find("i")
                .addClass("text-brand-red")
                .removeClass("text-slate-300");
            } else {
              $box
                .removeClass(
                  "border-brand-red bg-red-50 shadow-md scale-[1.02]",
                )
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

          // تنسيق الأزرار
          $(".js-online-tab")
            .removeClass("bg-black text-white shadow-lg")
            .addClass("text-slate-600");
          $(this)
            .addClass("bg-black text-white shadow-lg")
            .removeClass("text-slate-600");

          // تبديل المحتوى
          $("#wallet-content, #card-content")
            .stop()
            .fadeOut(150, function () {
              $(`#${target}-content`).fadeIn(250).removeClass("hidden");
            });
        });

        // 4. تنسيق رقم البطاقة (كل 4 أرقام مسافة)
        $("#card-num").on("input", function () {
          let val = this.value.replace(/\D/g, "");
          let formatted = val.match(/.{1,4}/g);
          this.value = formatted ? formatted.join(" ") : val;
        });

        // 5. تنسيق تاريخ الانتهاء (MM / YY)
        $("#card-exp").on("input", function () {
          let val = this.value.replace(/\D/g, "");
          if (val.length >= 2) {
            this.value = val.substring(0, 2) + " / " + val.substring(2, 4);
          } else {
            this.value = val;
          }
        });
        // 6. تحقق بسيط من رقم المحفظة
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

    })