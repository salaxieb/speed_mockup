


const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}



const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   insertDocuments(db, function() {
//     client.close();
//   });
// });


// var uri = "mongodb://my_app:1@cluster0-shard-00-01-se5fv.mongodb.net:27017,cluster0-shard-00-01-se5fv.mongodb.net:27017,cluster0-shard-00-02-se5fv.mongodb.net:27017/admin?ssl=true&replicaSet=Mycluster0-shard-0";
// MongoClient.connect(uri, function(err, client) {
//    const collection = client.db("sphere_development").collection("capacities");
//    console.log("Connected successfully to server");
//    // perform actions on the collection object
//    client.close();
// });

const uri = "mongodb+srv://my_app:1@cluster0-se5fv.mongodb.net/test?";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  collection = client.db("sphere_development").collection("domains");
  collection.insertOne({'id':"1", 'city':"TTT"}, {w:1}, function(err, result) {});
  console.log(collection.findOne().then(
  	function successful(response){
	  	console.log(response.reworks)
	  	console.log("successs")
  },
  	function error (response){
  		console.log("errror")
  }));
  // console.log(db.collection("capacity_files"))
  console.log("Connected successfully to server");
 // perform actions on the collection object
  client.close();
});