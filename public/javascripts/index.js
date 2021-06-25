$(".thumbnail").each(function(i) {
    var t = $(this);
    window.setTimeout(function() {
        t.css("display", "inline-block");
    }, i*100);
});

$(".thumbnail").click(function() {
    window.location.href = "item/" + $(this).attr("id");
});
