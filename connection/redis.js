import redis from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
})

redisClient.on('error', (err) => {
  console.log('\x1b[31m%s\x1b[0m', `Redis : ${err.message}`)
  redisClient.disconnect()
})

redisClient.on('connect', () => {
  console.log(
    '\x1b[34m%s\x1b[0m',
    `redis connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  )
})

redisClient.connect()

export default redisClient
