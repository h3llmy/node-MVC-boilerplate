import server from './vendor/server.js'
import connectMongoDB from './connection/mongoDB.js'

connectMongoDB().then(conn => {
  console.log('\x1b[34m%s\x1b[0m', `MongoDB connected: ${conn.connection.host}`)
})

const app = server

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('\x1b[34m%s\x1b[0m', `server is listening at port ${port}`)
})