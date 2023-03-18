import request from 'supertest'
import server from '../vendor/server.js'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import Example from '../model/exampleModel.js';

const exampleData = {
  example: faker.internet.userName() + faker.datatype.number(),
  userId: "63efeace8667d8a634c046ea",
  picture: faker.image.avatar(),
}

describe("POST /example /add", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  });

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe("POST /example /add", () => {
    it("should get list example", async () => {
      const newExample = await Example.create(exampleData)
      const response = await request(server).get(`/api/v1/example/list`)
      expect(response.statusCode).toBe(200)
      newExample.remove()
    });
  });
})