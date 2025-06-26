import Users from '../models/Users.js'
import crypto from 'node:crypto'


export const createUser = async (req, res) => {
    
    try{
    const createToUser = {
        id: crypto.randomUUID(),
        name: req.body.name,
        phone: req.body.phone,
        cpf: req.body.cpf,
        email: req.body.email,
        password: req.body.password
    }

    const user = await Users.create(createToUser)

    res.status(201).json(user)
    }catch (err){
        res.status(500).json(err)
    }
}

export const getAllUsers = async (req, res) => {
    
    try{
        const user = await Users.findAll()
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
}

export const updateUser = async (req, res) => {

    const userID = req.params.id

    try{
        const user = await Users.findByPk(userID)
        if(!user){
            res.status(404).json({message: "Usuário não encontrado"})
        }

        await user.update(req.body)

        res.status(200).json({message: "Usuário atualizado com sucesso"})
    }catch(err){
        res.status(500).json(err)
    }
}

export const deleteUser = async (req,res) => {
    try{
        const user = await Users.destroy({
            where: {
                id: req.params.id
            }
        })
        
        if(!user){
            res.status(404).json({message: "Usuário não encontrado"})
        }

        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
}