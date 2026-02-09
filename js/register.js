$(document).ready(function () {
        // منطق إظهار وإخفاء كلمة المرور
        $("#toggle-password").on("click", function () {
          const passwordField = $("#password-field");
          const eyeIcon = $("#eye-icon");

          // تبديل نوع الـ input
          const type =
            passwordField.attr("type") === "password" ? "text" : "password";
          passwordField.attr("type", type);

          // تبديل أيقونة العين
          eyeIcon.toggleClass("fa-eye fa-eye-slash");

          // إضافة أنيميشن بسيط عند الضغط
          $(this).addClass("scale-90");
          setTimeout(() => $(this).removeClass("scale-90"), 100);
        });
      });