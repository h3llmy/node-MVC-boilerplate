import express from 'express'
import { add, list, detail, update, remove, mantapFileUpload } from '../../controller/exampleController.js'
import { auth, isAdmin, isPublic } from '../../middleware/authMiddleware.js'
import { uploadImage } from '../../middleware/fileUploadMiddleware.js'

const router = express.Router()

 router.post('/add', auth, isAdmin, add)
 router.get('/list', isPublic, list)
 router.get('/detail/:example_id', auth, isAdmin, detail)
 router.put('/update/:example_id', auth, isAdmin, update)
 router.delete('/delete/:example_id', auth, isAdmin, remove)
 router.post('/upload/file', uploadImage.single("mantap"), mantapFileUpload)

 export default router