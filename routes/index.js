var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

var itemsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'items.json')));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { items: itemsData });
});

module.exports = router;
