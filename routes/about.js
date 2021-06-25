var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('about', { contact: { header: "Contact Me", message: "" } });
});

module.exports = router;
