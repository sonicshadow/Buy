﻿setTimeout(function () {
    var UserName = $("#UserName").val()
    if (UserName != "") {
        $("#submit").prop("disabled", false);
        $("[name='clearVal']").removeClass("hidden");
    }
}, 500);

//清除val
$("[name='clearVal']").click(function () {
    $(this).addClass("hidden");
    $(this).parent().find("input").val(null);

    $("#submit").prop("disabled", true);
});

$("#submit").click(function (e) {
    var data = {
        UserName: $("#UserName").val(),
        Password: $("#Password").val()
    }

    $.ajax({
        type: "POST",
        url: comm.action("Login", "Account"),
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.State == "Success") {
                if (data.Result.UserType == 1) {
                    if ($("#returnUrl").val() != "") {
                        location = $("#returnUrl").val();
                    }
                    else {
                        location = comm.action("Index", "UserManage");
                    }
                } else {
                    if (data.Result.IsActivation) {
                        if ($("#returnUrl").val() != "") {
                            location = $("#returnUrl").val();
                        }
                        else {
                            location = comm.action("Index", "Coupon");
                        }
                    } else {
                        location = comm.action("Activation", "Account");
                    }
                }
            }
            else {
                comm.promptBox(data.Message)
            }
        }
    });
});

$(".account-input input").keyup(function () {
    var data = {
        UserName: $("#UserName").val(),
        Password: $("#Password").val(),
    };

    if ($(this).val() == "") {
        $(this).parent().find("[name='clearVal']").addClass("hidden");
    } else {
        $(this).parent().find("[name='clearVal']").removeClass("hidden");
    }

    if (data.UserName != "" && data.Password != "") {
        $("#submit").prop("disabled", false);
    } else {
        $("#submit").prop("disabled", true);
    }
});

$("#UserName,#Password").keyup(function (e) {
    if (e.keyCode == 13) {
        $("#submit").click();
    }
 
});

$("#btnlogin").click(function (e) {
    var data = {
        UserName: $("#UserName").val(),
        Password: $("#Password").val()
    }
    $.ajax({
        type: "POST",
        url: comm.action("Login", "Account"),
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.State == "Success") {
                if ($("#returnUrl").val() != "") {
                    location = $("#returnUrl").val();
                }
                else {
                    location = comm.action("Index", "UserManage");
                }
            }
            else {
                comm.alter(0, data.Message)
            }
        }
    });
});
