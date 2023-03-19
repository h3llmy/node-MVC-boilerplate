import fs from 'fs'

try {
  if (process.env.NODE_ENV !== 'development') {
    throw 'on production mode'
  }
  const inputName = process.argv[2]
  if (!process.argv[2]) {
    throw 'file name is required'
  }
  const newinputName = inputName.replace(/^\w/, (c) => c.toUpperCase())
  const fileName = process.argv[2] + 'Model.js'
  const fullPath = "'current', ../../model/" + fileName
  const fileContent = `import mongoose from 'mongoose'
import softDeletePlugin from '../utils/mongoosePlugin/softDelete.js'
import paginatePlugin from '../utils/mongoosePlugin/pagination.js'

const ${inputName}Schema = new mongoose.Schema(
  {
    name : {
      type: String,
      required : true,
      unique : [true, 'name must be unique']
    },
    isActive : {
      type : Boolean,
      default : true
    }
  },
  {
      timestamps: true
  }
)

${inputName}Schema.plugin(softDeletePlugin);
${inputName}Schema.plugin(paginatePlugin);

const ${newinputName} = mongoose.model('${inputName}', ${inputName}Schema)

export default ${newinputName}`

  if (fs.existsSync(fullPath)) {
    throw `model ${fileName} has already exsist`
  }
  fs.writeFile(fullPath, fileContent, (err) => {
    if (err) throw err
    console.log('\x1b[32m%s\x1b[0m', `model ${fileName} has been created!`)
  })
} catch (error) {
  console.log('\x1b[31m%s\x1b[0m', error)
}
