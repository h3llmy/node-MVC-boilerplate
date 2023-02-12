import request from 'supertest'
const baseURL = 'http://127.0.0.1:3000/api/v1/';

describe("POST /example /add", () => {
  beforeAll(() => {

  });
  it("should add an item to example", async () => {
    const Request = await request(baseURL).get(`example/detail/aksjhdkajs`)
    expect(Request.statusCode).toBe(200)
  });
});