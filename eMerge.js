console.log("*******************************************************************")
console.log("*                       Starting Server                           *")
console.log("*******************************************************************")

var port = process.env.PORT || 8080;
var http = require('http');
var express = require("express");
var app = express();

  app.get("/test", function(req, res){
    res.send("Test works");
  });

var server = app.listen(port, function(){
  console.log("Listening on port " + port);
});
