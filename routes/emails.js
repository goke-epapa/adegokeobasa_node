var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mandrill = require("node-mandrill")(config.mandrill.key);

router.put('/', function (req, res, next) {
    req.checkBody('name', 'Invalid name').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('email', 'Invalid email supplied').isEmail();
    req.checkBody('subject', 'Invalid subject').notEmpty();
    req.checkBody('message', 'Invalid messsage').notEmpty();

    // Validate input
    var errors = req.validationErrors();
    if (errors) {
        console.log("Contact form validation error: ", errors);
        res.send({status: 'error', data: errors, code: 401, message: 'Invalid parameters'});
    } else {

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
                console.log("Mandrill Error>>", JSON.stringify(error));
                // Log Error
            } else {
                // Log Response to File
                console.log("Mandrill Success>>", response);
            }
        });

        res.send({status: 'success', data: {}});
    }
});

module.exports = router;