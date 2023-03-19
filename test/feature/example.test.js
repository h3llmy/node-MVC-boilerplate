import request from 'supertest'
import server from '../../utils/server.js'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Example from '../../model/exampleModel.js';
import User from '../../model/userModel.js';

describe("FEATURE /example ", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  });

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe("GET- /example /list", () => {

    it("should get 404", async () => {
      const response = await request(server).get('/api/v1/example/list')
      expect(response.statusCode).toBe(404)
    })

    it("should get 200 ", async () => {
      const newExample = await Example.create({
        example: "mantapssss",
        userId: "63efeace8667d8a634c046ea",
        picture: "http://localhost:3000/image/imagesample.jpg",
      })
      const response = await request(server).get(`/api/v1/example/list`)
      newExample.remove()
      expect(response.statusCode).toBe(200)
    });
  });

  describe("GET /example /detail", () => {
    it("should get 200", async () => {
      const newUser = await User.create({
        username: "gkjhgfjglkjhg3424",
        email: 'example@domain.com',
        password: '1231231',
        isActive: true
      })
      const token = await request(server).post('/api/v1/auth/login')
        .send({
          username: newUser.username,
          password: '1231231'
        })
      const newExample = await Example.create({
        example: "mantapsssssad",
        userId: "63efeace8667d8a634c046ea",
        picture: "http://localhost:3000/image/imagesample.jpg",
      })
      const response = await request(server).get(`/api/v1/example/detail/${newExample._id}`)
        .set('Authorization', `Bearer ${token.body.data.accessToken}`)
      newUser.remove()
      newExample.remove()
      expect(response.statusCode).toBe(200)
    })

    it("should get 401", async () => {
      const newExample = await Example.create({
        example: "asda",
        userId: "63efeace8667d8a634c046ea",
        picture: "http://localhost:3000/image/imagesample.jpg",
      })
      const response = await request(server).get(`/api/v1/example/detail/${newExample._id}`)
      newExample.remove()
      expect(response.statusCode).toBe(401)
    })

    it("should get 404", async () => {
      const newUser = await User.create({
        username: "qweqw",
        email: 'tes@domain.com',
        password: '1231231',
        isActive: true
      })
      const token = await request(server).post('/api/v1/auth/login')
        .send({
          username: newUser.username,
          password: '1231231'
        })
      const response = await request(server).get(`/api/v1/example/detail/641760febb4753cfdcf18b19`)
        .set('Authorization', `Bearer ${token.body.data.accessToken}`)
      expect(response.statusCode).toBe(404)
    })

  })
})