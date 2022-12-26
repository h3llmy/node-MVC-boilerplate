import fs from 'fs';

try {
    const inputName = process.argv[2]
    if (!process.argv[2]) {
        throw 'file name is required'
    }
    const newinputName = inputName.replace(/^\w/, c => c.toUpperCase());
    const fileName = process.argv[2] + "Faker.js";
    const fullPath =  "'current', ../../faker/" + fileName
    const fileContent = `import { faker } from '@faker-js/faker'
    import ${newinputName} from '../model/${inputName}Model.js'
    import dotenv from 'dotenv'
    import connectMongoDB from '../connection/mongoDB.js'
    dotenv.config({path : '../../.env'})

    connectMongoDB()

    let ${inputName} = []
    Array.from({ length: 10 }).forEach(() => {
    const ${inputName}Data = {
        name : faker.internet.userName()
    }
    ${inputName}.push(${inputName}Data)
    });

    async function create${newinputName}s() {
    try {
        const create${newinputName} = await ${newinputName}.create(${inputName})
        if (!create${newinputName}) {
        throw 'failed to generate ${newinputName}'
        }
        console.log('\x1b[32m%s\x1b[0m', "${newinputName} data created");
        process.exit(1)
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
    }

    create${newinputName}s()`;

    if (fs.existsSync(fullPath)) {
        throw `faker ${fileName} has already exsist`
    }
    fs.writeFile(fullPath, fileContent, (err) => {
      if (err) throw err;
      console.log('\x1b[32m%s\x1b[0m', `controller ${fileName} has been created!`);
    });
} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error);
}
