const fs = require("fs");

module.exports = {
    get: function(id, itemCallback, doneCallback) {
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

                if((line_data[0] == id || id == "%%ALL%%") && line_data.length >= 4) {
                    info.id = line_data[0];
                    info.name = line_data[1];
                    info.img = "<img src=\"../img/" + line_data[2] + "\"></img>";
                    info.desc = line_data[3];
                    info.msg = "Hello, \nI am interested in the " + line_data[1] + "."; 

                    if(itemCallback != null) {
                        itemCallback(info);
                    }

                    if(id != "%%ALL%%") {
                        break;
                    }
                }
            }

            if(doneCallback != null) {
                doneCallback(info);
            }
        });
    }
};
