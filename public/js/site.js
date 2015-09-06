(function($){
    function changeTemporarily(elem, oldHtml, newHtml){
        elem.html(newHtml);
        setTimeout(function () {
            elem.html(oldHtml);
        }, 2000);
    }

    $(document).ready(function () {
        var fields = ['name', 'email', 'subject', 'message'];
        var data = {};
        var title = $("#titleHolder");
        $("#submitBtn").click(function () {
            var _this = $(this);
            var validationError = false;
            $(fields).each(function (i, v) {
                var field = $("#" + v);
                if(field.val().length == 0){
                    field.focus();
                    validationError = true;
                    return false;
                } else {
                    data[v] = field.val();
                }
            });

            if(validationError){
                return;
            }

            // Recaptcha
            data.captcha = grecaptcha.getResponse();

            if(data.captcha) {
                _this.attr("disabled", true);
                title.html("<i class='fa fa-spin fa-spinner fa-4x'></i>");
                $.ajax({
                    method: "PUT",
                    data: data,
                    url: "/emails",
                    dataType: "json",
                    error: function () {
                        changeTemporarily(title, "Wanna Hire Me?", "I'm afraid");
                    },
                    success: function () {
                        changeTemporarily(title, "Wanna Hire Me?", "Thanks for reaching out to me, I will get back to you soonest. :)");
                        $("#resetBtn").click();
                    },
                    complete: function () {
                        _this.attr('disabled', false);
                    }
                });
            }
        });
    });
})($);