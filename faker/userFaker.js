import { faker } from '@faker-js/faker'
import User from '../model/userModel.js'
import dotenv from 'dotenv'
import connectMongoDB from '../connection/mongoDB.js'
dotenv.config({path : '../../.env'})

connectMongoDB()

try {
    let user = []
    const status = ["user", "admin"]
    Array.from({ length: 10 }).forEach(() => {
        const userData = {
            username : faker.internet.userName(),
            email : faker.internet.email(),
            password : faker.internet.password(),
            status : status[faker.datatype.number({min:0, max: status.length -1})],
            isActive : faker.datatype.boolean(),
        }
        user.push(userData)
    });
    
    const createUser = await User.create(user)
    if (!createUser) {
    throw 'failed to generate User'
    }
    console.log('[32m%s[0m', "User data created");
    process.exit(1)
} catch (error) {
    console.log('[31m%s[0m', error.message);
    process.exit(1)
}