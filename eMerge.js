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
var polCoordinates = [];
//just an test call for debugging
  app.get("/test", function(req, res){
    res.send("**********  Server Test **********");
  });

  //User emergency calls
  app.get("/emrg", function(req, res){
    var usrNum = req.param("phone");
    var usrLat = req.param("lat");
    var usrLong = req.param("long");

  myFirebaseRef.child("services").child("police").once("value", function(snapshot) {
    var services = snapshot.val();

  for(var x in services){
      var service = services[x].service;
      var location = services[x].location;
      polCoordinates.push(location);
    };
    console.log(polCoordinates);
    var nearestLoc = geolib.findNearest({latitude:usrLat,longitude:usrLong}, polCoordinates, 1);
    var distFromUsr = geolib.getDistance({latitude:usrLat,longitude:usrLong}, nearestLoc);

    console.log("Nearest location- Lat: "+nearestLoc.latitude+" Long: "+nearestLoc.longitude+" Meters from User: "+distFromUsr);

    var nearestService;
    for(var y in services){
      if (services[y].location.latitude == nearestLoc.latitude && services[y].location.longitude == nearestLoc.longitude){
        nearestService = services[y];
      };
    };

    //communication code must go here!!!

    console.log(nearestService);
    });
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
  var service = req.param("service");
  var town = req.param("town");
  var emphone = req.param("emphone");
  var emphonealt = req.param("emphonealt");
  var emtype = req.param("emtype");
  var residence = req.param("residence");
  var lat = req.param("lat");
  var long = req.param("long");
  var index;
  var newIndex;

  myFirebaseRef.child("services").child("policeIndex").once('value', function(snapshot){
     index = snapshot.val();
     console.log("snapshot value: " + index);
     newIndex = index + 1;
     console.log("newIndex: " + newIndex);

     var usrRef = myFirebaseRef.child("services").child(emtype).child(newIndex);
     var indexRef = myFirebaseRef.child("services").child("policeIndex");

     indexRef.set(newIndex);

       usrRef.set(
         {
           "service":service,
           "town":town,
           "emphone":emphone,
           "emphonealt":emphonealt,
           "residence":residence,
           "location":{
             "latitude":lat,
             "longitude":long
             },
         });
     console.log('*************************');
     console.log("*   added new Service   *");
     console.log('*************************');
   });
});

var server = app.listen(port, function(){
  console.log("Listening on port " + port);
});
