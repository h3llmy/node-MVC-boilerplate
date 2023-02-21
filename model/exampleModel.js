import mongoose from 'mongoose'
import mongoose_autopopulate from 'mongoose-autopopulate'
import paginatePlugin from '../vendor/mongoosePlugin/pagination.js'
import softDeletePlugin from '../vendor/mongoosePlugin/softDelete.js'

const exampleSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
)

exampleSchema.plugin(mongoose_autopopulate)
exampleSchema.plugin(softDeletePlugin)
exampleSchema.plugin(paginatePlugin)

const Example = mongoose.model('example', exampleSchema)

export default Example
