var express = require('express');
var router = express.Router();

var articles = require('../data/articles.json');
var publications = require('../data/publications.json');
articles.reverse();
publications.reverse();

/* GET home page. */
router.get('/', function (req, res, next) {
    var data = {
        title: 'Adégòkè Ọbasá - Software Engineer based in Nigeria',
        articles: articles,
        publications: publications
    };
    res.render('index', data);
});

module.exports = router;