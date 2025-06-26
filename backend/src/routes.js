import express from 'express'
import { createUser, getAllUsers, updateUser, deleteUser } from './controllers/UserControllers.js'
import { createIdeia, getAllIdeias, deleteIdeia, updateIdeia } from './controllers/IdeiasController.js'

const router = express.Router()

router.post('/cadastro', createUser)
router.get('/todos', getAllUsers)
router.put('/atualizar/:id', updateUser)
router.delete('/deletar/:id', deleteUser)

router.post('/ideias', createIdeia)
router.get('/todasIdeias', getAllIdeias)
router.put('/atualizarIdeias/:id', updateIdeia)
router.delete('/deletarIdeia/:id', deleteIdeia)

export default router