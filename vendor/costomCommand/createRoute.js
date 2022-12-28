import fs from 'fs';

try {
  const inputName = process.argv[2]
  const fileName = process.argv[2] + "Route.js";
  const fullPath =  "'current', ../../route/v1/" + fileName
  const filePath2 = "'current', ../../route/route.js";
  const fileContent = 
`import express from 'express'
import { add, list, detail, update, remove } from '../../controller/${inputName}Controller.js'
import { auth, isAdmin } from '../../middleware/authMiddleware.js'

const router = express.Router()

  router.post('/add', auth, add)
  router.get('/list', auth, list)
  router.get('/detail/:${inputName}_id', auth, detail)
  router.put('/update/:${inputName}_id', auth, update)
  router.delete('/delete/:${inputName}_id', auth, remove)

export default router`;

  if (fs.existsSync(fullPath)) {
    throw `route ${fileName} has already exsist`
  }
    if (!process.argv[2]) {
      throw 'file name is required'
  }
  fs.writeFile(fullPath, fileContent, (err) => {
    if (err) throw err;
    fs.readFile(filePath2, (err, data) => {
      if (err) {
        throw err
      } else {
        let fileData2 = data.toString();
        fileData2 = fileData2.split('\nexport')
        .join(`rootRouter.use('/${inputName}', ${inputName }Route)\n\nexport`);
        fileData2 = fileData2.split('\nconst rootRouter')
        .join(`import ${inputName}Route from './v1/${fileName}'\n\nconst rootRouter`)
        fileData2 = fileData2.replace(fileData2, fileData2);
    
        fs.writeFile(filePath2, fileData2, (err) => {
          if (err) {
            throw err
          } else {
            console.log('\x1b[32m%s\x1b[0m', `route ${fileName} has been created!`);
          }
        });
      }
    });
  });
} catch (error) {
  console.log('\x1b[31m%s\x1b[0m', error);
}