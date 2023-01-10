import { successResponse, errorResponse } from "../vendor/response.js";

import Example from "../model/exampleModel.js";
import {pageCount, paginations} from "../vendor/pagination.js";
import { saveFile, uploadFile } from "../vendor/uploadFile.js";

export const add = async (req, res) => {
  try {
    const file = uploadFile(req.files.picture, {gte : 10})
    const newValue = await Example.create({
      example: req.body.example,
      picture: file.fileURI,
      userId : req.body.userId
    })

    saveFile(file)

    res.status(200).json(successResponse(newValue))
  } catch (error) {
    console.log(error);
    res.status(400).json(errorResponse(error.message))
  }
}
  
export const list = async (req, res) => {
  try {
    const example =  await Example.find(req.auth.filter, {}, paginations(req.query))
    .orFail(new Error('Example not found'))

    const totalPages = pageCount(req.query, await Example.countDocuments(req.auth.filter));

    res.status(200).json(successResponse({totalPages : totalPages, list : example}))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}

export const detail = async (req, res) => {
  try {
    const example = await Example.findOne({
      "userId": req.params.example_id
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