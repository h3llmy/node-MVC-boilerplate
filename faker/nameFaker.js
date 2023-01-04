import { faker } from '@faker-js/faker'
import Name from '../model/nameModel.js'
import dotenv from 'dotenv'
import connectMongoDB from '../connection/mongoDB.js'
dotenv.config({path : '../../.env'})

connectMongoDB()

try {
    let name = []
    Array.from({ length: 10 }).forEach(() => {
        const nameData = {
            name : faker.internet.userName()
        }
        name.push(nameData)
    });
    
    const createName = await Name.create(name)
    if (!createName) {
    throw 'failed to generate Name'
    }
    console.log('[32m%s[0m', "Name data created");
    process.exit(1)
} catch (error) {
    console.log('[31m%s[0m', error.message);
    process.exit(1)
}