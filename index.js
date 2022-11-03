const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h32cfqq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userCollection = client.db('practiceday001').collection('products');
        // const user = {
        //     name: 'mango test',
        //     email: 'mango@gmail.com'
        // }
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await userCollection.findOne(query);
            res.send(product)
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product)
            const result = await userCollection.insertOne(product);
            res.send(result)
        });
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const product = req.body;
            const option = { upsert: true };
            const updateUser = {
                $set: {
                    Price: product.Price,
                    Product_name: product.Product_name,
                    quantity: product.quantity,
                    photoURL: product.photoURL
                }
            }
            const result = await userCollection.updateOne(filter, updateUser, option);
            res.send(result);
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            // console.log('trying to delete', id)
            console.log(result)
            res.send(result)
        })

        // console.log(result)
    }
    finally {

    }

}
run().catch(err => console.error(err));
app.get('/', (req, res) => {
    res.send('Practice Day is Knocking')
});

app.listen(port, () => {
    console.log(`listen to port ${port}`);
})
