﻿$("#btnBack").goback(comm.action("Index", "Coupon"));

if ($("#ID").length > 0) {
    function GetDetailImgs() {
        $.ajax({
            type: "POST",
            url: comm.action("GetDetailImgs", "Coupon"),
            data: { id: $("#ID").val() },
            dataType: "json",
            success: function (data) {
                if (data.State == "Success") {
                    var html = "";
                    if (data.Result.Data.length > 0) {
                        var lazyloadimg = $("#lazyloadimg").attr("src");
                        var dttop = $("#detailTit").offset().top;
                        var dth = $("#detailTit").height();
                        $.each(data.Result.Data, function (i, n) {
                            html += '<img src="' + lazyloadimg + '" data-original="' + n + '" />';
                        })
                        $("[name=poductDetail]").append(html);
                        comm.lazyloadALL();

                        if ($("[name='poductDetail'] img").length > 0) {
                            $("#pullUpLoad").hide();
                        }
                    }
                }
            }
        });
    }
}

var poffSetTop = $("#detailTit").offset().top;
var pHeight = $("#detailTit").height();
var dVal = $("body").height() - $(window).height();
var pState = false;
var scState = false;
var cUserID = $("#cUserID").val();

if ($("body").height() == $(window).height()) {
    pState = true;
}

$(window).scroll(function (e) {
    if ($(window).scrollTop() == dVal && dVal != 0) {
        pState = true;
    }

    if ($(window).scrollTop() > 0) {
        $(".setScrollTop").fadeIn();
    } else {
        $(".setScrollTop").fadeOut();
    }
    //if ($(window).scrollTop() >= Math.floor(poffSetTop + pHeight)) {
    //    pState = false;
    //    scState = true;
    //    $("#pullUpLoad").fadeIn();
    //} else {
    //    if (scState) {
    //        $("#pullUpLoad").fadeOut();
    //        pState = false;
    //    }
    //}
});

//返回顶部
$(".setScrollTop").click(function () {
    $('body,html').animate({ scrollTop: 0 }, 500);
});

//上刷新事件
function kt_touch(contentId) {
    var update1 = $("#pullUpLoad");
    var _start = 0,
        _end = 0,
        _content = document.getElementById(contentId);
    if (_content) {
        _content.addEventListener("touchstart", touchStart, false);
        _content.addEventListener("touchmove", touchMove, false);
        _content.addEventListener("touchend", touchEnd, false);
    }
    function touchStart(event) {
        //event.preventDefault();
        if (!event.touches.length) return;
        var touch = event.touches[0];
        _start = touch.pageY;
    }

    function touchMove(event) {
        // event.preventDefault();
        if (!event.touches.length) return;
        var touch = event.touches[0];

        _end = (_start - touch.pageY);
        if (_end > 0 && _end <= 180) {
            update1.find("span").css("transform", "rotate(" + parseInt(_end) + "deg)");
        }
    }

    function touchEnd(event) {
        if (_end >= 180) {
            update1.find(".loading").removeClass("hidden");
            update1.find("span").hide();
            GetDetailImgs();
        } else {
            update1.find("span").css("transform", "rotate(0deg)");
        }
    }
}
kt_touch('detail');

//淘口令
$(".mask").click(function (e) {
    $(".pwdMask").addClass("hidden");
    //$("body").css("overflow", "auto");
    comm.mask2.hide();
});

$("[name='clipboard']").click(function (e) {
    $.ajax({
        type: "GET",
        url: comm.action("GetPwd", "Coupon"),
        data: { id: $("#ID").val(), cUserID: cUserID },
        dataType: "json",
        success: function (data) {
            switch (data.State) {
                case "Success":
                    {
                        if ($("#Platform").val() == "TaoBao" || $("#Platform").val() == "TMall") {
                            $("#pwdMask-text").text(data.Result.Data);
                            $(".pwdMask").attrdata("clipboard-text", data.Result.Data);
                            $(".pwdMask").removeClass("hidden");
                            comm.mask2.show();
                        } else {
                            location = data.Result.Data;
                        }
                    }
                    break;
                case "NotActive":
                    {
                        location = comm.action("Activation", "Account");
                    }
                    break;
                case "NotReceive":
                    {
                        location = comm.action("Index", "Coupon");
                    }
                    break;
                case "NotLogin":
                    {
                        location = comm.action("Login", "Account");
                    }
                    break;
                default:
                    comm.promptBox(data.Message);
                    break;
            }
        }
    });
});

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

