import dotenv from 'dotenv'
import midtransClient from 'midtrans-client'
import CustomError from '../utils/customError.js'

dotenv.config()

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVERKEY,
  clientKey: process.env.MIDTRANS_CLIENTKEY,
})

export const generatePayment = async (payload) => {
  try {
    const transaction = await snap.createTransaction(payload)
    if (!transaction) {
      throw 'transactions faild'
    }
    return transaction
  } catch (error) {
    throw new CustomError(error, error.httpStatusCode)
  }
}

export const updatePayment = (payload) => {
  try {
    const transactionStatus = snap.transaction.notification(payload)
    if (!transactionStatus) {
      throw 'transaction not found'
    }
    return transactionStatus
  } catch (error) {
    throw new CustomError(error, error.httpStatusCode)
  }
}
