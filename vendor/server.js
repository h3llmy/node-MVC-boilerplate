import express from 'express'
import connectMongoDB from '../connection/mongoDB.js'
import router from '../route/route.js'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import corsMiddleware from '../middleware/corsMiddleware.js'
import { errorHanddlerMiddleware } from '../middleware/errorHanddlerMiddleware.js'
import compression from 'compression'

export default () => {

    const app = express()

    connectMongoDB().then(conn => {
        console.log('\x1b[34m%s\x1b[0m', `MongoDB connected: ${conn.connection.host}`)
    })

    app.use(compression())
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

    app.use(errorHanddlerMiddleware)

    return app
}