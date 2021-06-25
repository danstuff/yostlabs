var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

var itemsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'items.json')));

/* GET item page. */
router.get('/:id', function(req, res, next) {

    // search for item in items list
    if(req.params.id in itemsData) {
        var itemData = itemsData[req.params.id];

        res.render('item', { item: itemData,
            message: 'Hello, \n I am interested in the ' + itemData.name + '.'});

    // if not found, throw a 404
    } else {
        next(createError(404));
    }
});

module.exports = router;
