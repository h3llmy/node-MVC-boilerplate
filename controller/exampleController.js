import { successResponse, errorResponse } from "../vendor/response.js";

import Example from "../model/exampleModel.js";
import paginations from "../vendor/pagination.js";

export const add = async (req, res) => {
    try {
      const newValue = await Example.create({
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
    if (req.auth.status == "admin") {
      example = await Example.find({}, {}, paginations(req.query))
    }
    else {
      example = await Example.find({ isActive : true }, {}, paginations(req.query))
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
    const example = await Example.findOne({
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
    const example = await Example.findOne({_id: req.params.example_id})
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
    const exampleData = await Example.findOne({ _id: req.params.example_id })
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
}

export const imageUpload = async (req, res) => {
  try {
    res.json(req.file)
  } catch (error) {
      res.status(400).json(errorResponse(error))
  }
}