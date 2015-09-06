var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mandrill = require("node-mandrill")(config.mandrill.key);

router.post('/', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    var text = req.body.message;


    mandrill('/messages/send', {
        message: {
            to: [{email: config.mandrill.username, name: 'Adegoke Obasa'}],
            from_email: config.website.contact_from_email,
            from_name: config.website.url,
            subject: subject,
            text: text
        }
    }, function(error, response)
    {
        //uh oh, there was an error
        if (error) console.log( JSON.stringify(error) );

        //everything's good, lets see what mandrill said
        else console.log(response);
    });

    res.send({status : 'success', data : {}});
});

module.exports = router;