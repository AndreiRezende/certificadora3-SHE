import crypto from "node:crypto"
import Ideias from "../models/Ideias.js"
import { Op } from 'sequelize';
import Users from "../models/Users.js";


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


export const getIdeias = async (req, res) => {
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


export const deleteIdeia = async (req, res) => {
  try {
    const ideia = await Ideias.findByPk(req.params.id, {
      include: {
        model: Users,
        as: "owner",
        attributes: ["name"]
      }
    });

    if (!ideia) {
      return res.status(404).json({ message: "Ideia não encontrada" });
    }

    const userName = ideia.owner?.name || "usuário desconhecido";

    await ideia.destroy();

    return res.status(200).json({
      msg: `Ideia deletada com sucesso do usuário ${userName}`
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar a ideia", error: err.message });
  }
};


export const approveIdeia = async (req, res) => {
  const { id } = req.params;

  try {
    const ideia = await Ideias.findByPk(id);
    if (!ideia) return res.status(404).json({ msg: 'Ideia não encontrada' });

    if (ideia.status !== 'Em análise') {
      return res.status(400).json({ msg: 'Só é possível aprovar ideias que estão em análise.' });
    }

    ideia.status = 'Aprovada';
    await ideia.save();

    res.status(200).json({ msg: 'Ideia aprovada com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao aprovar ideia', error: err.message });
  }
};


export const getVoteIdeia = async (req, res) => {
  try {
    const userId = req.user.id;

    const ideias = await Ideias.findAll({
      where: {
        user_id: { [Op.ne]: userId },     
        status: 'Aprovada'               
      },
      order: [['createdAt', 'DESC']]      
    });

    res.status(200).json(ideias);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar ideias para votação', error: err.message });
  }
};

export const getAllIdeiasAdmin = async (req, res) => {
  try {
    console.log('🔍 Buscando ideias em análise...');
    
    // Usar exatamente o valor do ENUM: 'Em análise'
    const ideias = await Ideias.findAll({
      where: {
        status: 'Em análise'  // Exatamente como está no ENUM
      },
      order: [['createdAt', 'DESC']]
    });

    console.log('📊 Ideias em análise encontradas:', ideias.length);
    console.log('📋 Ideias:', ideias.map(i => ({ id: i.id, title: i.title, status: i.status })));

    res.status(200).json(ideias);
    
  } catch (err) {
    console.error('❌ Erro ao buscar ideias:', err);
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
  }
};

export const voteIdeia = async (req, res) => {
  try {
    const ideiaId = req.params.id;
    const userId = req.user.id;

    const ideia = await Ideias.findByPk(ideiaId);

    if (!ideia) {
      return res.status(404).json({ msg: "Ideia não encontrada." });
    }

    if (ideia.user_id === userId) {
      return res.status(403).json({ msg: "Você não pode votar na sua própria ideia." });
    }

    if (ideia.status !== "Aprovada") {
      return res.status(403).json({ msg: "Só é possível votar em ideias aprovadas." });
    }

    ideia.votes += 1;
    await ideia.save();

    res.status(200).json({ msg: "Voto registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao registrar voto", error: err.message });
  }
};

export const getRanking = async (req, res) => {
  try {

    const ideias = await Ideias.findAll({
      where: {
        status: 'Aprovada',
        votes: {
          [Op.gt]: 0 
        }
      },
      order: [['votes', 'DESC']]
    });

    res.status(200).json(ideias);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar ideias para ranking', error: err.message });
  }
};


