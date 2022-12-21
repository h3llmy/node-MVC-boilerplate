import fs from 'fs';

const inputName = process.argv[2]
const controllerName = process.argv[3]
const fileName = process.argv[3] + "Controller.js";
const fullPath =  "'current', ../../controller/" + fileName

const addEnvConvig = `import dotenv from "dotenv"

dotenv.config()`

const fileContent = `\n\nexport const ${inputName}FileUpload = async (req, res) => {
    try {
        const filePath = process.env.BASE_URL + req.file.destination.split("/")[1] + "/" + req.file.filename
    res.json(successResponse(filePath))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}`;

const fileContent2 = `import { successResponse, errorResponse } from "../vendor/response.js";

import dotenv from "dotenv"

dotenv.config()

export const ${inputName}FileUpload = async (req, res) => {
    try {
      const filePath = process.env.BASE_URL + req.file.destination.split("/")[1] + "/" + req.file.filename
      res.json(successResponse(filePath))
    } catch (error) {
        res.status(400).json(errorResponse(error))
    }
}`

try {
    if (!process.argv[2]) {
        throw 'file name is required'
    }
    if (fs.existsSync(fullPath)) {
        fs.readFile(fullPath, (err, data) => {
            if (err) {
              throw err
            } else {
              let fileData2 = data.toString();

              if (!fileData2.includes(`import dotenv from "dotenv"`) ) {
                fileData2 = fileData2.replace("dotenv.config()", addEnvConvig)
              }
              if (!fileData2.includes(`dotenv.config()`)) {
                fileData2 = fileData2.replace(`import dotenv from "dotenv"`, addEnvConvig)
              }

              const appendText = fileData2 + fileContent
          
              fs.writeFile(fullPath, appendText, (err) => {
                  if (err) throw err;
                  console.log(`${inputName}ImageUpload has been added to ${fileName}`);
              });
            }
          });
    } else {
        fs.writeFile(fullPath, fileContent2, (err) => {
          if (err) throw err;
          console.log(`controller ${fileName} has been created!`);
        });
    }

} catch (error) {
  console.error(error);
}
