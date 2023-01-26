import mongoose from 'mongoose'
import mongoose_autopopulate from 'mongoose-autopopulate'

const example = new mongoose.Schema(
  {
    example: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      autopopulate: true,
    },
    picture: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

example.pre('countDocuments', function () {
  this.where({ deletedAt: null })
})

example.pre('find', function () {
  this.where({ deletedAt: null })
})

example.pre('findOne', function () {
  this.where({ deletedAt: null })
})

example.plugin(mongoose_autopopulate)

const Example = mongoose.model('example', example)

export default Example
