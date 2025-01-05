require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.BISTRO_BOSS_USER}:${process.env.BISTRO_BOSS_PASS}@cluster0.oo75q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuCollection = client.db("BistroDb").collection("menu");
    const userCollection = client.db("BistroDb").collection("users");
    const reviewCollection = client.db("BistroDb").collection("review");
    const cardCollection = client.db("BistroDb").collection("cards");


  // user related api
    app.post('/users',async(req,res)=>{
      const users=req.body;
      const result=await userCollection.insertOne(users)
      res.send(result)
    })




    // menu and reviews collection
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // card related api collection
    app.post('/carts',async (req,res)=>{
      const cartItem=req.body;
      const result=await cardCollection.insertOne(cartItem)
      res.send(result)
    })

    app.get('/carts',async(req,res)=>{
      const email=req.query.email;
      const query={email:email}
      const result=await cardCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/carts/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await cardCollection.deleteOne(query)
      res.send(result)
    })
   


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bistro boss server is running");
});
app.listen(port, () => {
  console.log(`Bistro boss server running on the port ${port}`);
});
