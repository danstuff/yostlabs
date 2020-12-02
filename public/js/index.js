$(".thumbnail").each(function(i) {
    var t = $(this);
    window.setTimeout(function() {
        t.css("display", "inline-block");
    }, i*100);
});

$(".thumbnail").hover(
    function() {
        $(this).children("p").addClass("p-show");
    }, 
    function() {
        $(this).children("p").removeClass("p-show");
    });

$(".thumbnail").click(function() {
    var src = $(this).children("img").attr("src");
    window.location.href = "item.html?src="+src;
});
