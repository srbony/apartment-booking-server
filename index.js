const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId, CURSOR_FLAGS } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvrwoc0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });







// Database Connection
// const uri = process.env.DB_URI
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// })

async function run() {
  try {
    const homesCollection = client.db('aircncdb').collection('homes');
    const usersCollection = client.db('aircncdb').collection('users');



    //saved user data and jenerate JWT
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      }
      const result = await usersCollection.updateOne(filter, updateDoc, options);

      const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
      res.send({ result, token })
      // console.log(result);
      // console.log(token);
    })







    console.log('Database Connected...')
  } finally {
  }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Server is running...')
})

app.listen(port, () => {
  console.log(`Server is running...on ${port}`)
})
