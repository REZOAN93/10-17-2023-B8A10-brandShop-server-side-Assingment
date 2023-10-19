const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.SECRET_KEY}@cluster0.lh0lzsv.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const database = client.db("BrandShop");
    const BrandNames = database.collection("BrandNames");
    const ProductCollection = database.collection("ProductCollection");
    const UserProductCollection = database.collection("UserProductCollection");
    const userCollection = database.collection("UserCollection");

    app.get("/brands", async (req, res) => {
      const cursor = BrandNames.find();
      const brandsDetails = await cursor.toArray();
      res.send(brandsDetails);
    });
   
    app.get("/brands/:id", async(req, res) => {
      const id = req.params.id;
      const query = { brand: id };
      const cursor = ProductCollection.find(query);
      const brandProducts = await cursor.toArray();
      res.send(brandProducts);
    });

    app.get('/productdetails/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const detailsProduct = await ProductCollection.findOne(query);
      res.send(detailsProduct);
    })

    app.post("/addProducts", async (req, res) => {
      const newProducts = req.body;
      const result = await ProductCollection.insertOne(newProducts);
      res.send(result);
    });

    app.post("/userProducts", async (req, res) => {
      const userProduct = req.body;
      const result = UserProductCollection.insertOne(userProduct);
      res.send(result);
      console.log(result)
    });

    app.get("/userProducts", async (req, res) => {
      const cursor = UserProductCollection.find();
      const userProductDetails = await cursor.toArray();
      res.send(userProductDetails);
    });

    app.delete("/UserProductsData/:id", async (req, res) => {
      const newId = req.params.id;
      console.log(newId)
      const query = { _id: new ObjectId(newId) };
      const result = await UserProductCollection.deleteOne(query);
      res.send(result);
      console.log(result)
    });


     // User Related APIS

     app.post("/user", async (req, res) => {
      const newUser = req.body;
      const result = userCollection.insertOne(newUser);
      res.send(result);
      console.log(newUser);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const allUsers = await cursor.toArray();
      res.send(allUsers);
    });

    app.delete("/users/:id", async (req, res) => {
      const newId = req.params.id;
      const query = { _id: new ObjectId(newId) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/users", async (req, res) => {
      const data = req.body;
      const email = data.emailInfo;

      console.log(email, "in Database");
      const filter = { email: email };
      const updateDoc = {
        $set: {
          LastLogInTime: data.userLastSign,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(port);
