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
  const fileName = process.argv[2] + 'Controller.js'
  const fullPath = "'current', ../../controller/" + fileName
  const fileContent = `import { successResponse } from "../utils/response.js";

import ${newinputName} from "../model/${inputName}Model.js";
import validate from "../utils/validator.js";
import CustomError from '../utils/customError.js';

export const add = async (req, res, next) => {

      validate(req.body, {
        example : {required: true, type: String}
      })
      const new${newinputName} = await ${newinputName}.create({
        example: req.body.example
      })
  
      res.json(successResponse(new${newinputName}))
    } catch (error) {
      next(error)
    }
  }
  
export const list = async (req, res, next) => {
    const ${inputName}Find = await ${newinputName}.paginate(req.auth.filter, req.query)

    res.json(successResponse(${inputName}Find))
}

export const detail = async (req, res, next) => {
    const ${inputName}Find = await ${newinputName}.findOne({
      _id: req.params.${inputName}_id
    })
    .orFail(new CustomError('${newinputName} not found', 404))

    res.json(successResponse(${inputName}Find))
}

export const update = async (req, res, next) => {
    validate(req.body, {
      example : {required: true, type: String}
    })
    const ${inputName}Find = await ${newinputName}.findOne({_id: req.params.${inputName}_id})
    .orFail(new CustomError('${newinputName} not found', 404))

    ${inputName}Find.example = req.body.example

    const update${newinputName} = await ${inputName}Find.save()

    res.json(successResponse(update${newinputName}, '${newinputName} updated'))
}

export const remove = async (req, res, next) => {  
    const ${inputName}Data = await ${newinputName}.softDelete({ _id: req.params.${inputName}_id })

    res.json(successResponse(${inputName}Data, '${newinputName} deleted'))
}`

  if (fs.existsSync(fullPath)) {
    throw `controller ${fileName} has already exsist`
  }
  fs.writeFile(fullPath, fileContent, (err) => {
    if (err) throw err
    console.log('\x1b[32m%s\x1b[0m', `controller ${fileName} has been created!`)
  })
} catch (error) {
  console.log('\x1b[31m%s\x1b[0m', error)
}
