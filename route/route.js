import express from 'express'

import exampleRoute from './v1/exampleRoute.js'
import authRoute from './v1/authRoute.js'

const rootRouter = express.Router()

rootRouter.use('/example', exampleRoute)
rootRouter.use('/auth', authRoute)

export default rootRouter