//复制粘贴板
var clipboard = new Clipboard('.pwdMask');
clipboard.on('success', function (e) {
    $(".pwdMask").addClass("hidden");
    $("body").css("overflow", "auto");
    comm.mask2.hide();
    alert("复制成功,请打开淘宝APP查看");
});
clipboard.on('error', function (e) {
    selectText("pwdMask-text");
    $("#pwd-error").text("*无法复制，请长按复制，要选¥");
    $(".pwdMask").removeClass("hidden");
    $("body").css("overflow", "hidden");
    comm.mask2.show();
});
$(".pwdMask").click(function (e) {
});

$("#btnShare").click(function (e) {
    $("#detail").addClass("hidden");
    $("#share").removeClass("hidden");
    if ($("#Output").children().length <= 0) {
        $.ajax({
            type: "GET",
            url: comm.action("GetPwd", "Coupon"),
            data: { id: $("#ID").val() },
            dataType: "json",
            beforeSend: function (XMLHttpRequest) {
                $("#shareText-load").removeClass("hidden");
            },
            success: function (data) {
                if (data.State == "Success") {
                    var share_name = $("#share_name").val();
                    var share_or_price = $("#share_or_price").val();
                    var share_price = $("#share_price").val();
                    var share_url = $("#share_url").val();
                    var val = share_name + "\n【在售价】" + share_or_price + "元\n【券后价】" + share_price + "元\n【下单链接】" + share_url + "\n-------------------------------------\n复制这条信息，{" + data.Result.Data + "}，打开【手机淘宝】即可查看";

                    $("#shareText-load").addClass("hidden");

                    $("#shareText").val(val);
                    $("#shareTextBtn").attrdata("clipboard-text", val);

                    //canvas截屏
                    //var img = document.getElementById('shareImgModule_img');
                    //var data = getBase64Image(img);
                    //$('#shareImgModule_img').prop("src", data);

                    //html2canvas(document.getElementById("shareImgModule"), {
                    //    allowTaint: true,
                    //    taintTest: true,
                    //    useCORS: true,
                    //    onrendered: function (canvas) {
                    //        var url = canvas.toDataURL();
                    //        var img = new Image();
                    //        img.src = url;
                    //        document.getElementById('Output').appendChild(img);
                    //        $("#shareImgModule").addClass("hidden");
                    //    }
                    //});

                    var canvas = document.createElement("canvas");
                    var cxt = canvas.getContext("2d");
                    canvas.width = $("#shareImgModule").width();
                    canvas.height = $("#shareImgModule").height();
                    cxt.fillStyle = "#ffffff";
                    cxt.fillRect(0, 0, $("#shareImgModule").width(), $("#shareImgModule").height());
                    var share_img = document.getElementById('shareImgModule_img');
                    var qrcode = document.getElementById('qrcode');
                    var platformLogo = document.getElementById('platformLogo');
                    cxt.fillStyle = "#ffffff";
                    cxt.drawImage(share_img, 0, 0, $("#shareImgModule_img").width(), $("#shareImgModule_img").height());
                    cxt.drawImage(qrcode, 215, 305, $("#qrcode").width(), $("#qrcode").height());
                    cxt.drawImage(platformLogo, 5, 305, $("#platformLogo").width(), $("#platformLogo").height());
                    var biaotword = $('#share_name').val();
                    var biaotword1 = biaotword.substring(0, 12);
                    var biaotword2 = biaotword.substring(12, 22);
                    cxt.font = "14px Helvetica Neue";
                    cxt.fillStyle = "rgba(0,0,0,0.87)";
                    cxt.fillText(biaotword1, $("#platformLogo").width()+9, 317);
                    cxt.fillText(biaotword2, 5, 336);

                    cxt.font = "12px Helvetica Neue";
                    cxt.fillStyle = "#ff5913";
                    cxt.fillText("长按识别二维码", 212, 398);

                    cxt.font = "12px Helvetica Neue";
                    cxt.fillStyle = "#ff5913";
                    cxt.fillText("¥", 5, 365);

                    cxt.font = "24px Helvetica Neue";
                    cxt.fillStyle = "#ff5913";
                    cxt.fillText($("#share_price").val(), 15, 365);

                    cxt.font = "12px Helvetica Neue";
                    cxt.fillStyle = "rgba(0,0,0,0.54)";
                    cxt.fillText("在售价 ¥ " + $("#share_or_price").val(), 110, 362);

                    cxt.beginPath();
                    cxt.moveTo(110, 358);
                    cxt.lineTo($("#originalPrice").width()+110, 358);
                    cxt.strokeStyle = "rgba(0,0,0,0.54)";
                    cxt.stroke();
                    cxt.closePath();

                    cxt.beginPath();
                    cxt.lineWidth = "1";
                    cxt.strokeStyle = "#ffd500";
                    cxt.rect(23, 378, 40, 16);
                    cxt.stroke();

                    cxt.fillStyle = "#ffd500";
                    cxt.fillRect(5, 377, 18, 18);

                    cxt.font = "12px Helvetica Neue";
                    cxt.fillStyle = "rgba(0,0,0,0.87)";
                    cxt.fillText("券", 8, 390);

                    cxt.font = "12px Helvetica Neue";
                    cxt.fillStyle = "rgba(0,0,0,0.87)";
                    cxt.fillText($(".coupon-tab-val").text(), 25, 390);


                    var url = canvas.toDataURL("image/jpeg");
                    var img = new Image();
                    img.src = url;
                    document.getElementById('Output').appendChild(img);

                    $("#shareImgModule").addClass("hidden");
                }
            }
        });
    }
});

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL
}

