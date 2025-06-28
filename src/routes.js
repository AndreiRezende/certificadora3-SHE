import express from 'express'
import { createUser, updateUser, deleteUser, login, privateRoute, checkToken, checkAdmin } from './controllers/UserControllers.js'
import { createIdeia, getIdeias, deleteIdeia, approveIdeia, getAllIdeias } from './controllers/IdeiasController.js'

const router = express.Router()

router.post('/auth/register', createUser)
router.post('/auth', login)
router.get('/user/:id', checkToken, privateRoute)
router.put('/auth/update/:id', updateUser)
router.delete('/auth/delete/:id', deleteUser)

router.post('/search/ideia', checkToken, createIdeia)
router.get('/search/getIdeia', checkToken, getIdeias)
router.get('/search/admin/allIdeias', checkToken, checkAdmin, getAllIdeias)
router.delete('/search/admin/delete/:id', checkToken, checkAdmin, deleteIdeia)
router.put('/search/admin/approveIdeia/:id', checkToken, checkAdmin, approveIdeia)

export default router