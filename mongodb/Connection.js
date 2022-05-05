const { MongoClient } = require('mongodb')

// !!!!! Переменные окружения = *
class Connection {
  static async connectToMongo() {
    if (this.db) return this.db

    const client = await MongoClient.connect(this.url, this.options)
    console.log('Connected successfully to MongoDB server')

    this.db = client.db(this.dbName) // *
    return this.db
  }
}

Connection.db = null
Connection.dbName = 'nodejs'
Connection.url = 'mongodb://localhost:27017' // *
Connection.options = {
  useNewUrlParser: true, // синтаксический анализатор URL-адресов устарел
  useUnifiedTopology: true // механизм обнаружения и мониторинга серверов устарел
}

module.exports = Connection
