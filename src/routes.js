import express from 'express'
import { createUser, updateUser, deleteUser, login, privateRoute, checkToken } from './controllers/UserControllers.js'
import { createIdeia, getAllIdeias, deleteIdeia, updateIdeia } from './controllers/IdeiasController.js'

const router = express.Router()

router.post('/auth/register', createUser)
router.post('/auth', login)
router.get('/user/:id', checkToken, privateRoute)
router.put('/auth/update/:id', updateUser)
router.delete('/auth/delete/:id', deleteUser)

router.post('/search/ideia', createIdeia)
router.get('/search/allIdeia', getAllIdeias)
router.put('/search/updateIdeia/:id', updateIdeia)
router.delete('/search/delete/:id', deleteIdeia)

export default router