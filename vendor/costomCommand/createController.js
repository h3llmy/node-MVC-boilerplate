import fs from 'fs'

try {
  const inputName = process.argv[2]
  if (!process.argv[2]) {
    throw 'file name is required'
  }
  const newinputName = inputName.replace(/^\w/, (c) => c.toUpperCase())
  const fileName = process.argv[2] + 'Controller.js'
  const fullPath = "'current', ../../controller/" + fileName
  const fileContent = `import { successResponse, errorResponse } from "../vendor/response.js";

import ${newinputName} from "../model/${inputName}Model.js";
import { paginations } from "../vendor/pagination.js";
import validate from "../vendor/validator.js";

export const add = async (req, res) => {
    try {
      validate(req.body, {
        example : {required: true, type: String}
      })
      const new${newinputName} = await ${newinputName}.create({
        example: req.body.example
      })
  
      res.json(successResponse(new${newinputName}))
    } catch (error) {
      res.status(400).json(errorResponse(error))
    }
  }
  
export const list = async (req, res) => {
  try {
    validate(req.query, {
      page : {type: Number},
      limit : {type: Number},
    })
    const ${inputName}Find = await ${newinputName}.find(req.auth.filter, {}, paginations(req.query))

    const totalPages = pageCount(req.query, await ${newinputName}.countDocuments(req.auth.filter));

    res.json(successResponse({totalPages : totalPages, list : ${inputName}Find}))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const detail = async (req, res) => {
  try {
    validate(req.params, {
      ${inputName}_id : {required: true, type: String}
    })
    const ${inputName}Find = await ${newinputName}.findOne({
      _id: req.params.${inputName}_id
    })
    .orFail(new Error('${newinputName} not found'))

    res.json(successResponse(${inputName}Find))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const update = async (req, res) => {
  try {
    validate(req.body, {
      example : {required: true, type: String}
    })
    validate(req.params, {
      ${inputName}_id : {required: true, type: String}
    })
    const ${inputName}Find = await ${newinputName}.findOne({_id: req.params.${inputName}_id})
    .orFail(new Error('${newinputName} not found'))

    ${inputName}Find.example = req.body.example || ${inputName}Find.example

    const update${newinputName} = await ${inputName}Find.save()

    res.json(successResponse(update${newinputName}, '${newinputName} updated'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const remove = async (req, res) => {
  try {  
    validate(req.params, {
      ${inputName}_id : {required: true, type: String}
    })
    const ${inputName}Data = await ${newinputName}.findOne({ _id: req.params.${inputName}_id })
    .orFail(new Error('${newinputName} not found'))

    ${inputName}Data.deletedAt = new Date()

    const delete${newinputName} = await ${inputName}Data.save()

    res.json(successResponse(delete${newinputName}, '${newinputName} deleted'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
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
