import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateToken = (payload, expiresIn) => {
  try {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: expiresIn
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const decodeToken = (payload) => {
  try {
    return jwt.verify(payload, process.env.ACCESS_TOKEN_SECRET)
  } catch (error) {
    throw new Error(error)
  }
}
