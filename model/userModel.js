import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        username : {
            type: String,
            require : true,
            unique : [true, 'username must be unique']
        },
        email: {
            type: String,
            require: true,
            unique : [true, 'email must be unique']
        },
        password: {
            type: String,
            require: true
        },
        status : {
            type: String,
            enum: ["user", "admin"],
            require: true,
            default: "user"
        },
        isActive: {
            type: Boolean,
            default: false
        },
        otp: {
            type: String
        },
        validator: {
            type: Number,
            default: 0
        },
        deletedAt: {
        type: Date
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next()
    bcrypt.hash(this.password, 10, (err, password) => {
      if (err) return next(err)
      this.password = password
      next()
    })
})
  
userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password)
}

userSchema.pre('countDocuments', function () {
this.where({ deletedAt: null })
})

userSchema.pre('find', function () {
this.where({ deletedAt: null })
})

userSchema.pre('findOne', function () {
this.where({ deletedAt: null })
})

const User = mongoose.model('user', userSchema)

export default User
