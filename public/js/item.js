function getParam(name) {
    var res = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return res[1] || 0;
}

var src = getParam("src");

if(src != "undefined") {
    $(".showcase").append("<img src=\""+src+"\"></img>");
}
