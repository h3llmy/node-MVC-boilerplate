import User from '../model/userModel.js'
import { decodeToken } from '../service/jwtToken.js'
import CustomError from '../utils/customError.js'

export const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    delete req.query.isActive
    const { limit, page, ...query } = req.query
    const status = {
      status: 'public',
      filter: {
        isActive: true,
        ...query
      },
    }
    req.auth = status
  } else {
    const authorization = req.headers.authorization
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.split(' ')[1]
      const payload = decodeToken(token)
      if (payload.type != 'login') {
        throw new CustomError('invalid authorization', 401)
      }
      const findUser = await User.findById(payload.id).select(
        '_id status'
      )
      if (!findUser) {
        throw new CustomError('invalid authorization', 401)
      }
      if (findUser.isActive == false) {
        throw new CustomError('invalid authorization', 401)
      }
      if (findUser.status != 'admin') {
        delete req.query.isActive
        const { limit, page, ...query } = req.query
        findUser.filter = {
          isActive: true,
          ...query
        }
      }

      req.auth = findUser
    }
  }
  next()
}

export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    throw new CustomError('Unauthorized', 401)
  }
  next()
}

export const isAdmin = async (req, res, next) => {
  if (req.auth.status != 'admin') {
    throw new CustomError('Unauthorized', 401)
  }
  next()
}