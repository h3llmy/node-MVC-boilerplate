import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectMongoDB from './connection/mongoDB.js'
import router from './route/route.js'
import fileUpload from 'express-fileupload'

dotenv.config()

const app = express()

connectMongoDB()

app.use(fileUpload())
app.use(express.json())
app.use(express.static('public'))
var appOrigin = process.env.CORS_ORIGIN
if (appOrigin) {
  appOrigin = appOrigin.split(', ')
}
if (!appOrigin || appOrigin == '' || appOrigin.length <= 0) {
  console.log('all origin is allowed');
}else {
  console.log('allowed origin : ', appOrigin);
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
  console.log(`server is listening at port ${port}`)
})

