var express = require('express');
var router = express.Router();

var articles = require('../data/articles.json');

/* GET home page. */
router.get('/', function (req, res, next) {
    var data = {
        title: 'Adégòkè Obasá - Software Engineer based in Nigeria',
        'articles': articles
    };
    res.render('index', data);
});

module.exports = router;