import { faker } from '@faker-js/faker'
import Example from '../model/exampleModel.js'
import dotenv from 'dotenv'
import connectMongoDB from '../connection/mongoDB.js'
dotenv.config({path : '../.env'})

connectMongoDB()

let examples = []

Array.from({ length: process.argv[2] }).forEach(() => {
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
    console.log(createExample);
    console.log("Example data created");
    process.exit(1)
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
}

createExamples()