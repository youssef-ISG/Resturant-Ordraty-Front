      $(document).ready(function () {
          // 1. فتح وإغلاق قائمة الموبايل
          $("#menu-btn").on("click", function () {
            $("#mobile-menu").slideToggle(400).toggleClass("hidden");
            $(this).find("i").toggleClass("fa-bars-staggered fa-xmark");
            $("body").toggleClass("overflow-hidden");
          });

          // 2. التحكم في أكورديون اللغة بالموبايل
          $("#mobile-lang-trigger").on("click", function (e) {
            e.preventDefault();
            const $content = $("#mobile-lang-content");
            const $arrow = $("#mobile-lang-arrow");

            $content.stop().slideToggle(300);
            $arrow.toggleClass("-rotate-90");
          });

          // 3. تغيير شكل الهيدر عند السكرول
          $(window).on("scroll", function () {
            if ($(window).scrollTop() > 50) {
              $("#navbar")
                .addClass("h-20 shadow-md")
                .removeClass("h-24 shadow-sm");
            } else {
              $("#navbar")
                .addClass("h-24 shadow-sm")
                .removeClass("h-20 shadow-md");
            }
          });
        });
        $(document).ready(function () {
          // فتح/إغلاق بوب أب السلة عند الضغط على الأيقونة
          $("#cart-icon-btn").on("click", function (e) {
            e.stopPropagation();
            $("#mini-cart-popup")
              .toggleClass("hidden")
              .toggleClass("flex flex-col");
          });

          // إغلاق البوب أب عند الضغط في أي مكان خارج الحاوية
          $(document).on("click", function (e) {
            if (!$(e.target).closest("#mini-cart-wrapper").length) {
              $("#mini-cart-popup")
                .addClass("hidden")
                .removeClass("flex flex-col");
            }
          });

          // منع إغلاق السلة عند الضغط داخل محتواها
          $("#mini-cart-popup").on("click", function (e) {
            e.stopPropagation();
          });
        });