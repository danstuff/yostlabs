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

//google mailer service
const OAuth2Client = new OAuth2(mailInfo.transport.auth.clientId, mailInfo.transport.auth.clientSecret);

OAuth2Client.setCredentials({ refresh_token: mailInfo.transport.auth.refreshToken });
mailInfo.transport.auth.accessToken = OAuth2Client.getAccessToken();

const transport = nmailer.createTransport(mailInfo.transport);

//logging
var log4js = require("log4js");
log4js.configure({
    appenders: {
        out: { type: "console" },
        app: { type: "file", filename: "./secure/"+(Date.now())+".log" }
    },
    categories: {
        default: { appenders: ["out", "app"], level: "debug" }
    }
});

var logger = log4js.getLogger();
logger.level = "debug"

//index
app.get("/", (req, res) => {
    logger.debug("GET index.html");

    //replace macros in the index with a list of items
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

//basic pages
app.get("/about", (req, res) => {
    logger.debug("GET about.html");
    res.sendFile("about.html", { root: "public" });
});

app.get("/resume", (req, res) => {
    logger.debug("GET resume.html");
    res.sendFile("resume.html", { root: "public" });
});

app.get("/submit", (req, res) => {
    logger.debug("GET submit.html");
    res.sendFile("submit.html", { root: "public" });
});

//item page (includes macros)
app.get("/item/:id", (req, res) => {
    let id = req.params.id;
    logger.debug("GET item.html ID " + id);

    //replace macros in the item page with the item data
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

//anything else
app.get("*", (req, res) => {
    fs.readFile("public/"+req.url, function(err, file) {
        if(err) {
            logger.error(err);
            res.redirect("/");
        } else {
            res.sendFile(req.url, { root: "public" });
        }
    });

});

//mail sending
app.post("/", (req, res) => {
    logger.debug("POST");

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
                logger.error(err);
            } else {
                logger.debug("POST MAILED");
            }
        });
    } else {
        logger.debug("POST DENIED");
    } 

    res.send("OK");
});

//launch
app.listen(port, () => {
    logger.debug("Starting on port " + port);
});
