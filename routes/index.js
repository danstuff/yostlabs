var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

//data about the items for sale
var itemsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'items.json')));

// auto-mailing system
var nodeMailer = require('nodemailer');
var { google } = require('googleapis');

var OAuth2 = google.auth.OAuth2;

var mailInfo = require('../secure/mailInfo.js');

var OAuth2Client = new OAuth2(mailInfo.transport.auth.clientId, mailInfo.transport.auth.clientSecret);

OAuth2Client.setCredentials({ refresh_token: mailInfo.transport.auth.refreshToken });
mailInfo.transport.auth.accessToken = OAuth2Client.getAccessToken();

var transport = nodeMailer.createTransport(mailInfo.transport);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { items: itemsData });
});

/* POST auto mail on form */
router.post('/', function(req, res, next) {
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
                console.log('err');
                next(createError(406));
            }
        });
    }
});

module.exports = router;
