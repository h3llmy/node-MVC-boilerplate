import User from '../model/userModel.js'
import { decodeToken } from '../service/jwtToken.js'
import CustomError from '../vendor/customError.js'

export const auth = async (req, res, next) => {
  try {
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
          throw 'invalid authorization'
        }
        const findUser = await User.findById(payload.id).select(
          '_id status'
        )
        if (!findUser) {
          throw 'invalid authorization'
        }
        if (findUser.isActive == false) {
          throw 'invalid authorization'
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
  } catch (error) {
    next(new CustomError(error, 401))
  }
}

export const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    if (!authorization) {
      throw 'Unauthorized'
    }
    next()
  } catch (error) {
    next(new CustomError(error, 401))
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    if (req.auth.status != 'admin') {
      throw 'Unauthorized'
    }
    next()
  } catch (error) {
    next(new CustomError(error, 401))
  }
}