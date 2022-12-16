import express from 'express'
import { generatePayment } from '../../controller/paymentController.js'
import { auth } from '../../middleware/authMiddleware.js'

const router = express.Router()

 router.post('/create', auth, generatePayment)
 router.post('/update/status', generatePayment)

 export default router