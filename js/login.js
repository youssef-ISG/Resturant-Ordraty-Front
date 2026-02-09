      $(document).ready(function () {
        $("#toggle-login-password").on("click", function () {
          const passwordField = $("#login-password");
          const eyeIcon = $("#login-eye-icon");

          const type =
            passwordField.attr("type") === "password" ? "text" : "password";
          passwordField.attr("type", type);

          eyeIcon.toggleClass("fa-eye fa-eye-slash");

          $(this).addClass("scale-90");
          setTimeout(() => $(this).removeClass("scale-90"), 100);
        });
      });