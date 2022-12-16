import express from 'express'

import exampleRoute from './v1/exampleRoute.js'
import authRoute from './v1/authRoute.js'
import paymentRoute from './v1/paymentRoute.js'

const rootRouter = express.Router()

rootRouter.use('/example', exampleRoute)
rootRouter.use('/auth', authRoute)
rootRouter.use('/payment', paymentRoute)

export default rootRouter