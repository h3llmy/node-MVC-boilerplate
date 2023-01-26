import { successResponse, errorResponse } from '../vendor/response.js'

import Example from '../model/exampleModel.js'
import { pageCount, paginations } from '../vendor/pagination.js'
import { deleteFile, saveFile, uploadFile } from '../vendor/uploadFile.js'
import validate from '../vendor/validator.js'
import fs from 'fs'

export const add = async (req, res) => {
  try {
    validate(req.body, {
      example: { required: true, type: String },
      userId: { required: true, type: String },
    })
    validate(req.files, {
      picture: { type: Object },
    })

    const file = uploadFile(req.files.picture, { gte: 10 })
    const newValue = await Example.create({
      example: req.body.example,
      picture: file?.filePath,
      userId: req.body.userId,
    })

    if (file) {
      saveFile(file)
    }

    res.json(successResponse(newValue))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const list = async (req, res) => {
  try {
    const example = await Example.find(
      req.auth.filter,
      {},
      paginations(req.query)
    )

    const totalPages = pageCount(
      req.query,
      await Example.countDocuments(req.auth.filter)
    )

    res.json(successResponse({ totalPages: totalPages, list: example }))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const createReport = async (req, res) => {
  try {
    const fileName = Date.now()
    const examples = await Example.find().cursor()
    fs.writeFile(
      `'current', ../../public/text/${fileName}.csv`,
      'example, picture, userId, createdAt\n',
      (err) => {
        if (err) {
          throw new Error(err)
        }
      }
    )
    examples.on('data', (example) => {
      fs.appendFile(
        `'current', ../../public/text/${fileName}.csv`,
        `${example.example}, ${example.picture}, ${example.userId.id}, ${example.createdAt}\n`,
        (err) => {
          if (err) {
            throw new Error(err)
          }
        }
      )
    })
    res.json({ fileUrl: process.env.BASE_URL + `text/${fileName}.csv` })
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const detail = async (req, res) => {
  try {
    const example = await Example.findOne({
      userId: req.params.example_id,
    }).orFail(new Error('Example not found'))

    res.json(successResponse(example))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const update = async (req, res) => {
  try {
    validate(req.body, {
      example: { required: true, type: String },
    })
    validate(req.files, {
      picture: { required: true, type: Object },
    })
    const file = uploadFile(req.files.picture, { gte: 10 })
    const example = await Example.findOne({
      _id: req.params.example_id,
    }).orFail(new Error('Example not found'))

    if (example.picture != file.filePath) {
      deleteFile(example.picture)
    }

    example.example = req.body.example || example.example
    example.picture = file.filePath || example.picture

    const updateExample = await example.save()

    await saveFile(file)

    res.json(successResponse(updateExample, 'Example updated'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const remove = async (req, res) => {
  try {
    const exampleData = await Example.findOne({
      _id: req.params.example_id,
    }).orFail(new Error('Example not found'))

    exampleData.deletedAt = new Date()

    const deleteExample = await exampleData.save()

    res.json(successResponse(deleteExample, 'Example deleted'))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}

export const removeFile = async (req, res) => {
  try {
    const exampleFind = await Example.findOne({
      _id: req.params.file_id,
    }).orFail(new Error('example not found'))

    await deleteFile(exampleFind.picture)

    exampleFind.picture = undefined

    exampleFind.save()
    res.json(successResponse(exampleFind))
  } catch (error) {
    res.status(400).json(errorResponse(error))
  }
}
