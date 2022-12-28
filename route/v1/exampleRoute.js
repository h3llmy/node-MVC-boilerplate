import express from 'express'
import { add, list, detail, update, remove } from '../../controller/exampleController.js'
import { auth, isAdmin, isPublic } from '../../middleware/authMiddleware.js'

const router = express.Router()

    router.post('/add', auth, isAdmin, add)
    router.get('/list', isPublic, list)
    router.get('/detail/:example_id', detail)
    router.put('/update/:example_id', update)
    router.delete('/delete/:example_id', remove)

export default router