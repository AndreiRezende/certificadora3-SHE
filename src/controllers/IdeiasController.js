import crypto from "node:crypto"
import Ideias from "../models/Ideias.js"
import { Op } from 'sequelize';


export const createIdeia = async (req, res) => {
    const { title, description, category } = req.body;
    const user_id = req.user.id; 

    if (!title || !description || !category) {
        return res.status(400).json({ message: "Campos obrigatórios" });
    }

    try {
        const ideiaToCreate = {
            id: crypto.randomUUID(),
            title,
            description,
            category,
            user_id
        };

        const ideia = await Ideias.create(ideiaToCreate);

        return res.status(201).json(ideia);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const getAllIdeias = async (req, res) => {
  try {
    const userId = req.user.id; 
    const ideias = await Ideias.findAll({
      where: {
        user_id: {
          [Op.ne]: userId 
        }
      }
    });

    res.status(200).json(ideias);
  } catch (err) {
    res.status(500).json(err);
  }
};


export const deleteIdeia = async (req,res) => {
    
    try{
        const ideia = await Ideias.destroy({
            where: {
                id: req.params.id
            }
        })

        if(!ideia){
            return res.status(404).json({message: "Ideia não encontrada"})
        }

        res.status(200).json(ideia)
    }catch(err){
        res.status(500).json(err)
    }
}

export const approveIdeia = async (req, res) => {
  const { id } = req.params;

  try {
    const ideia = await Ideias.findByPk(id);
    if (!ideia) return res.status(404).json({ msg: 'Ideia não encontrada' });

    ideia.status = 'Aprovada';
    await ideia.save();

    res.status(200).json({ msg: 'Ideia aprovada com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao aprovar ideia', error: err.message });
  }
};