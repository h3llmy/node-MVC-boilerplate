import express from 'express'
import 'express-async-errors'
import {
  add,
  list,
  detail,
  update,
  remove,
  removeFile,
  createReport,
} from '../../controller/exampleController.js'
import { protect, isAdmin } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.post('/add', isAdmin, add)
router.get('/list', list)
router.get('/report/create', isAdmin, createReport)
router.get('/detail/:example_id', protect, detail)
router.put('/update/:example_id', isAdmin, update)
router.delete('/delete/:example_id', isAdmin, remove)
router.delete('/delete/file/:file_id', isAdmin, removeFile)

export default router