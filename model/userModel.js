import mongoose from 'mongoose'
import { emailCheck } from '../utils/validator.js'
import { comparePassword, hasPassword } from '../service/bcrypt.js'
import softDeletePlugin from '../utils/mongoosePlugin/softDelete.js'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, 'username must be unique'],
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'email must be unique'],
      validate: {
        validator: emailCheck,
        message: 'invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    validator: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hasedPassword = await hasPassword(this.password)
    this.password = hasedPassword
  }
  next()
})

userSchema.methods.matchPassword = function (enteredPassword) {
  return comparePassword(enteredPassword, this.password)
}

userSchema.plugin(softDeletePlugin)

const User = mongoose.model('user', userSchema)

export default User
