import { successResponse, errorResponse } from "../vendor/response.js";

import Name from "../model/nameModel.js";

export const add = async (req, res) => {
    try {
      const newName = await Name.create({
        example: req.body.example
      })
  
      res.status(200).json(successResponse(newName))
    } catch (error) {
      res.status(400).json(errorResponse(error.message))
    }
  }
  
export const list = async (req, res) => {
  try {
    const nameFind = await Name.find().cursor()
    // Initialize an array to hold the documents
    const data = [];

    // Process the documents in the cursor
    nameFind.on('data', (doc) => {
      data.push(doc);
    });

    nameFind.on('close', () => {
      // Convert the array of documents to a CSV string
      stringify(data, (err, output) => {
        if (err) {
          console.error(err);
        } else {
          // Write the CSV string to a file
          fs.writeFile('report.csv', output, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('Report saved');
            }
          });
        }
      });
    });
    res.status(200).json(successResponse("nameFind"))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}

export const detail = async (req, res) => {
  try {
    const nameFind = await Name.findOne({
      _id: req.params.name_id
    })
    .orFail(new Error('Name not found'))

    res.status(200).json(successResponse(nameFind))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}

export const update = async (req, res) => {
  try {
    const nameFind = await Name.findOne({_id: req.params.example_id})
    .orFail(new Error('Name not found'))

    nameFind.example = req.body.example || nameFind.example

    const updateName = await nameFind.save()

    res.status(200).json(successResponse(updateName, 'Example updated'))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}

export const remove = async (req, res) => {
  try {  
    const nameData = await Name.findOne({ _id: req.params.example_id })
    .orFail(new Error('Name not found'))

    nameData.deletedAt = new Date()

    const deleteName = await nameData.save()

    res.status(200).json(successResponse(deleteName, 'Example deleted'))
  } catch (error) {
    res.status(400).json(errorResponse(error.message))
  }
}