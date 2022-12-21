import dotenv from 'dotenv';
import midtransClient from 'midtrans-client'

dotenv.config()


let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : process.env.MIDTRANS_SERVERKEY,
    clientKey : process.env.MIDTRANS_CLIENTKEY
})

export const generatePayment = async (payload, next) => {
    try {
        const transaction = await snap.createTransaction(payload)
        if (!transaction) {
            throw "transactions faild"
        }
        return transaction
    } catch (error) {
        next(new Error(error));
    }
}

export const updatePayment = (payload, next) => {
    try {
        const transactionStatus = snap.transaction.notification(payload)
        if (!transactionStatus) {
            throw "transaction not found"
        }
        return transactionStatus
    } catch (error){
        next(new Error(error));
    }
}
