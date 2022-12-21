import fs from 'fs';

const inputName = process.argv[2]
const newinputName = inputName.replace(/^\w/, c => c.toUpperCase());
const fileName = process.argv[2] + "Controller.js";
const fullPath =  "'current', ../../controller/" + fileName
const fileContent = `import { successResponse, errorResponse } from "../vendor/response.js";

import ${newinputName} from "../model/${inputName}Model.js";
import paginations from "../vendor/pagination.js";

export const add = async (req, res) => {
    try {
      const newValue = await ${newinputName}.create({
        example: req.body.example
      })
  
      res.status(200).json(successResponse(newValue))
    } catch (error) {
      res.status(400).json(errorResponse(error))
    }
  }
  
export const list = async (req, res) => {
  try {
    let example = []
    if (req.auth.status == "visitors") {
      example = await ${newinputName}.find({ isActive : true }, {}, paginations(req.query))
    }else {
      example = await ${newinputName}.find({}, {}, paginations(req.query))
    }
    if (!example) {
      throw 'Example not found.'
    }

    res.status(200).json(successResponse(example))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const detail = async (req, res) => {
  try {
    const example = await ${newinputName}.findOne({
      _id: req.params.example_id
    })
    if (!example) {
      throw 'Example not found.'
    }

    res.status(200).json(successResponse(example))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const update = async (req, res) => {
  try {
    const example = await ${newinputName}.findOne({_id: req.params.example_id})
    if (!example) {
      throw 'Example not found'
    }

    example.example = req.body.example || example.example

    const updateExample = await example.save()

    res.status(200).json(successResponse(updateExample, 'Example updated'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const remove = async (req, res) => {
  try {  
    const exampleData = await ${newinputName}.findOne({ _id: req.params.example_id })
    if (!exampleData) {
      throw 'Example not found.'
    }

    exampleData.deletedAt = new Date()

    const deleteExample = await exampleData.save()
    if (!deleteExample) {
      throw 'Fail to delete Example.'
    }

    res.status(200).json(successResponse(deleteExample, 'Example deleted'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}`;

try {
  if (fs.existsSync(fullPath)) {
    throw `controller ${fileName} has already exsist`
  }
    if (!process.argv[2]) {
        throw 'file name is required'
    }
    fs.writeFile(fullPath, fileContent, (err) => {
      if (err) throw err;
      console.log(`controller ${fileName} has been created!`);
    });
} catch (error) {
    console.error(error);
}
