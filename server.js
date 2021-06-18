const express = require("express");
const fs = require("fs");
const nmailer = require("nodemailer");
const bparser = require("body-parser");
const { google } = require("googleapis");

const mailInfo = require("./secure/mailInfo");
const itemInfo = require("./itemInfo");

const OAuth2 = google.auth.OAuth2;

const app = express();
const port = 3000;

app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());

const OAuth2Client = new OAuth2(mailInfo.transport.auth.clientId, mailInfo.transport.auth.clientSecret);

OAuth2Client.setCredentials({ refresh_token: mailInfo.transport.auth.refreshToken });
mailInfo.transport.auth.accessToken = OAuth2Client.getAccessToken();

const transport = nmailer.createTransport(mailInfo.transport);

app.get("/", (req, res) => {
    console.log("GET index.html");

    fs.readFile("public/index.html", "utf8", function(err, file_str) {
        let item_list = "";
        itemInfo.get("%%ALL%%", 
            function(info) {
                item_list += 
                    "<div class=\"item-display thumbnail\" id=\""+info.id+"\">" +
                    "<i class=\"fas fa-question\"></i>" +
                    info.img +
                    "<p>"+info.name+"</p>"+
                    "</div>";
            },
            function() {
                file_str = file_str.replace("%itemlist%", item_list);    
                res.send(file_str);
            });
    });
});

app.get("/about", (req, res) => {
    console.log("GET about.html");
    res.sendFile("about.html", { root: "public" });
});

app.get("/resume", (req, res) => {
    console.log("GET resume.html");
    res.sendFile("resume.html", { root: "public" });
});

app.get("/submit", (req, res) => {
    console.log("GET submit.html");
    res.sendFile("submit.html", { root: "public" });
});

app.get("/item/:id", (req, res) => {
    let id = req.params.id;
    console.log("GET item.html ID " + id);

    fs.readFile("public/item.html", "utf8", function(err, file_str) {
        itemInfo.get(id, null, function(info) {
            file_str = file_str.replace("%itemname%", info.name);
            file_str = file_str.replace("%itemimg%", info.img);
            file_str = file_str.replace("%itemslides%", info.slides);
            file_str = file_str.replace("%itemdesc%", info.desc);
            file_str = file_str.replace("%itemmsg%", info.msg);
            res.send(file_str);
        });
    });
});

app.get("*", (req, res) => {
    console.log("GET "+req.url);
    fs.readFile("public/"+req.url, function(err, file) {
        if(err) {
            res.redirect("/");
        } else {
            res.sendFile(req.url, { root: "public" });
        }
    });

});

app.post("/", (req, res) => {
    console.log("POST");

    if(mailInfo.validate(req.body)) {
        var opt = mailInfo.options;
        opt.subject = "YostLabs - New Message from " + req.body.name;
        opt.text = "Your friendly neighborhood mail bot here!\n" +
            req.body.name + " sent you a message on YostLabs.net:\n\n" +
            req.body.message + "\n\n" +
            "Here's their contact info:\n\n" +
            req.body.email + "\n" +
            req.body.phone + "\n\n" + 
            "Have a good day!";

        transport.sendMail(opt, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log("POST MAILED");
            }
        });
    } else {
        console.log("POST DENIED");
    } 

    res.send("OK");
});

app.listen(port, () => {
    console.log("Starting on port " + port);
});
