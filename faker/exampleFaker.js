import { faker } from '@faker-js/faker'
import Example from '../model/exampleModel.js'
import dotenv from 'dotenv'
import connectMongoDB from '../connection/mongoDB.js'
dotenv.config({path : '../../.env'})

connectMongoDB()

let examples = []
Array.from({ length: 10 }).forEach(() => {
  const exampleData = {
    example : faker.internet.userName()
  }
  examples.push(exampleData)
});

async function createExamples() {
  try {
    const createExample = await Example.create(examples)
    if (!createExample) {
      throw 'failed to generate Example'
    }
    console.log('\x1b[32m%s\x1b[0m', "Example data created");
    process.exit(1)
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', error);
    process.exit(1)
  }
}

createExamples()