import crypto from "node:crypto"
import Ideias from "../models/Ideias.js"

export const createIdeia = async (req, res) => {

    const {title, description, category} = req.body

    if(!title || !description || !category){
        res.status(400).json({message: "Campos obrigatórios"})
    }
    
    try{
        const ideiaToCreate = {
            id: crypto.randomUUID(),
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }

        const ideia = await Ideias.create(ideiaToCreate)

        res.status(201).json(ideia)
    }catch(err){
        res.status(500).json(err)
    }
}

export const getAllIdeias = async (req, res) => {
    
    try{
        const ideia = await Ideias.findAll()

        res.status(200).json(ideia)
    }catch(err){
        res.status(500).json(err)
    }
}

export const updateIdeia = async (req, res) => {

    const ideiaID = req.params.id

    try{
        const ideia = await Ideias.findByPk(ideiaID)
        if(!ideia){
            return res.status(404).json({message: "A ideia não existe no BD"})
        }

        if(ideia.status === "Aprovada" || ideia.status === "Rejeitada"){
            return res.status(403).json({message: "A ideia não pode ser motificada"})
        }

        const camposProibidos = ['votes', 'status'];
        const camposInvalidos = Object.keys(req.body).filter(campo => camposProibidos.includes(campo));

        if (camposInvalidos.length > 0) {
            return res.status(400).json({
            message: `Os seguintes campos não podem ser atualizados: ${camposInvalidos.join(', ')}`
            });
        }

        const { title, description, category } = req.body;
        const atualizacoes = { title, description, category };


        await ideia.update(atualizacoes)

        return res.status(200).json({message: "Ideia atualizada com sucesso!"})
    }catch(err){ 
        return res.status(500).json(err)
    }
}

export const deleteIdeia = async (req,res) => {
    
    try{
        const ideia = await Ideias.destroy({
            where: {
                id: req.params.id
            }
        })

        if(!ideia){
            res.status(404).json({message: "Ideia não encontrada"})
        }

        res.status(200).json(ideia)
    }catch(err){
        res.status(500).json(err)
    }
}