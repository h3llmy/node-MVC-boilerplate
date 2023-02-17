import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectMongoDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    return conn
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectMongoDB
