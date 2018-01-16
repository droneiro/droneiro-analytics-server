module.exports = function() {
  var express = require('express');
  var request = require('request');
  var router = express.Router();

  router.get('/', function(req, res){
    res.render('welcome', {});
  });

  return router;
}
