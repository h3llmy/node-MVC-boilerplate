import express from 'express'
import { add, list, detail, update, remove } from '../../controller/nameController.js'
import { auth, isAdmin } from '../../middleware/authMiddleware.js'

const router = express.Router()

  router.post('/add', auth, add)
  router.get('/list', list)
  router.get('/detail/:name_id', auth, detail)
  router.put('/update/:name_id', auth, update)
  router.delete('/delete/:name_id', auth, remove)

export default router