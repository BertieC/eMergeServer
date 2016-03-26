console.log("*******************************************************************")
console.log("*                       Starting Server                           *")
console.log("*******************************************************************")

var port = process.env.PORT || 8080;
var http = require('http');
var express = require("express");
var geolib = require("geolib");
var app = express();
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://torrid-fire-226.firebaseio.com");
var serviceIndex = 0;

myFirebaseRef.child("servicesIndex").once('value', function(snapshot){
   serviceIndex = snapshot.val();
 });

 console.log("ServiceIndex: " + ServiceIndex);

//just an test call for debugging
  app.get("/test", function(req, res){
    res.send("Test works");
  });

//Adds new users to the database "Registers them"
  app.get("/addUsr", function(req, res){
    var fname = req.param("fname");
    var lname = req.param("lname");
    var town = req.param("town");
    var phone = req.param("phone");
    var usrRef = myFirebaseRef.child("citizens").child(phone);

    usrRef.set(
      {
      "fname":fname,
      "lname":lname,
      "town":town
    });
    console.log('*************************');
    console.log("*    added new User     *");
    console.log('*************************');
  });

//Adding a new emergency service
  app.get("/addService", function(req, res){
  var serviceName = req.param("serviceName");
  var town = req.param("town");
  var emphone = req.param("emphone");
  var emphonealt = req.param("emphonealt");
  var emtype = req.param("emtype");
  var residence = req.param("residence");
  var lat = req.param("lat");
  var long = req.param("long");
  var usrRef = myFirebaseRef.child("services").child(serviceName);

    usrRef.set(
      {
      "town":town,
      "emphone":emphone,
      "emphonealt":emphonealt,
      "emtype":emtype,
      "residence":residence,
      "location":{
        "lat":lat,
        "long":long
        },
      });
  console.log('*************************');
  console.log("*   added new Service   *");
  console.log('*************************');
});

var server = app.listen(port, function(){
  console.log("Listening on port " + port);
});
