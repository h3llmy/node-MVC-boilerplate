const request = require("supertest")
const baseURL = "http://127.0.0.1:3000/api/v1/"

const value = {
    example : "mantapssaqweqwswaaaaaaa"
    }

const value2 = {
    example: "mamsam"
    }

// test add data
describe("POST /example /add", () => {
    let id = ''
  it("should add an item to example", async () => {
    const response = await request(baseURL).post("/example/add").send(value);
    expect(response.statusCode).toBe(200)
    id = response.body.data._id
  });
  afterAll(async () => {
    await request(baseURL).delete(`/example/delete/${id}`);
  })
});

// // test list data
// describe("POST /category /list", () => {
//     it("should get an item to category", async () => {
//       const response = await request(baseURL).get("/category/list")
//       expect(response.body.status).toBe(200)
//     });
//   });

// // test get detail data
// describe("POST /category /detail", () => {
//         let id = ''
//     beforeAll(async () => {
//         const response = await request(baseURL).post("/category/add").send(value);
//         id = response.body.data.id
//     })
//     it("should get an item to category", async () => {
//       const response = await request(baseURL).get(`/category/detail/${id}`);
//       expect(response.body.status).toBe(200)
//     });
//     afterAll(async () => {
//       await request(baseURL).delete(`/category/delete/${id}`)
//     })
//   });

// // test update data
// describe("POST /category /update", () => {
//         let id = ''
//     beforeAll(async () => {
//         const response = await request(baseURL).post("/category/add").send(value);
//         id = response.body.data.id
//     })
//     it("should update an item to category", async () => {
//       const response = await request(baseURL).put(`/category/update/${id}`).send(value2);
//       expect(response.body.status).toBe(200)
//     });
//     afterAll(async () => {
//       await request(baseURL).delete(`/category/delete/${id}`)
//     })
//   });

// // test update active data
// describe("POST /category /update /actived", () => {
//         let id = ''
//     beforeAll(async () => {
//         const response = await request(baseURL).post("/category/add").send(value);
//         id = response.body.data.id
//     })
//     it("should update an item to category", async () => {
//       const response = await request(baseURL).put(`/category/update/actived/${id}`);
//       expect(response.body.status).toBe(200)
//     });
//     afterAll(async () => {
//       await request(baseURL).delete(`/category/delete/${id}`)
//     })
//   });

// // test delete data
// describe("POST /category /delete", () => {
//         let id = ''
//     beforeAll(async () => {
//         const response = await request(baseURL).post("/category/add").send(value);
//         id = response.body.data.id
//     })
//     it("should delete an item to category", async () => {
//       const response = await request(baseURL).delete(`/category/delete/${id}`);
//       expect(response.body.status).toBe(200)
//     });
//   });