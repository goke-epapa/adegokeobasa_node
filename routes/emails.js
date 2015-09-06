var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mandrill = require("node-mandrill")(config.mandrill.key);
var logger = require('../logger/general-logger');
var errorLogger = require('../logger/error-logger');
var request = require('request');

router.put('/', function (req, res, next) {
    req.checkBody('name', 'Invalid name').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('email', 'Invalid email supplied').isEmail();
    req.checkBody('subject', 'Invalid subject').notEmpty();
    req.checkBody('message', 'Invalid messsage').notEmpty();
    req.checkBody('captcha', 'Invalid captcha').notEmpty();

    // Validate input
    var errors = req.validationErrors();
    res.set('Content-Type', 'application/json');

    if (errors) {
        errorLogger.error("Contact form validation error: ", errors);
        res.send({status: 'error', data: errors, code: 401, message: 'Invalid parameters'});
    } else {
        // Validate ReCaptcha
        //request.post({
        //    url: 'https://www.google.com/recaptcha/api/siteverify',
        //    form: {secret: '6LdPbAwTAAAAAKJiADr4sJnOyDuSsZSfyTSyLHxJ', response: captcha}
        //}, function (err, httpResponse, body) {
        //    console.log(err, httpResponse, body);
        //});

        var name = req.body.name;
        var email = req.body.email;
        var subject = req.body.subject;
        var text = "Name: " + name + "\nEmail: " + email + "\n\nMessage\n" + req.body.message;

        mandrill('/messages/send', {
            message: {
                to: [{email: config.mandrill.username, name: 'Adegoke Obasa'}],
                from_email: config.website.contact_from_email,
                from_name: config.website.url,
                subject: subject,
                text: text
            }
        }, function (error, response) {
            if (error) {
                // Log Error
                errorLogger.error("Mandrill Error>>");
                errorLogger.error(error);

                res.status(500);
                res.json({status: 'error', message: 'Unable to send email'});
            } else {
                // Log Response
                logger.info("Mandrill Success>>");
                logger.info(response);

                res.json({status: 'success', data: {}});
            }
        });
    }
});

module.exports = router;