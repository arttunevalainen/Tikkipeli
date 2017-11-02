var express = require('express');
var router = express.Router();



router.get('/', function (req, res) {
  res.send('homepage');
});


router.get('/kek', function (req, res) {
  res.send('kek');
});



module.exports = router;