const http = require('http')
const express = require('express')
const jsonServer = require('json-server').create()
const jsonRouter = require('json-server').router('db.json')
const middlewares = require('json-server').defaults()

const app = express()

const hostname = 'localhost'
const port = process.env.port || 3000

// ----------------------------------json-server db-------------------------

const json_host = 'localhost'
const json_port = 3001

jsonServer.use(middlewares)
jsonServer.use(jsonRouter)
jsonServer.listen(json_port, () => {
  console.log('JSON Server is running')
})

const collection_users = 'users'

const METHOD_GET = 'GET'
const METHOD_POST = 'POST'
const METHOD_PUT = 'PUT'
const METHOD_DELETE = 'DELETE'

const PATH_GET_USERS = `/${collection_users}`
// const PATH_GET_USER_ID = `/${collection_users}/`
const PATH_POST_USER = `/${collection_users}`
const PATH_PUT_USER_ID = `/${collection_users}/`
const PATH_DELETE_USER_ID = `/${collection_users}/`

const options = {
  hostname: json_host,
  port: json_port,
  path: '',
  method: '',
  headers: {},
}


// ------------------------------middleware--------------------------

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())



// ----------------------------------GET-----------------------------

app.get("/api/users", (req, res) => {
  let users = []

  options.method = METHOD_GET
  options.path = PATH_GET_USERS
  options.headers = {}

  const reqJson = http.request(options, (resJson) => {
    resJson.setEncoding('utf8')

    resJson.on('data', (data) => {
      users = JSON.parse(data)
      // добавляем свойство _id
      users.forEach(user => {
        user._id = user.id
      })
      res.status(resJson.statusCode).send(users)
    })

    reqJson.on('error', (e) => {
      // console.error('ERROR json_server: ' + e)
      res.status(resJson.statusCode).send(users)
    })
  })

  try {
    reqJson.end()
  } catch (error) {
    return console.log(error)
  }
})



// app.get("/api/user/:id", (req, res) => {
//   let user = []

//   options.method = METHOD_GET
//   options.path = PATH_GET_USER + req.params.id
//   options.headers = {}

//   const reqJson = http.request(options, (resJson) => {
//     resJson.setEncoding('utf8')

//     resJson.on('data', (data) => {
//       user = JSON.parse(data)
//       res.send(user)
//     })
//   })

//   reqJson.on('error', (e) => {
//     console.error('ERROR json_server: ' + e)
//   })

//   try {
//     reqJson.end()
//   } catch (error) {
//     return console.log(error)
//   }
// })



app.get("*", function (req, res) {
  res.status(404).send(JSON.stringify({message: 'Error 404'}))
});



// ----------------------------------POST-----------------------------

app.post('/api/user', async (req, res) => {
  if(!req.body) return res.sendStatus(400)
  
  const user = req.body
  let userId = 0

  options.method = METHOD_POST
  options.path = PATH_POST_USER
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(user)),
  }

  const reqJson = http.request(options, (resJson) => {
    resJson.setEncoding('utf8')
    
    resJson.on('data', (data) => {
      userId = JSON.parse(data).id.toString()
      res.status(resJson.statusCode).send(userId)
    })

    reqJson.on('error', (e) => {
      console.error('ERROR json_server: ' + e)
    })
  })

  try {
    reqJson.write(JSON.stringify(user))
    reqJson.end()
  } catch (error) {
    return console.log(error)
  }
})



// ----------------------------------PUT-----------------------------

app.put('/api/user/:id', async (req, res) => {
  if(!req.body) return res.sendStatus(400)
  
  const user = req.body
  const id = user.id

  options.method = METHOD_PUT
  options.path = PATH_PUT_USER_ID + id
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(user)),
  }

  const reqJson = http.request(options, (resJson) => {
    resJson.setEncoding('utf8')

    resJson.on('data', (data) => {
      res.status(resJson.statusCode).send()
    })

    reqJson.on('error', (e) => {
      console.error('ERROR json_server: ' + e)
    })
  })

  try {
    reqJson.write(JSON.stringify(user))
    reqJson.end()
  } catch (error) {
    return console.log(error)
  }
})

// // ----------------------------------DELETE-----------------------------

app.delete("/api/user/:id", async (req, res) => {
  const id = req.params.id

  options.method = METHOD_DELETE
  options.path = PATH_DELETE_USER_ID + id
  options.headers = {}

  const reqJson = http.request(options, (resJson) => {
    resJson.setEncoding('utf8')

    resJson.on('data', (data) => {
      res.status(resJson.statusCode).send()
    })

    reqJson.on('error', (e) => {
      console.error('ERROR json_server: ' + e)
    })
  })

  try {
    reqJson.end()
  } catch (error) {
    return console.log(error)
  }
});

// =============================SERVER=================================

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});