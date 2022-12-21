import fs from 'fs';

const inputName = process.argv[2]
const newinputName = inputName.replace(/^\w/, c => c.toUpperCase());
const fileName = process.argv[2] + "Model.js";
const fullPath =  "'current', ../../model/" + fileName
const fileContent = `import mongoose from 'mongoose'

const ${inputName}Schema = new mongoose.Schema(
  {
    name : {
      type: String,
      require : true,
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

${inputName}Schema.pre('countDocuments', function () {
  this.where({ deletedAt: null })
})

${inputName}Schema.pre('find', function () {
  this.where({ deletedAt: null })
})

${inputName}Schema.pre('findOne', function () {
  this.where({ deletedAt: null })
})

const ${newinputName} = mongoose.model('${inputName}', ${inputName}Schema)

export default ${newinputName}`;

try {
  if (fs.existsSync(fullPath)) {
    throw `model ${fileName} has already exsist`
  }
    if (!process.argv[2]) {
        throw 'file name is required'
    }
    fs.writeFile(fullPath, fileContent, (err) => {
      if (err) throw err;
      console.log(`model ${fileName} has been created!`);
    });

} catch (error) {
  console.error(error);
}
