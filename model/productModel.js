import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        example : {
            type: String,
            require : true,
            unique : [true, 'name must be unique']
        },
        deletedAt: {
        type: Date
        }
    },
    {
        timestamps: true
    }
)

productSchema.pre('countDocuments', function () {
this.where({ deletedAt: null })
})

productSchema.pre('find', function () {
this.where({ deletedAt: null })
})

productSchema.pre('findOne', function () {
this.where({ deletedAt: null })
})

const Product = mongoose.model('product', productSchema)

export default Product