var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('init', { title: 'AudioApp' });
});

router.get('/help', function(req, res) {
  res.render('help');
});

module.exports = router;
