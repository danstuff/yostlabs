const express = require("express");
const fs = require("fs");

const itemInfo = require("./itemInfo");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    console.log("VIEW index.html");

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
    console.log("VIEW about.html");
    res.sendFile("about.html", { root: "public" });
});

app.get("/item/:id", (req, res) => {
    let id = req.params.id;
    console.log("VIEW item.html ID " + id);

    fs.readFile("public/item.html", "utf8", function(err, file_str) {
        itemInfo.get(id, null, function(info) {
            file_str = file_str.replace("%itemname%", info.name);
            file_str = file_str.replace("%itemimg%", info.img);
            file_str = file_str.replace("%itemdesc%", info.desc);
            file_str = file_str.replace("%itemmsg%", info.msg);
            res.send(file_str);
        });
    });
});

app.get("*", (req, res) => {
    fs.readFile("public/"+req.url, function(err, file) {
        if(err) {
            res.redirect("/");
        } else {
            res.sendFile(req.url, { root: "public" });
        }
    });

});

app.listen(port, () => {
    console.log("Starting on port " + port);
});
