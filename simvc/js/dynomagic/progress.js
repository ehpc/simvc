/*
 * Progress Circle Javascript Library
 * Copyright 2010, Eugene Maslovich
 * ehpc@yandex.ru
 * http://ehpc.org.ru/
 *
 */

function progressShowProgress($el, $text) {
    var height = $el.height();
    var width = $el.width();
    $el.prepend('<div style="position: absolute; display: none; z-index: 9000;" class="progressPlugin"><div>'+$text+'</div><img src="'+dynomagicImgUri+'ajax-loader.gif" /></div>');
    $progress = $el.find(".progressPlugin");
    $progress.css("background", "#333333");
    $progress.css("text-align", "center");
    $progress.css("color", "#FFFFFF");
    $progress.css("height", height+"px");
    $progress.css("width", width+"px");
    $progress.find("div").css("margin-top", ((height>>1)-20)+"px");
    $progress.find("img").css("margin", "7px 0 0 0");
    $progress.show();
}

function progressHideProgress($el) {
    $progress = $el.find(".progressPlugin");
    $progress.remove();
}