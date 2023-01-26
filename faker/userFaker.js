import { faker } from '@faker-js/faker'
import User from '../model/userModel.js'
import dotenv from 'dotenv'
import connectMongoDB from '../connection/mongoDB.js'
dotenv.config({ path: '../../.env' })

connectMongoDB()

try {
  const totalData = 100
  let user = []
  const status = ['user', 'admin']
  for (let i = 0; i < totalData; i++) {
    const userData = {
      username: faker.internet.userName() + faker.datatype.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      status: status[faker.datatype.number({ min: 0, max: status.length - 1 })],
      isActive: faker.datatype.boolean(),
    }
    user.push(userData)
  }

  const createUser = await User.create(user)
  if (!createUser) {
    throw new Error('failed to generate User')
  }
  console.log('[32m%s[0m', 'userFaker success')
  process.exit(1)
} catch (error) {
  console.log('[31m%s[0m', 'userFaker failed : ' + error.message)
  process.exit(1)
}
