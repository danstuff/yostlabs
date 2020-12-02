$(".thumbnail").each(function(i) {
    var t = $(this);
    window.setTimeout(function() {
        t.css("display", "inline-block");
    }, i*100);
});

$(".thumbnail").hover(
    function() {
        var p = $(this).children("p");
        p.animate({ height: "32px", opacity: "100%" }, 100);
    }, 
    function() {
        var p = $(this).children("p");
        p.animate({ height: "0", opacity: "0%" }, 100);
    });

