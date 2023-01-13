import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectMongoDB from './connection/mongoDB.js'
import router from './route/route.js'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'

dotenv.config()

const app = express()

connectMongoDB().then(conn => {
  console.log('\x1b[34m%s\x1b[0m', `MongoDB connected: ${conn.connection.host}`)
})

app.disable('x-powered-by')
app.use(helmet())
app.use(fileUpload())
app.use(express.json())
app.use(express.static('public'))
var appOrigin = process.env.CORS_ORIGIN
if (appOrigin) {
  appOrigin = appOrigin.split(', ')
}
if (!appOrigin || appOrigin == '' || appOrigin.length <= 0) {
  console.log('\x1b[34m%s\x1b[0m', 'all origin is allowed');
}else {
  console.log('\x1b[34m%s\x1b[0m', 'allowed origin : ', appOrigin);
}
app.use(cors({
    origin: function(origin, callback){
      if(!appOrigin || appOrigin == "[]") return callback(null, true);
      if(appOrigin.indexOf(origin) === -1){
          const msg = 'The CORS policy for this site does not allow access from this Origin.';
          return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));

app.use('/api/v1', router)

const port = process.env.PORT || 3000 
app.listen(port, () => {
  console.log('\x1b[34m%s\x1b[0m', `server is listening at port ${port}`)
})

