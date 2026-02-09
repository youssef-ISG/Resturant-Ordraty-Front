      $(document).ready(function () {
        // عند الضغط على تأكيد الحجز (المرحلة الأولى)
        $("#reservationForm").on("submit", function (e) {
          e.preventDefault(); // منع التحميل الافتراضي

          // أنيميشن بسيط للاختفاء والظهور
          $(this)
            .closest("section")
            .fadeOut(400, function () {
              $("#details-step").fadeIn(500).removeClass("hidden");
              // Scroll للي فوق عشان المستخدم يشوف بداية الفورم الجديد
              $("html, body").animate(
                { scrollTop: $("#details-step").offset().top - 100 },
                600,
              );
            });
        });
      });