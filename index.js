const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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