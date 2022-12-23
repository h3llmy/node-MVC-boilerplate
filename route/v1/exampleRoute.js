import express from 'express'
import { add, list, detail, update, remove } from '../../controller/exampleController.js'
import { auth, isAdmin, isPublic } from '../../middleware/authMiddleware.js'

const router = express.Router()

 router.post('/add', auth, isAdmin, add)
 router.get('/list', isPublic, list)
 router.get('/detail/:example_id', auth, isAdmin, detail)
 router.put('/update/:example_id', auth, isAdmin, update)
 router.delete('/delete/:example_id', auth, isAdmin, remove)

 export default router