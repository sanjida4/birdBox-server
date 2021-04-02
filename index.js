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
    const productsCollection = client.db("birdBox").collection("birds");
    const ordersCollection = client.db("birdBox").collection("orders");

  app.get("/products", (req, res) => {
    productsCollection.find({})
      .toArray((err, items) => {
         res.send(items);
      })
  })
  
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log("adding new bird: ", newProduct);
    productsCollection.insertOne(newProduct)
    .then((result) => {
        console.log( 'inserted count', result.insertedCount);
        res.send(result.insertedCount)
    })
  })
  
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
        res.send(documents[0]);
    })
})

app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys} })
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

});


app.listen(port);