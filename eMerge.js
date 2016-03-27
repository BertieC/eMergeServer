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
      polCoordinates.push(services[x].location);
    };

    //var distFromCurrent = geolib.getDistance({latitude: usrLat, longitude: usrLong},{latitude: polCoordinates[0].lat, longitude: polCoordinates[0].long});

    var nearestLoc = geolib.findNearest({latitude: usrLat,longitude: usrLong}, polCoordinates, 1);
    var lat = nearestLoc.latitude;

      myFirebaseRef.child("services").child("police").child("location").orderByChild("latitude").equalTo(lat).on("value", function(snapshot) {
        console.log(snapshot.key());
      });
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

  myFirebaseRef.child("services").child(emtype).child("serviceIndex").once('value', function(snapshot){
     index = snapshot.val();
     console.log("snapshot value: " + index);
     newIndex = index + 1;
     console.log("newIndex: " + newIndex);

     var usrRef = myFirebaseRef.child("services").child(emtype).child(newIndex);
     var indexRef = myFirebaseRef.child("services").child(emtype).child("serviceIndex");

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
