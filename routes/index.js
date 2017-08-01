var express = require('express');
var router = express.Router();
const JWT = require('jsonwebtoken')
const crypto = require('crypto')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',function (req, res, next) {

})


module.exports = router;
