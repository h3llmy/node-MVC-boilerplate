import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

export default async (fileName, data) => {
    try {
        if (fs.existsSync(`'current', ../../public/text/${fileName}.csv`)) {
            const csvData = Object.values(data).map(val => `'${val}'`).join(", ");
            await fs.promises.appendFile(`'current', ../../public/text/${fileName}.csv`, csvData + `\n`)
        } else {
            const headers = Object.keys(data).map(val => val).join(", ");
            await fs.promises.writeFile(`'current', ../../public/text/${fileName}.csv`, headers + `\n`)
        }
        return { fileUrl: process.env.BASE_URL + `text/${fileName}.csv` }
    } catch (error) {
        throw new Error(error)
    }
}