import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

export default async (emailHeader, path, payload) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILLER_HOST,
      service: process.env.MAILLER_SERVICE,
      port: process.env.MAILLER_PORT,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.MAILLER_USERNAME,
        pass: process.env.MAILLER_PASSWORD
      }
    })

    let sendMail
    if (path && payload) {      
      let file = await fs.promises.readFile(`./vendor/emailTemplate/` + path, 'utf-8')
      let message = file
      Object.entries(payload).forEach(([key, value]) => {
          let regex = new RegExp("{{" + key + "}}", "g");
          message = message.replace(regex, value)
      })
      emailHeader.html = message.toString()
      sendMail = await transporter.sendMail(emailHeader)
    } else {
      sendMail = await transporter.sendMail(emailHeader)
    }
    if (!sendMail) {
      return null
    }
    return sendMail
  } catch (error) {
    throw new Error(error)
  }
}

