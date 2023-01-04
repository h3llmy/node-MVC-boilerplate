import mongoose from 'mongoose'

const nameSchema = new mongoose.Schema(
  {
    name : {
      type: String,
      required : true,
      unique : [true, 'name must be unique']
    },
    isActive : {
      type : Boolean,
      default : true
    },
    deletedAt: {
      type: Date
    }
  },
  {
      timestamps: true
  }
)

nameSchema.pre('countDocuments', function () {
  this.where({ deletedAt: null })
})

nameSchema.pre('find', function () {
  this.where({ deletedAt: null })
})

nameSchema.pre('findOne', function () {
  this.where({ deletedAt: null })
})

const Name = mongoose.model('name', nameSchema)

export default Name