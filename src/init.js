const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'speed_development';
const uri = "mongodb+srv://my_app:1@cluster0-se5fv.mongodb.net/test?";
const client = new MongoClient(uri, { useNewUrlParser: true });



// client.connect(err => {
//   db = client.db("sphere_development");
//   db.collection("suppliers").drop();
//   console.log("deleted and creaed");
//   // console.log(db.collection("capacity_files"))
//  // perform actions on the collection object
//   client.close();
// });

client.connect(err => {
  collection = client.db("sphere_development").collection("suppliers");
  console.log(collection.findOne({ipprfl_codes:'PHR       VINAI-000024839600'}).then(function successful(response){
	  	// console.log(response)
	  	console.log("successs")
  },
  	function error (response){
  		console.log("errror")
  }));

  console.log(collection.find().toArray(function(err, docs) {
      // assert.equal(null, err);
      // assert.equal(3, docs.length);
      console.log(docs)
      assert.equal(35, docs.length);
      assert.equal(null, err);

    }));
 // perform actions on the collection object
  client.close();
});