//复制分享文案
var clipShareText = new Clipboard('#shareTextBtn');
clipShareText.on('success', function (e) {
    alert("复制成功！可粘贴文案");
    $("#shareText-tips").text("（文案已复制，可粘贴文案）");
});
clipShareText.on('error', function (e) {
    selectText("pwdMask-text");
    alert("*无法复制，请长按文案复制");
    $("#shareText-tips").text("（无法复制，请长按文案复制）");
});

$("#shareback").click(function (e) {
    $("#detail").removeClass("hidden");
    $("#share").addClass("hidden");
    $("#shareText-tips").text("");
});

//收藏按钮
$("#collect_btn").click(function (e) {
    var $this = $(this);
    if ($this.hasClass("active")) {
        var data = {
            id: $this.attr("data-id"),
        };
        $.ajax({
            type: "POST",
            url: comm.action("Delete", "Favorite"),
            data: data,
            dataType: "json",
            success: function (data) {
                if (data.State == "Success") {
                    $this.removeClass("active");
                    $this.attr("data-id", $("#ID").val());
                    comm.promptBox("取消收藏");
                } else {
                    comm.promptBox(data.Message);
                }
            }
        });
    } else {
        var data = {
            CouponID: $this.attr("data-id"),
            Type: "Coupon"
        };
        $.ajax({
            type: "POST",
            url: comm.action("Create", "Favorite"),
            data: data,
            dataType: "json",
            success: function (data) {
                if (data.State == "Success") {
                    $this.addClass("active");
                    $this.attr("data-id", data.Result);
                    comm.promptBox("收藏成功");
                } else {
                    comm.promptBox(data.Message);
                }
            }
        });
    }
});
