const express = require('express');
var app = express();
var bodyParser = require('body-parser');
// app.use(express.static(__dirname));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send('Hello Express')
});

const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
// const assert = require('assert');
// const dbName = 'speed_development';
const uri = "mongodb+srv://my_app:1@cluster0-se5fv.mongodb.net/test?";
// const client = new MongoClient(uri, { useNewUrlParser: true });



app.get('/clients', (req, res) => {
  // console.log(req.params.code)
  // console.log(req.params)

    // res.send('Hello Express')

    
    var client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      collection = client.db("sphere_development").collection("clients");
      collection.find().toArray(function(err, docs) {
    // assert.equal(null, err);
    // assert.equal(3, docs.length);
    // console.log(docs)
        res.send(docs);
        // client.close();
        
      });

     // perform actions on the collection object 
     client.close();  
  });
});

app.get('/clients/:_id', (req, res) => {
  console.log("req.params._id",req.params._id)
  console.log("req.params", req.params)
    var client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      collection = client.db("sphere_development").collection("clients");
      var o_id = new mongo.ObjectID(req.params._id)
      collection.findOne({_id:o_id}).then(function successful(response){
      // console.log(response)
      // console.log("successs")
      // console.log(response)
        res.send(response);
      client.close();
      },
      function error (response){
        console.log("errror")
        res.send("response")
        // client.close();
      });
     // perform actions on the collection object
     // client.close();
  });
});

app.get('/suppliers/:_id', (req, res) => {
  // console.log("req.params._id",req.params._id)
  // console.log("req.params", req.params)
    var client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      collection = client.db("sphere_development").collection("suppliers");
      var o_id = new mongo.ObjectID(req.params._id)
      collection.findOne({_id:o_id}).then(function successful(response){
        // console.log(response)
        // console.log("successs")
        // console.log(response)
        res.send(response);
        // client.close();
      },
      function error (response){
        console.log("errror", response);
        client.close();
      });
     // perform actions on the collection object
     client.close();
  });
});

app.post('/suppliers', (req, res) => {
  // console.log("req.params._id",req.params._id)
  // console.log("req.body", req.body)
  // console.log("res.body", res.body)
  supplier = req.body
  // console.log("supplier", supplier)
  // console.log("res.params", res)
  var client = new MongoClient(uri, { useNewUrlParser: true });
  var o_id = new mongo.ObjectID(supplier._id)
  delete supplier._id
  // delete supplier.capacity
  // console.log("short supplier", supplier)
    client.connect(err => {
      collection = client.db("sphere_development").collection("suppliers");
      collection.update(
        {
          "_id": o_id
        },
        {
          $set : supplier
        },
        {
          upsert: true
        }
      ).then(function successful(response){
      // console.log(response)
        console.log("successs insert")
        console.log(response.data)
        res.send(response)
        // client.close();
      },
      function error (response){
        console.log("errror", response)
      });

      client.close();

  });
});

app.post('/users', (req, res) => {
  // console.log("req.params._id",req.params._id)
  console.log("req.body", req.body)
  console.log("res.body", res.body)
  var ipn_new = req.body.ipn
  var pass_new = req.body.pass
  // console.log("res.params", res)
    var client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      collection = client.db("sphere_development").collection("users");
      collection.update(
        {
          "ipn": ipn_new
        },
        {
          "ipn": ipn_new,
          "password": pass_new
        },
        {
          upsert: true
        }
      ).then(function successful(response){
      // console.log(response)
      console.log("successs")
      // console.log(response)
      res.send(response)
      // client.close();
      },
      function error (response){
        console.log("errror", response)
        
      });
      client.close();

  });
});

app.listen(3000, function () {
  console.log("express has started on port 3000");
});

