console.log("*******************************************************************")
console.log("*                       Starting Server                           *")
console.log("*******************************************************************")

const PORT=5000;
var http = require('http');
var express = require("express");
var app = express();

  app.get("/test", function(req, res){
    res.send("Test works");
  });

var server = app.listen(PORT, function(){
  console.log("Listening on port " + PORT);
});
