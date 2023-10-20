const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.77jbz4j.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const tecWandersDB = client.db("tecWandersDB");
    const userCollection = tecWandersDB.collection("users");
    const brandCollection = tecWandersDB.collection("brand");
    const productsCollection = tecWandersDB.collection("products");
    const cartCollection = tecWandersDB.collection('cart');

    app.get('/users', async(req, res)=> {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.post('/products', async(req, res)=>{

      const {brandName, image,specification, typeOfProducts, productsName, price,ratting,description  } = req.body;

      const doc = {
        brandName,
        image,
        category: typeOfProducts,
        products:  [productsName, price, ratting, description],
        specification
        
      }

      const products = await productsCollection.insertOne(doc);
      res.send(products);
    })

    app.patch('/users', async(req, res)=> {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = {
        $set: {
          email: user.email,
          lastSignInTime: user.lastSignInTime
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.post('/cart', async(req, res)=>{
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    })

    
    app.get('/brand', async(req, res)=>{
      const cursor = brandCollection.find();
      const brand = await cursor.toArray();
      res.send(brand);
    })

    app.get('/products', async(req, res)=>{
      const cursor = productsCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    })

    app.get('/products/:name', async(req, res)=>{
      const name = req.params.name;
      const query = { brandName: name };
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })

    app.get('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const product = await productsCollection.findOne(query);
      res.send(product);
    })

    app.put('/products/:id', async(req, res)=> {
      const id = req.params.id;
      const {brandName, image,specification, typeOfProducts, productsName, price,ratting,description  } = req.body;

      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
     

      const updateDoc = {
        $set: {
        brandName,
        image,
        category: typeOfProducts,
        products:  [productsName, price, ratting, description],
        specification
        },
      };
      const result = await productsCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })


    
    
   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
  res.send('MY brand shop api was coming sooooon!');
})

app.listen(port, ()=>{
  console.log(`my server is running port ${port}`);
})