import fs from 'fs';

try {
  const inputName = process.argv[2]
  if (!process.argv[2]) {
    throw 'file name is required'
  }
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

    if (fs.existsSync(fullPath)) {
      throw `model ${fileName} has already exsist`
    }
    fs.writeFile(fullPath, fileContent, (err) => {
      if (err) throw err;
      console.log('\x1b[32m%s\x1b[0m', `model ${fileName} has been created!`);
    });

} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', error);
}
