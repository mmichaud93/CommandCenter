var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var port = Number(process.env.PORT || 53535);

app.listen(port);
console.log("Listening on port: "+port);

var connectQuery = process.env.DBCONNECT;

MongoClient.connect(connectQuery, function(err, db) {
  if(err) {
    console.log("error connecting to the database");
    console.log(err);
    return;
  }
  var collection = db.collection('fogoftheworld');
});

app.get('/api/putLatLng', function(req, res) {
  var user = req.query.user;
  var lat = req.query.lat;
  var lng = req.query.lng;
  var timestamp = req.query.timestamp;
  
  if(!user || !lat || !lng || !timestamp) {
    res.send({error: "invalid parameters"});
    return;
  }
  
  MongoClient.connect(connectQuery, function(err, db) {
    if(err) {
      console.log("error connecting to the database for user "+user);
      console.log(err);
      return;
    }
    
    var collection = db.collection('fogoftheworld');
    // get the document for the user
    collection.findOne({'user':user}, function(err, item) {
      if(err) {
        console.log("error getting the document for user "+user);
        console.log(err);
        return;
      }
      if(!item) {
        item = {'user':user};
        collection.insert(item);
      }
      
      if(!item.latlngs) {
        item.latlngs = [];
      }
      
      item.latlngs.push({'lat':lat, 'lng':lng, 'timestamp':timestamp});
      
      collection.update({'user':user}, {$set:{latlngs:item.latlngs}}, function(err, result) {
        if(err) {
          console.log("couldnt save latlngs for "+user);
          return;
        }
      });
    });
  });
  
  res.send({msg:'see Command Center logs for results'});
});

app.get('/api/putDatabaseInfo', function(req, res) {
  var user = req.query.user;
  var dbsize = req.query.dbsize;
  var loadtime = req.query.loadtime;
  var timestamp = req.query.timestamp;
  
  if(!user || !dbsize || !loadtime || !timestamp) {
    res.send({error: "invalid parameters"});
    return;
  }
  
  MongoClient.connect(connectQuery, function(err, db) {
    if(err) {
      console.log("error connecting to the database for user "+user);
      console.log(err);
      return;
    }
    
    var collection = db.collection('fogoftheworld');
    // get the document for the user
    collection.findOne({'user':user}, function(err, item) {
      if(err) {
        console.log("error getting the document for user "+user);
        console.log(err);
        return;
      }
      if(!item) {
        item = {'user':user};
        collection.insert(item);
      }
      
      if(!item.dbloads) {
        item.dbloads = [];
      }
      
      item.dbloads.push({'dbsize':dbsize, 'loadtime':loadtime, 'timestamp':timestamp});
      
      collection.update({'user':user}, {$set:{dbloads:item.dbloads}}, function(err, result) {
        if(err) {
          console.log("couldnt save dbloads for "+user);
          return;
        }
      });
    });
  });
  
  res.send({msg:'see Command Center logs for results'});
});