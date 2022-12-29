import { successResponse, errorResponse } from "../vendor/response.js";

import Example from "../model/exampleModel.js";
import paginations from "../vendor/pagination.js";
import uploadFile from "../vendor/uploadFile.js";

export const add = async (req, res) => {
    try {
      const newValue = await Example.create({
        example: req.body.example,
        picture: req.files?.picture?.name,
        userId : req.body.userId
      })
      const picture = uploadFile(req.files.picture)
      if (!picture) {
        throw await newValue.remove() 
      }

      newValue.picture = picture.filePath
      newValue.save()
  
      res.status(200).json(successResponse(newValue))
    } catch (error) {
      res.status(400).json(errorResponse(error.message))
    }
  }
  
export const list = async (req, res) => {
  try {
    const example =  await Example.find(req.auth.filter, {}, paginations(req.query))
    .populate("userId")
    .orFail(new Error('Example not found'))

    res.status(200).json(successResponse(example))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}

export const detail = async (req, res) => {
  try {
    const example = await Example.findOne({
      _id: req.params.example_id
    })
    .orFail(new Error('Example not found'))

    res.status(200).json(successResponse(example))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}

export const update = async (req, res) => {
  try {
    const example = await Example.findOne({_id: req.params.example_id})
    .orFail(new Error('Example not found'))

    example.example = req.body.example || example.example

    const updateExample = await example.save()

    res.status(200).json(successResponse(updateExample, 'Example updated'))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}

export const remove = async (req, res) => {
  try {  
    const exampleData = await Example.findOne({ _id: req.params.example_id })
    .orFail(new Error('Example not found'))

    exampleData.deletedAt = new Date()

    const deleteExample = await exampleData.save()

    res.status(200).json(successResponse(deleteExample, 'Example deleted'))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}