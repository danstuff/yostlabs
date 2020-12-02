const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    console.log("VIEW index.html");

    fs.readFile("public/index.html", "utf8", function(err, file_str) {
        let item_list = "";
        getItemInfo("%%ALL%%", 
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
        getItemInfo(id, function(info) {
            file_str = file_str.replace("%itemname%", info.name);
            file_str = file_str.replace("%itemimg%", info.img);
            file_str = file_str.replace("%itemdesc%", info.desc);
            file_str = file_str.replace("%itemmsg%", info.msg);
            res.send(file_str);
        });
    });
});

app.listen(port, () => {
    console.log("Starting on port " + port);
});

function getItemInfo(id, itemCallback, doneCallback) {
    let info = {
        id: "NULL",
        name: "Item not found",
        img: "",
        desc: "The item you are looking for is not available.",
        msg: ""
    };

    fs.readFile("public/itemInfo.dat", "utf8", function(err, file_str) {
        let lines = file_str.split("\n");

        for(var i = 0; i < lines.length; i++) {
            let line_data = lines[i].split("%=");

            if(line_data[0] == id || id == "%%ALL%%") {
                info.id = line_data[0];
                info.name = line_data[1];
                info.img = "<img src=\"../img/" + line_data[2] + "\"></img>";
                info.desc = line_data[3];
                info.msg = "Hello, \nI am interested in the " + line_data[1] + "."; 

                itemCallback(info);

                if(id != "%%ALL%%") {
                    break;
                }
            }
        }

        if(doneCallback != null) {
            doneCallback();
        }
    });
}
