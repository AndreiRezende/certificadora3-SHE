import Users from '../models/Users.js'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const privateRoute = async (req, res) => {

    const id = req.params.id

    const user = await Users.findOne({where: {id: id }, attributes: {exclude: ['password']}})

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    res.status(200).json({ user });
}

export function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    const decoded = jwt.verify(token, secret);
    req.user = decoded; 

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

export const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Apenas administradores têm acesso a esta funcionalidade.' });
  }
  next();
};

export const createUser = async (req, res) => {
    
    const {name, phone, cpf, email, password, confirmPassword} = req.body

    if(!name){
        return res.status(422).json({msg: "Campo nome obrigatório!"})
    }

    if(!phone){
        return res.status(422).json({msg: "Campo telefone obrigatório!"})
    }

    if(!cpf){
        return res.status(422).json({msg: "Campo CPF obrigatório"})
    }

    if(!email){
        return res.status(422).json({msg: "Campo e-mail obrigatório!"})
    }

    if(!password){
        return res.status(422).json({msg: "Campo senha obrigatório!"})
    }

     if(password != confirmPassword){
        return res.status(422).json({msg: "A senha e a confirmação de senha tem que ser iguais!"})
    }

    const user = await Users.findOne({where: {email: email}})

    if(user){
        return res.status(422).json({msg: "Por favor utilize outro email!"})
    }

    const salt = await bcrypt.genSalt(12)
    const passworHash = await bcrypt.hash(password, salt)


    try{
    const createToUser = {
        id: crypto.randomUUID(),
        name: req.body.name,
        phone: req.body.phone,
        cpf: req.body.cpf,
        email: req.body.email,
        password: passworHash
    }

    const user = await Users.create(createToUser)

    res.status(201).json(user)
    }catch (err){
        res.status(500).json(err)
    }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  
  if (email === 'admin' && password === 'admin') {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      { id: 'admin-id', role: 'admin' }, // role = admin
      secret,
      { expiresIn: '12h' }
    );
    return res.status(200).json({ msg: 'Login admin realizado com sucesso!', token });
  }

 
  if (!email) {
    return res.status(422).json({ msg: 'O campo email é obrigatório!' });
  }

  if (!password) {
    return res.status(422).json({ msg: 'O campo senha é obrigatório!' });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ msg: 'Senha inválida' });
    }

    const secret = process.env.SECRET;
    const token = jwt.sign(
      { id: user.id, role: 'user' }, 
      secret,
      { expiresIn: '12h' }
    );

    res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token });

  } catch (error) {
    res.status(500).json({ msg: 'Erro ao autenticar', error: error.message });
  }
};


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
        const user = await Users.findByPk(req.params.id)
        
        if(!user){
            res.status(404).json({message: "Usuário não encontrado"})
        }

        await user.destroy()

        return res.status(200).json({msg: "Ideia e usuário deletado com sucesso!"})
    }catch(err){
        res.status(500).json(err)
    }
}