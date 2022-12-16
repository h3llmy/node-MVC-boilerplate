import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export default async (templateEmail) => {
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

    const sendMail = await transporter.sendMail(templateEmail)
    if (!sendMail) {
      return null
    }

    return sendMail
  } catch (error) {
    console.error(error);
  }
}

