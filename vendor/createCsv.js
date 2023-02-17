import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

export default (fileName, data) => {
    try {
        const csvData = Object.values(data).map(val => val).join(", ");
        if (!fs.existsSync(`public/text`)) {
            fs.mkdirSync(`public/text`, { recursive: true });
        }
        if (fs.existsSync(`'current', ../../public/text/${fileName}.csv`)) {
            fs.appendFileSync(`'current', ../../public/text/${fileName}.csv`, csvData + `\n`)
        } else {
            const headers = Object.keys(data).map(val => val).join(", ");
            fs.writeFileSync(`'current', ../../public/text/${fileName}.csv`, headers + `\n` + csvData + `\n`)
        }
        return { fileUrl: process.env.BASE_URL + `text/${fileName}.csv` }
    } catch (error) {
        throw new Error(error)
    }
}