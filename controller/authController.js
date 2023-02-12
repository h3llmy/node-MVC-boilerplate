import sendMail from '../service/nodeMailler.js'
import { successResponse, errorResponse } from '../vendor/response.js'
import { decodeRefreshToken, decodeToken, generateRefreshToken, generateToken } from '../service/jwtToken.js'
import User from '../model/userModel.js'
import validate from '../vendor/validator.js'

export const register = async (req, res) => {
  try {
    validate(req.body, {
      email: { required: true, isEmail: true, type: String },
      username: { required: true, type: String },
      password: { required: true, type: String, min: 8, max: 12 },
      confirmPassword: { required: true, type: String, min: 8, max: 12 },
    })
    const randomOtp = (Math.floor(Math.random() * 100000) + 100000)
      .toString()
      .substring(1)

    if (req.body.password != req.body.confirmPassword) {
      throw new Error('password not match')
    }

    const findUser = await User.findOne({ email: req.body.email })

    if (findUser?.isActive == true) {
      throw new Error('user already register')
    }
    if (findUser?.isActive == false) {
      await findUser.remove()
    }

    const newUser = await User.create({
      otp: randomOtp,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })

    const tokenEmail = generateToken(
      {
        id: newUser.id,
        type: 'register',
      },
      '10m'
    )

    await newUser.save()

    const emailHeader = {
      to: newUser.email,
      subject: 'Activate Your Account',
      html: {
        otp: randomOtp,
      },
    }

    await sendMail(emailHeader, 'otp.html')

    res.json(successResponse({ token: tokenEmail }))
    setTimeout(async () => {
      const userCheck = await User.findOne({ _id: newUser.id })
      if (userCheck.isActive == false) {
        userCheck.remove()
      }
    }, 600000)
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const resendOtp = async (req, res) => {
  try {
    const randomOtp = (Math.floor(Math.random() * 100000) + 100000)
      .toString()
      .substring(1)
    const token = decodeToken(req.params.token)
    const findUser = await User.findOne({ _id: token.id }).orFail(
      new Error('user not found')
    )

    if (findUser?.isActive == true) {
      throw new Error('user already register')
    }

    const tokenEmail = generateToken(
      {
        id: findUser.id,
        type: 'register',
      },
      '10m'
    )

    findUser.token = randomOtp

    await findUser.save()

    const emailHeader = {
      to: findUser.email,
      subject: 'Activate Your Account',
      html: {
        otp: randomOtp,
      },
    }

    await sendMail(emailHeader, 'otp.html')
    res.json(successResponse({ token: tokenEmail }))
    setTimeout(async () => {
      const userCheck = await User.findOne({ _id: findUser.id })
      if (userCheck.isActive == false) {
        userCheck.remove()
      }
    }, 600000)
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const updateStatus = async (req, res) => {
  try {
    validate(req.body, {
      otp: { required: true, type: String },
    })
    const decoded = decodeToken(req.params.token)
    if (decoded.type != 'register') {
      throw new Error('invalid token')
    }

    const user = await User.findOne({ _id: decoded.id }).orFail(
      new Error('account not found')
    )
    if (user.isActive == true) {
      throw new Error('account already verifid')
    }
    if (user.otp != req.body.otp) {
      user.validator++
      if (user.validator >= 3) {
        user.remove()
        throw new Error('you enter an invalid otp 3 times')
      }
      await user.save()
      throw new Error('otp not match! please try again')
    }

    user.isActive = true
    user.otp = undefined
    user.validator = undefined

    await user.save()
    res.json(successResponse('account sucsses to verifid'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const login = async (req, res) => {
  try {
    validate(req.body, {
      username: { required: true, type: String },
      password: { required: true, type: String },
    })
    const user = await User.findOne({ username: req.body.username }).orFail(
      new Error('Invalid username or password')
    )

    if (user.isActive == false) {
      throw new Error('account is not active')
    }
    if (user.matchPassword(req.body.password) == false) {
      throw new Error('Invalid username or password')
    }

    const accessToken = generateToken(
      {
        id: user._id,
        type: 'login',
      },
      '30s'
    )

    const refreshToken = generateRefreshToken(
      {
        id: user._id,
        type: 'login',
      },
      '30d'
    )

    res.json(successResponse({
      accessToken: accessToken,
      refreshToken: refreshToken
    }))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const forgetPassword = async (req, res) => {
  try {
    validate(req.body, {
      email: { required: true, type: String, isEmail: true },
      url: { required: true, type: String, isUrl: true },
    })
    const findUser = await User.findOne({ email: req.body.email }).orFail(
      new Error('email not found')
    )
    if (findUser.isActive == false) {
      throw new Error('account is not active please activate your account')
    }

    const tokenReset = generateToken(
      {
        id: findUser.id,
        type: 'reset password',
      },
      '10m'
    )

    const emailHeader = {
      to: findUser.email,
      subject: 'Forget Your Password',
      html: {
        url: req.body.url,
        token: tokenReset,
      },
    }
    await sendMail(emailHeader, 'forgetPassword.html')
    await findUser.save()
    res.json(successResponse({ token: tokenReset }))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const resetPassword = async (req, res) => {
  try {
    validate(req.body, {
      newPassword: { required: true, type: String },
      confirmNewPassword: { required: true, type: String },
    })
    if (req.body.newPassword != req.body.confirmNewPassword) {
      throw new Error('password not match')
    }
    const decoded = decodeToken(req.params.token)
    if (decoded.type != 'reset password') {
      throw new Error('invalid token')
    }

    const findUser = await User.findOne({ _id: decoded.id }).orFail(
      new Error('account not found')
    )
    if (findUser.isActive == false) {
      throw new Error('account is not active please activate your account')
    }

    findUser.password = req.body.newPassword

    await findUser.save()
    res.json(successResponse('password has ben updated'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const refreshToken = async (req, res) => {
  try {
    validate(req.body, {
      refreshToken: { required: true, type: String }
    })
    const decodedRefreshToken = decodeRefreshToken(req.body.refreshToken)
    const userCheck = await User.findOne({ _id: decodedRefreshToken.id }).orFail(
      new Error('user not found')
    )

    const newAccessToken = generateToken({
      id: userCheck.id,
      type: 'login'
    }, '30s')

    const newRefreshToken = generateRefreshToken({
      id: userCheck.id,
      type: 'login'
    }, '30d')

    res.json(successResponse({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}