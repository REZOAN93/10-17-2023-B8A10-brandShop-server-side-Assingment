const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.post("/addProducts", async (req, res) => {
      const newProducts = req.body;
      const result = await ProductCollection.insertOne(newProducts);
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
