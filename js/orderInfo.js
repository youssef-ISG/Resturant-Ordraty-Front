$(document).ready(function () {
          // 1. توليد الـ Date Pills لـ 7 أيام قادمة
          const container = $("#date-pills-container");
          const days = [
            "الأحد",
            "الاثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
          ];
          const months = [
            "يناير",
            "فبراير",
            "مارس",
            "إبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر",
          ];

          for (let i = 0; i < 7; i++) {
            let date = new Date();
            date.setDate(date.getDate() + i);

            const dayName = i === 0 ? "اليوم" : days[date.getDay()];
            const dayNum = date.getDate();
            const monthName = months[date.getMonth()];
            const fullDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${dayNum.toString().padStart(2, "0")}`;

            container.append(`
            <div class="date-pill flex-shrink-0 cursor-pointer p-4 rounded-[2rem] border-2 border-gray-100 bg-white text-center min-w-[100px] transition-all hover:border-brand-red/30 ${i === 0 ? "active-pill" : ""}" data-val="${fullDate}">
                <span class="block text-[10px] font-black text-gray-400 mb-1">${dayName}</span>
                <strong class="block text-xl font-black text-brand-blue">${dayNum}</strong>
                <span class="block text-[9px] font-bold text-gray-400 uppercase mt-1">${monthName}</span>
            </div>
        `);

            if (i === 0) $("#selected-delivery-date").val(fullDate);
          }

          // 2. تحديث التنسيق عند اختيار التاريخ
          $(document).on("click", ".date-pill", function () {
            $(".date-pill")
              .removeClass("active-pill border-brand-red bg-red-50/30")
              .addClass("border-gray-100 bg-white");
            $(this)
              .addClass("active-pill border-brand-red bg-red-50/30")
              .removeClass("border-gray-100 bg-white");
            $("#selected-delivery-date").val($(this).data("val"));
          });

          // 3. ستايل افتراضي لأول Pill
          $(".date-pill.active-pill")
            .addClass("border-brand-red bg-red-50/30")
            .removeClass("border-gray-100 bg-white");
        });