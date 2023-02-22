import express from 'express'
import connectMongoDB from '../connection/mongoDB.js'
import router from '../route/route.js'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import corsMiddleware from '../middleware/corsMiddleware.js'
import { errorHanddlerMiddleware } from '../middleware/errorHanddlerMiddleware.js'
import compression from 'compression'
import { auth } from '../middleware/authMiddleware.js'
import rateLimiterMiddleware from '../middleware/rateLimiterMiddleware.js'
import ExpressMongoSanitize from 'express-mongo-sanitize'

export default () => {

    const app = express()

    connectMongoDB().then(conn => {
        console.log('\x1b[34m%s\x1b[0m', `MongoDB connected: ${conn.connection.host}`)
    })

    app.use(express.urlencoded({ extended: false }))
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
    app.use(ExpressMongoSanitize())
    app.use(corsMiddleware)
    app.use(auth)
    app.use(rateLimiterMiddleware)

    app.use('/api/v1', router)

    app.use(errorHanddlerMiddleware)

    return app
}