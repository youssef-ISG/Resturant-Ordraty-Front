      $(document).ready(function () {
        // Owl Carousel Initialization
        $("#main-slider").owlCarousel({
          rtl: true,
          items: 1,
          loop: true,
          autoplay: true,
          autoplayTimeout: 5000,
          smartSpeed: 800,
          nav: false,
          dots: true,
          animateOut: "fadeOut", // تأثير تلاشي ناعم
          mouseDrag: true,
          touchDrag: true,
        });
        // Categories Carousel Initialization
        $("#categories-carousel").owlCarousel({
          rtl: true,
          loop: true,
          margin: 10,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayHoverPause: true,
          responsive: {
            0: { items: 2 }, // موبايل: يعرض 2
            600: { items: 3 }, // تابلت: يعرض 3
            1000: { items: 5 }, // شاشات كبيرة: يعرض 5
            1200: { items: 6 }, // شاشات واسعة جداً: يعرض 6
          },
        });
        $(document).ready(function () {
          // Toggle Custom Dropdown
          $(".custom-select-trigger").on("click", function (e) {
            e.stopPropagation();
            const parent = $(this).closest(".custom-select-wrapper");

            // إغلاق أي دروب داون آخر مفتوح
            $(".custom-select-wrapper")
              .not(parent)
              .find(".custom-options")
              .addClass("hidden");
            $(".custom-select-wrapper")
              .not(parent)
              .find("i.fa-chevron-down")
              .removeClass("rotate-180");

            // فتح/إغلاق الحالي
            parent.find(".custom-options").toggleClass("hidden");
            $(this).find("i.fa-chevron-down").toggleClass("rotate-180");
          });

          // Select Option
          $(".option").on("click", function () {
            const val = $(this).text();
            const wrapper = $(this).closest(".custom-select-wrapper");

            wrapper
              .find(".custom-select-trigger span")
              .text(val)
              .removeClass("text-gray-400")
              .addClass("text-brand-blue font-semibold");
            wrapper.find(".custom-options").addClass("hidden");
            wrapper.find("i.fa-chevron-down").removeClass("rotate-180");

            // هنا تقدر تخزن القيمة في Input hidden لو شغال مع Form
            console.log("Selected Value:", $(this).data("value"));
          });

          // إغلاق عند الضغط في أي مكان خارج الـ select
          $(document).on("click", function () {
            $(".custom-options").addClass("hidden");
            $("i.fa-chevron-down").removeClass("rotate-180");
          });
        });
        $("#creative-reviews-carousel").owlCarousel({
          rtl: true,
          margin: 20,
          loop: true,
          autoplay: true,
          dots: false,
          nav: false,
          responsive: {
            0: { items: 1 },
            1024: { items: 2 },
          },
        });

        $(".review-next").click(function () {
          $("#creative-reviews-carousel").trigger("next.owl.carousel");
        });
        $(".review-prev").click(function () {
          $("#creative-reviews-carousel").trigger("prev.owl.carousel");
        });
      });