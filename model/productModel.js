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

productSchema.pre('countDocuments', () => {
this.where({ deletedAt: null })
})

productSchema.pre('find', () => {
this.where({ deletedAt: null })
})

productSchema.pre('findOne', () => {
this.where({ deletedAt: null })
})

const Product = mongoose.model('product', productSchema)

export default Product