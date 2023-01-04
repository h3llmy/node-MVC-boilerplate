import express from 'express'

import exampleRoute from './v1/exampleRoute.js'
import authRoute from './v1/authRoute.js'
import nameRoute from './v1/nameRoute.js'

const rootRouter = express.Router()

rootRouter.use('/example', exampleRoute)
rootRouter.use('/auth', authRoute)
rootRouter.use('/name', nameRoute)

export default rootRouter