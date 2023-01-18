import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

export default async (emailHeader, path) => {
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
    if (path && typeof emailHeader.html == 'object') {      
      let file = await fs.promises.readFile(`./vendor/emailTemplate/${path}`, 'utf-8')
      Object.entries(emailHeader.html).forEach(([key, value]) => {
          let regex = new RegExp("{{" + key + "}}", "g");
          file = file.replace(regex, value)
      })
      emailHeader.html = file
    }
    sendMail = await transporter.sendMail(emailHeader)
    if (!sendMail) {
      return new Error('email not sended')
    }
    return sendMail
  } catch (error) {
    throw new Error(error)
  }
}

