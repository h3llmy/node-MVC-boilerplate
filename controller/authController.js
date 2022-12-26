import nodeMailler from "../vendor/nodeMailler.js";
import { successResponse, errorResponse } from "../vendor/response.js";
import { decodeToken, generateToken } from "../vendor/jwtToken.js";
import dotenv from 'dotenv';
import User from "../model/userModel.js";
import {emailCheck} from "../vendor/inputCheck.js";

dotenv.config()

export const register = async (req, res) => {
    try {
        const randomOtp = (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
        const checkEmail = emailCheck(req.body.email)
        if (!checkEmail) {
            throw "is not an email addres"
        }

        if (req.body.password != req.body.confirmPassword) {
            throw "password not match"
        }    

        const findUser = await User.findOne({ email : req.body.email })

        if (findUser?.isActive == true) {
            throw "user already register"
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

        const emailMessage = {
            from: 'Semua Kopi Indonesia <noreply@gmail.com>',
            to: newUser.email,
            subject: 'Activate Your Account',
            html: `
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin:0px;background-color:#f2f3f8;" leftmargin="0">
            <table cellspacing="0" border="0" cellpading="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); 
            font-family: 'Open Sans', sans-serif;">
              <tbody><tr>
                <td>
                  <table style="background-color:#f2f3f8;max-width:670px;margin:0 auto;" width="100%" border="0" align="center" cellpading="0" cellspacing="0">
                    <tbody><tr>
                      <td style="height:80px;">&nbsp;</td>
                    </tr>
                    
                    <tr>
                      <td style="text-align:center;">
                        <a href="http://192.168.254.50:3000/" title="logo" target="_blank">
                          <img width="60" src="https://ik.imagekit.io/dyg6oyjmll/logo_SKI.png" title="logo" alt="logo">
                        </a>
                      </td>
                    </tr>
        
                    <tr>
                      <td style="height:20px;">&nbsp;</td>
                    </tr>
        
                    <tr>
                      <td>
                        <table width="95%" border="0" align="center" cellpading="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                          <tbody><tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                          
                          <tr>
                            <td style="padding:0 35px;">
                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family
                              :'Rubik',sans-serif;">
                                Anda Sudah Melakukan Registrasi Akun
                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;padding-top:20pt;">
                                Untuk melakukan aktivasi akun customer BLiP, silahkan salin kode OTP dibawah ini dan masukan pada kolom OTP pada website BLiP 
                              </p>
                              <h1>
            ${randomOtp}
        </h1>
                            </h1></td>
                          </tr>
                          
                          <tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                        </tbody></table>
                      </td>
                      </tr><tr>
                        <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align:center;">
                          <h3 style="display:block;font-size:1.17em;color:#6c6c6c;margin-bottom:0px;font-weight:bold;text-transform:uppercase;"><strong>PT. BLiP apps</strong></h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
        </body>
            `
        }
        nodeMailler(emailMessage)
        res.status(200).json(successResponse({token : tokenEmail}))
        setTimeout(() => {
          if (newUser.isActive == false) {
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

    if (findUser?.isActive == true) {
      throw "user already register"
    }

    const tokenEmail = await generateToken({
      id: findUser.id,
      type: "register"
    },"10m")

    findUser.token = randomOtp

      await findUser.save()
      
      const emailMessage = {
        from: 'Semua Kopi Indonesia <noreply@gmail.com>',
        to: findUser.email,
        subject: 'Activate Your Account',
        html: `
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin:0px;background-color:#f2f3f8;" leftmargin="0">
        <table cellspacing="0" border="0" cellpading="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); 
        font-family: 'Open Sans', sans-serif;">
          <tbody><tr>
            <td>
              <table style="background-color:#f2f3f8;max-width:670px;margin:0 auto;" width="100%" border="0" align="center" cellpading="0" cellspacing="0">
                <tbody><tr>
                  <td style="height:80px;">&nbsp;</td>
                </tr>
                
                <tr>
                  <td style="text-align:center;">
                    <a href="http://192.168.254.50:3000/" title="logo" target="_blank">
                      <img width="60" src="https://ik.imagekit.io/dyg6oyjmll/logo_SKI.png" title="logo" alt="logo">
                    </a>
                  </td>
                </tr>
    
                <tr>
                  <td style="height:20px;">&nbsp;</td>
                </tr>
    
                <tr>
                  <td>
                    <table width="95%" border="0" align="center" cellpading="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                      <tbody><tr>
                        <td style="height:40px;">&nbsp;</td>
                      </tr>
                      
                      <tr>
                        <td style="padding:0 35px;">
                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family
                          :'Rubik',sans-serif;">
                            Anda Sudah Melakukan Registrasi Akun
                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;padding-top:20pt;">
                            Untuk melakukan aktivasi akun customer BLiP, silahkan salin kode OTP dibawah ini dan masukan pada kolom OTP pada website BLiP 
                          </p>
                          <h1>
        ${randomOtp}
    </h1>
                        </h1></td>
                      </tr>
                      
                      <tr>
                        <td style="height:40px;">&nbsp;</td>
                      </tr>
                    </tbody></table>
                  </td>
                  </tr><tr>
                    <td style="height:20px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="text-align:center;">
                      <h3 style="display:block;font-size:1.17em;color:#6c6c6c;margin-bottom:0px;font-weight:bold;text-transform:uppercase;"><strong>PT. BLiP apps</strong></h3>
                    </td>
                  </tr>
                  <tr>
                    <td style="height:80px;">&nbsp;</td>
                  </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
    </body>
        `
    }
    nodeMailler(emailMessage)
    res.status(200).json(tokenEmail)
    setTimeout(() => {
      if (newUser.isActive == false) {
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
            throw "invalid token"
        }
        
        const user = await User.findOne({ _id : decoded.id })
        if (!user) {
            throw "account not found"
        }
        if (user.isActive == true) {
            throw "account already verifid"
        }
        if (user.otp != req.body.otp) {
            user.validator++
            if (user.validator >= 3) {
              user.remove()
              throw "you enter an invalid otp 3 times"
            }
            await user.save()
            throw "otp not match! please try again"
        }

        user.isActive = true
        user.otp = undefined
        user.validator = undefined
    
        await user.save()
        res.status(200).json(successResponse("account sucsses to verifid"))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username : req.body.username })
        if (!user) {
            throw "Invalid username or password"
        }
        if (!req.body.password) {
            throw "password required"
        }
        if (user.isActive == false) {
            throw "account is not active"
        }
        if (user.matchPassword(req.body.password) == false) {
            throw "Invalid username or password"
        }

        const payload = await generateToken({
            id : user._id,
            type: "login"
        }, "30d")

        res.status(200).json(successResponse({token : payload}))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const forgetPassword = async(req, res) => {
    try {
        const findUser = await User.findOne({ email : req.body.email })
        if (!findUser) {
            throw "email not found"
        }
        if (findUser.isActive == false) {
            throw "account is not active please activate your account"
        }
        
        const tokenReset = await generateToken({
            id : findUser.id,
            type: "reset password"
        }, "10m")

        const emailMessages = {
            from: 'Semua Kopi Indonesia <noreply@gmail.com>',
            to: findUser.email,
            subject: 'Forget Your Password',
            html: `
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin:0px;background-color:#f2f3f8;" leftmargin="0">
            <table cellspacing="0" border="0" cellpading="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); 
            font-family: 'Open Sans', sans-serif;">
              <tbody><tr>
                <td>
                  <table style="background-color:#f2f3f8;max-width:670px;margin:0 auto;" width="100%" border="0" align="center" cellpading="0" cellspacing="0">
                    <tbody><tr>
                      <td style="height:80px;">&nbsp;</td>
                    </tr>
                    
                    <tr>
                      <td style="text-align:center;">
                        <a href="http://192.168.254.50:3000/" title="logo" target="_blank">
                          <img width="60" src="https://ik.imagekit.io/dyg6oyjmll/logo_SKI.png" title="logo" alt="logo">
                        </a>
                      </td>
                    </tr>
        
                    <tr>
                      <td style="height:20px;">&nbsp;</td>
                    </tr>
        
                    <tr>
                      <td>
                        <table width="95%" border="0" align="center" cellpading="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                          <tbody><tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                          
                          <tr>
                            <td style="padding:0 35px;">
                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family
                              :'Rubik',sans-serif;">
                                Anda Sudah Melakukan Registrasi Akun
                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;padding-top:20pt;">
                                Untuk melakukan aktivasi akun customer BLiP, silahkan salin kode OTP dibawah ini dan masukan pada kolom OTP pada website BLiP 
                              </p>
                              <a href="${process.env.CLIENT_URL}/api/v1/auth/reset/password/${tokenReset}" style="background:#D63031;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;font-size:14px;padding:10px 24px;display:inline-block;border-radius:15px;">
                              Aktivasi
                            </a>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                        </tbody></table>
                      </td>
                      </tr><tr>
                        <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align:center;">
                          <h3 style="display:block;font-size:1.17em;color:#6c6c6c;margin-bottom:0px;font-weight:bold;text-transform:uppercase;"><strong>PT. BLiP apps</strong></h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
        </body>
            `
        }
        await findUser.save()
        nodeMailler(emailMessages)
        res.status(200).json(successResponse({token : tokenReset}))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}

export const resetPassword = async (req, res) => {
    try {
        if (req.body.newPassword != req.body.confirmNewPassword) {
            throw "password not match"
        }
        const decoded = await decodeToken(req.params.token)
        if (decoded.type != "reset password") {
            throw "invalid token"
        }

        const findUser = await User.findOne({ _id : decoded.id })
        if (!findUser) {
            throw "account not found"
        }
        if (findUser.isActive == false) {
            throw "account is not active please activate your account"
        }

        findUser.password = req.body.newPassword

        await findUser.save()
        res.status(200).json(successResponse("password has ben updated"))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}