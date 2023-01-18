import nodeMailler from "../service/nodeMailler.js";
import { successResponse, errorResponse } from "../vendor/response.js";
import { decodeToken, generateToken } from "../service/jwtToken.js";
import dotenv from 'dotenv';
import User from "../model/userModel.js";
import {emailCheck} from "../vendor/validator.js";

dotenv.config()

export const register = async (req, res) => {
    try {
        const randomOtp = (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
        if (!emailCheck(req.body.email)) {
            throw new Error("is not an email addres")
        }

        if (req.body.password != req.body.confirmPassword) {
            throw new Error("password not match")
        }    

        const findUser = await User.findOne({ email : req.body.email })

        if (findUser?.isActive == true) {
            throw new Error("user already register")
        }
        if (findUser?.isActive == false) {
            await findUser.remove()
        }

        const newUser = await User.create({
            otp : randomOtp,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })

        const tokenEmail = await generateToken({
            id: newUser.id,
            type: "register"
        },"10m")

        await newUser.save()

        const emailHeader = {
            from: 'Semua Kopi Indonesia <noreply@gmail.com>',
            to: newUser.email,
            subject: 'Activate Your Account',
            html : {
                otp : randomOtp
            }
        }

        await nodeMailler(emailHeader, 'otp.html')
            
        res.json(successResponse({token : tokenEmail}))
        setTimeout(async () => {
            const userCheck = await User.findOne({ _id : newUser.id})
        if (userCheck.isActive == false) {
            newUser.remove()
        }
        }, 600000)
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}
  
export const resendOtp = async (req, res) => {
    try {
        const randomOtp = (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
        const token = decodeToken(req.params.token)
        const findUser = await User.findOne({ _id : token.id })
        .orFail(new Error('user not found'))

        if (findUser?.isActive == true) {
        throw new Error("user already register")
        }

        const tokenEmail = await generateToken({
            id: findUser.id,
            type: "register"
        },"10m")

        findUser.token = randomOtp

        await findUser.save()
        
        const emailHeader = {
            from: 'Semua Kopi Indonesia <noreply@gmail.com>',
            to: findUser.email,
            subject: 'Activate Your Account',
            html : {
                otp : randomOtp
            }
        }

        nodeMailler(emailHeader, 'otp.html')
        res.json(successResponse({token : tokenEmail}))
        setTimeout(async () => {
            const userCheck = await User.findOne({ _id : newUser.id})
        if (userCheck.isActive == false) {
            newUser.remove()
        }
        }, 600000)
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const updateStatus = async (req, res) => {
    try {
        const decoded = await decodeToken(req.params.token)
        if (decoded.type != "register") {
            throw new Error("invalid token")
        }
        
        const user = await User.findOne({ _id : decoded.id })
        .orFail(new Error('account not found'))
        if (user.isActive == true) {
            throw new Error("account already verifid")
        }
        if (user.otp != req.body.otp) {
            user.validator++
            if (user.validator >= 3) {
              user.remove()
              throw new Error("you enter an invalid otp 3 times")
            }
            await user.save()
            throw new Error("otp not match! please try again")
        }

        user.isActive = true
        user.otp = undefined
        user.validator = undefined
    
        await user.save()
        res.json(successResponse("account sucsses to verifid"))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username : req.body.username })
        .orFail(new Error("Invalid username or password"))
        if (!req.body.password) {
            throw new Error("password required")
        }
        if (user.isActive == false) {
            throw new Error("account is not active")
        }
        if (user.matchPassword(req.body.password) == false) {
            throw new Error("Invalid username or password")
        }

        const payload = await generateToken({
            id : user._id,
            type: "login"
        }, "30d")

        res.json(successResponse({token : payload}))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const forgetPassword = async(req, res) => {
    try {
        if (!req.body.url) {
          throw new Error('redirect url required')
        }
        if (!emailCheck(req.body.email)) {
            throw new Error('is not an email addres')
        }
        const findUser = await User.findOne({email : req.body.email })
        .orFail(new Error("email not found"))
        if (findUser.isActive == false) {
            throw new Error("account is not active please activate your account")
        }
        
        const tokenReset = await generateToken({
            id : findUser.id,
            type: "reset password"
        }, "10m")

        const emailHeader = {
            from: 'Semua Kopi Indonesia <noreply@gmail.com>',
            to: findUser.email,
            subject: 'Forget Your Password',
            html : {
                url : req.body.url,
                token : tokenReset
            }
        }
        nodeMailler(emailHeader, 'forgetPassword.html')
        await findUser.save()
        res.json(successResponse({token : tokenReset}))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const resetPassword = async (req, res) => {
    try {
        if (req.body.newPassword != req.body.confirmNewPassword) {
            throw new Error("password not match")
        }
        const decoded = await decodeToken(req.params.token)
        if (decoded.type != "reset password") {
            throw new Error("invalid token")
        }

        const findUser = await User.findOne({ _id : decoded.id })
        .orFail(new Error('account not found'))
        if (findUser.isActive == false) {
            throw new Error("account is not active please activate your account")
        }

        findUser.password = req.body.newPassword

        await findUser.save()
        res.json(successResponse("password has ben updated"))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}