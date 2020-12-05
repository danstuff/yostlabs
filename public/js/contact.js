$("#contactForm").submit(function(event) {
    event.preventDefault();

    var body = {
        name: $("#name").val(), 
        email: $("#email").val(),
        phone: $("#phone").val().replaceAll(/\D/g, ""),
        message: $("#message").val()
    };

    var errmsg = "";

    if(typeof(body.name) != "string" ||
       typeof(body.email) != "string" ||
       typeof(body.phone) != "string" || 
       typeof(body.message) != "string") {
        errmsg = "Invalid format on one or more form entries.";

    } else if(body.name == "") {
        errmsg = "Please enter your name.";

    } else if(body.email.match(/\w+\@\w+\.\w+/g) == null) {
        errmsg = "Please enter a valid email address.";

    } else if((body.phone.length < 10 || body.phone.length > 20) &&
               body.phone.length != 0) {
        errmsg = "Please enter a valid phone number (not required)."

    } else if(body.message == "" && body.message.length < 999) {
        errmsg = "Please enter a valid message (character limit: 999)."
    }

    if(errmsg == "") {
        $.post("/", body, function() {
            window.location.href = "/submit";
        });
    } else {
        $("#errmsg").html(errmsg);
    }
});
