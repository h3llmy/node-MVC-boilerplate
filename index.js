import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectMongoDB from './connection/mongoDB.js'
import router from './route/route.js'

dotenv.config()

const app = express()

connectMongoDB()

app.use(express.json())
app.use(express.static('public'))
const appOrigin = process.env.CORS_ORIGIN
app.use(cors({
    origin: function(origin, callback){
      if(!appOrigin || appOrigin == "[]") return callback(null, true);
      if(appOrigin.indexOf(origin) === -1){
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
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

