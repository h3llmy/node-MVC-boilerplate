import dotenv from 'dotenv';
import midtransClient from 'midtrans-client'
import { errorResponse, successResponse } from '../vendor/response.js';

dotenv.config()


let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : process.env.MIDTRANS_SERVERKEY,
    clientKey : process.env.MIDTRANS_CLIENTKEY
})

export const generatePayment = async (req, res) => {
    try {
        const payload ={
            transaction_details: {
                gross_amount: req.body.grossAmount,
                order_id: req.body.orderId,
            },
        }
        const transaction = await snap.createTransaction(payload)
        if (!transaction) {
            throw "transactions faild"
        }
        res.status(200).json(successResponse(transaction))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const updatePayment = (req, res) => {
    try {
        const notificationJson = {
            transaction_id : req.body.transaction_id
        }

        const transactionStatus = snap.transaction.notification(notificationJson)
        if (!transactionStatus) {
            throw "transaction not found"
        }
        console.log(transactionStatus.transaction_status);
        
        res.status(200).json(successResponse(transactionStatus))
    } catch (error){
        res.status(400).json(errorResponse(error))
    }
}
