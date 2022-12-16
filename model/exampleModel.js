import mongoose from 'mongoose'

const example = new mongoose.Schema(
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

example.pre('countDocuments', () => {
this.where({ deletedAt: null })
})

example.pre('find', () => {
this.where({ deletedAt: null })
})

example.pre('findOne', () => {
this.where({ deletedAt: null })
})

const Example = mongoose.model('example', example)

export default Example
