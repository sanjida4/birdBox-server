const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ieef.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error", err);
  const birdsCollection = client.db("birdBox").collection("birds");

  app.get("/birds", (req, res) => {
      birdsCollection.find()
      .toArray((err, items) => {
         res.send(items);
      })
  })
  
  app.post('/addBird', (req, res) => {
    const newBird = req.body;
    console.log("adding new bird: ", newBird);
    birdsCollection.insertOne(newBird)
    .then((result) => {
        // console.log( 'inserted count', result.insertedCount);
        // res.send(result.insertedCount > 0)
    })
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})