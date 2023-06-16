const express = require('express')
const Connection = require('./mongodb/Connection')
const ObjectId = require("mongodb").ObjectId;

const app = express()
// const urlencodedParser = express.urlencoded()
// const jsonParser = express.json()

const hostname = 'localhost'
const port = process.env.port || 3000

// ----------------------------------MongoDB-------------------------

const collection = 'users'

Connection.connectToMongo()

// ------------------------------middleware--------------------------

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// ----------------------------------GET-----------------------------

app.get("/api/users", async (req, res) => {
  let users = ''
  
  try {
    users = await Connection.db.collection(collection).find().toArray()
  } catch (error) {
    return console.log(error)
  }
  
  res.send(users)
});

app.get("/api/user/:id", async (req, res) => {
  let user = ''
  const id = new ObjectId(req.params.id);

  try {
    user = await Connection.db.collection(collection).findOne({_id: id})
    user._id = req.params.id
  } catch (error) {
    return console.log(error)
  }
  
  res.send(user)
});

app.get("*", function (req, res) {
  res.status(404).send(JSON.stringify({message: 'Error'}))
});

// ----------------------------------POST-----------------------------

app.post('/api/user', async (req, res) => {
  if(!req.body) return res.sendStatus(400)
  
  const user = req.body
  let userId = '';

  try {
    const result = await Connection.db.collection(collection).insertOne(user)
    userId = result.insertedId.toString()
  } catch (error) {
    return console.log(error)
  }
  
  res.status(201).send(userId)
})

// ----------------------------------PUT-----------------------------

app.put('/api/user/:id', async (req, res) => {
  if(!req.body) return res.sendStatus(400)
  
  const id = new ObjectId(req.body.id)
  const userName = req.body.name
  const userAge = req.body.age

  try {
    const result = await Connection.db.collection(collection).updateOne(
      {_id: id},          // критерий выборки
      { $set: {           // параметр обновления
        name: userName,
        age: userAge
        }
      }
    )
  } catch (error) {
    return console.log(error)
  }
  
  res.status(201).send()
})

// ----------------------------------DELETE-----------------------------

app.delete("/api/user/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);

  try {
    const result = await Connection.db.collection(collection).deleteOne({_id: id})
  } catch (error) {
    return console.log(error)
  }
  
  res.send()
});

// =============================SERVER=================================

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});