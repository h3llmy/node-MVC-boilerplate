import express from 'express'
import dotenv from 'dotenv'
import connectMongoDB from './connection/mongoDB.js'
import router from './route/route.js'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import corsMiddleware from './middleware/corsMiddleware.js'

dotenv.config()

const app = express()

connectMongoDB().then(conn => {
  console.log('\x1b[34m%s\x1b[0m', `MongoDB connected: ${conn.connection.host}`)
})

app.use(helmet())
app.use(fileUpload(), (req, res, next) => {
  if (!req.files) {
    req.files = {}
  }
  next()
})
app.use(express.json())
app.use(express.static('public'))
app.use(corsMiddleware)

app.use('/api/v1', router)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('\x1b[34m%s\x1b[0m', `server is listening at port ${port}`)
})

