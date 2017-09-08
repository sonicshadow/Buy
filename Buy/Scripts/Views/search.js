﻿var platform = "",
    sort = "",
    filter="";
var canLoadPage = true;

function clear(target) {
    target.children().remove();
    var html = "";
    html += '<li class="loadModule loadModule-dataIng" data-page="0" data-next="true">加载中</li>';
    target.append(html);
}

//load优惠券
function loadcoupon() {
    if (!canLoadPage) {
        return;
    }
    var $coupon = $("#coupon");
    var $page = $coupon.find("ul li[data-page]");
    if (!$page.data("next")) {
        return;
    }
    var page = $page.data("page") + 1;
    canLoadPage = false;

    $.ajax({
        type: "GET",
        url: comm.action("GetList", "coupon"),
        data: {
            page: page,
            sort: sort,
            platforms: platform,
            filter: filter,
            orderByTime: false
        },
        dataType: "html",
        success: function (data) {
            $page.remove();
            var $data = $(data);

            $coupon.find(">ul").append($data);
            //comm.lazyloadALL();
        },
        complete: function () {
            canLoadPage = true;
        }
    });

}

loadcoupon();

//搜索


//平台切换
$(".platform").click(function (e) {
    $(".platform").removeClass("active");
    $(this).addClass("active");
    sort = $(this).data("platform");
    comm.addHistory("url", comm.action("SearchConfirm", "coupon", {
        platform: platform,
        sort: sort,
        filter:''
    }));

    clear("#coupon ul");

    loadcoupon();
});

//排序切换
$(".sort").click(function (e) {
    $(".sort").removeClass("active");
    $(this).addClass("active");
    sort = $(this).data("sort");
    comm.addHistory("url", comm.action("SearchConfirm", "coupon", {
        platform: platform,
        sort: sort,
        filter:''
    }));

    clear("#coupon ul");

    loadcoupon();
});