import User from "../model/userModel.js";
import { decodeToken } from "../vendor/jwtToken.js";

export const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        if (authorization && authorization.startsWith('Bearer')){
            const token = authorization.split(' ')[1]
            const payload = decodeToken(token)
            if (payload.type != "login") {
                throw "invalid authorization"
            }
            const findUser = await User.findById({ _id : payload.id }).select('-password').select('-otp')
            if (!findUser) {
                throw "invalid authorization"
            }
            if (findUser.isActive == false) {
                throw "invalid authorization"
            }
            
            req.auth = findUser
            
            next()
        }
    } catch (error) {
        next(new Error(error));
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        if (req.auth.status != "admin") {
            throw "invalid authorization"
        }
        next()
    } catch (error) {
        next(new Error(error));
    }
}

export const isPublic = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            const status = {
                status: "public",
                filter : {
                    isActive : true
                }
            }
            req.auth = status
        }else {
            const authorization = req.headers.authorization
            if (authorization && authorization.startsWith('Bearer')){
                const token = authorization.split(' ')[1]
                const payload = decodeToken(token)
                if (payload.type != "login") {
                    throw "invalid authorization"
                }
                const findUser = await User.findById({ _id : payload.id }).select('-password').select('-otp')
                if (!findUser) {
                    throw "invalid authorization"
                }
                if (findUser.isActive == false) {
                    throw "invalid authorization"
                }
                if (findUser.status != "admin") {
                    findUser.filter = {
                        isActive : true
                    }
                }
                
                req.auth = findUser
                
            }
        }
        next()
    } catch (error) {
        next(new Error(error));
    }
}