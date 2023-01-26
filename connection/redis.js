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
  console.log('Redis', err)
  redisClient.disconnect()
  process.exit(1)
})

redisClient.on('connect', () => {
  console.log(
    '\x1b[34m%s\x1b[0m',
    `redis connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  )
})

await redisClient.connect()

export default redisClient
