import sendMail from '../service/nodeMailler.js'
import { successResponse } from '../utils/response.js'
import { decodeRefreshToken, decodeToken, generateRefreshToken, generateToken } from '../service/jwtToken.js'
import User from '../model/userModel.js'
import validate from '../utils/validator.js'
import CustomError from '../utils/customError.js'

export const register = async (req, res, next) => {
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
    throw new CustomError('password not match', 422)
  }

  const findUser = await User.findOne({ email: req.body.email })

  if (findUser?.isActive == true) {
    throw new CustomError('user already register', 400)
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

  const emailHeader = {
    to: newUser.email,
    subject: 'Activate Your Account',
    html: {
      otp: randomOtp,
    },
  }

  sendMail(emailHeader, 'otp.html')

  res.json(successResponse({ token: tokenEmail }))
  setTimeout(async () => {
    const userCheck = await User.findOne({ _id: newUser.id })
    if (userCheck.isActive == false) {
      userCheck.remove()
    }
  }, 600000)
}

export const resendOtp = async (req, res, next) => {
  const randomOtp = (Math.floor(Math.random() * 100000) + 100000)
    .toString()
    .substring(1)
  const token = decodeToken(req.params.token)
  if (token.type != 'register') {
    throw new CustomError('invalid token', 422)
  }
  const findUser = await User.findOne({ _id: token.id })
    .orFail(new CustomError('user not found', 404))


  if (findUser?.isActive == true) {
    throw new CustomError('user already register', 400)
  }

  findUser.otp = randomOtp

  findUser.save()

  const tokenEmail = generateToken(
    {
      id: findUser.id,
      type: 'register',
    },
    '10m'
  )

  const emailHeader = {
    to: findUser.email,
    subject: 'Activate Your Account',
    html: {
      otp: randomOtp,
    },
  }

  sendMail(emailHeader, 'otp.html')
  res.json(successResponse({ token: tokenEmail }))
  setTimeout(async () => {
    const userCheck = await User.findOne({ _id: findUser.id })
    if (userCheck.isActive == false) {
      userCheck.remove()
    }
  }, 600000)
}

export const updateStatus = async (req, res, next) => {
  validate(req.body, {
    otp: { required: true, type: String },
  })
  const decoded = decodeToken(req.params.token)
  if (decoded.type != 'register') {
    throw new CustomError('invalid token', 422)
  }

  const user = await User.findOne({ _id: decoded.id }).orFail(
    new CustomError('account not found', 404)
  )
  if (user.isActive == true) {
    throw new CustomError('account already verifid', 400)
  }
  if (user.otp != req.body.otp) {
    user.validator++
    if (user.validator >= 3) {
      user.remove()
      throw new CustomError('you enter an invalid otp 3 times', 400)
    }
    await user.save()
    throw new CustomError('otp not match! please try again', 400)
  }

  user.isActive = true
  user.otp = undefined
  user.validator = undefined

  await user.save()
  res.json(successResponse('account sucsses to verifid'))
}

export const login = async (req, res, next) => {
  validate(req.body, {
    username: { required: true, type: String },
    password: { required: true, type: String },
  })
  const user = await User.findOne({ username: req.body.username }).orFail(
    new CustomError('Invalid username or password', 422)
  )

  if (user.isActive == false) {
    throw new CustomError('account is not active', 401)
  }
  if (user.matchPassword(req.body.password) == false) {
    throw new CustomError('Invalid username or password', 422)
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
}

export const forgetPassword = async (req, res, next) => {
  validate(req.body, {
    email: { required: true, type: String, isEmail: true },
    url: { required: true, type: String, isUrl: true },
  })
  const findUser = await User.findOne({ email: req.body.email }).orFail(
    new CustomError('email not found', 404)
  )
  if (findUser.isActive == false) {
    throw new CustomError('account is not active please activate your account', 400)
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
  sendMail(emailHeader, 'forgetPassword.html')
  await findUser.save()
  res.json(successResponse({ token: tokenReset }))
}

export const resetPassword = async (req, res, next) => {
  validate(req.body, {
    newPassword: { required: true, type: String },
    confirmNewPassword: { required: true, type: String },
  })
  if (req.body.newPassword != req.body.confirmNewPassword) {
    throw new CustomError('password not match', 422)
  }
  const decoded = decodeToken(req.params.token)
  if (decoded.type != 'reset password') {
    throw new CustomError('invalid token', 401)
  }

  const findUser = await User.findOne({ _id: decoded.id }).orFail(
    new CustomError('account not found', 404)
  )
  if (findUser.isActive == false) {
    throw new CustomError('account is not active please activate your account', 400)
  }

  findUser.password = req.body.newPassword

  await findUser.save()
  res.json(successResponse('password has ben updated'))
}

export const refreshToken = async (req, res, next) => {
  validate(req.body, {
    refreshToken: { required: true, type: String }
  })
  const decodedRefreshToken = decodeRefreshToken(req.body.refreshToken)
  if (decodedRefreshToken.type != 'login') {
    throw new CustomError('invalid token', 401)
  }
  const userCheck = await User.findOne({ _id: decodedRefreshToken.id }).orFail(
    new CustomError('user not found', 404)
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
}