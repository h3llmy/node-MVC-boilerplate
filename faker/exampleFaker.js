import { faker } from '@faker-js/faker'
import Example from '../model/exampleModel.js'
import dotenv from 'dotenv'
import connectMongoDB from '../connection/mongoDB.js'
import User from '../model/userModel.js'
dotenv.config({path : '../../.env'})

connectMongoDB()

try {
  const totalData = 10000
  let examples = []
  const user = await User.find().orFail(new Error('user not found'))
  for (let i = 0; i < totalData; i++) {  
    const exampleData = {
      example : faker.internet.userName(),
      userId : user[faker.datatype.number({min : 0, max : user.length -1 })],
      picture : faker.image.avatar()
    }
    examples.push(exampleData)
  }

  const createExample = await Example.create(examples)
  if (!createExample) {
    throw 'failed to generate Example'
  }
  console.log('\x1b[32m%s\x1b[0m', "Example data created");
  process.exit(1)
} catch (error) {
  console.log('\x1b[31m%s\x1b[0m', error.message);
  process.exit(1)
}