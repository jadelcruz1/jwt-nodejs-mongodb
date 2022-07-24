// imports 
require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Modules
const User = require('./models/User')


const app = express()

// Config JSON response
app.use(express.json())

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" })
})

// Register User 
app.post('/auth/register', async (req, res)=> {

    const {name, email, password, confirmpassword} =  req.body

    // validations
    if(!name){
        return res.status(422).json({ msg: "O nome é obrigatório! "})
    }
    if(!email){
        return res.status(422).json({ msg: "O email é obrigatório! "})
    }
    if(!password){
        return res.status(422).json({ msg: "A senha é obrigatório! "})
    }

    if( password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas não conferem ! "})
    }

    // check if user exist
    const userExists = await User.findOne({ email: email })

    if(userExists){
        return res.status(422).json({ msg: "Por favor, utilize outro email! "})
    }

    // Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save()
        res.status(201).json({ msg: 'Usuário criado com sucesso!'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente mais tarde!'})
        
    }
})

// Login User 
app.post('/auth/login', async (req, res) => {
    const { email, password } =  req.body

    // validations
    if(!email){
        return res.status(422).json({ msg: "O email é obrigatório! "})
    }
    if(!password){
        return res.status(422).json({ msg: "A senha é obrigatório! "})
    }
   
 
    //check if user exists

    const user = await User.findOne({ email: email})

    if(!user){
        return res.status(404).json({ msg: 'Usuário não encontrado!'})
    }
    
    // // check if password match
    // const checkPassword = await bcrypt.compare(password, user.password)

    // if(!checkPassword) {
    //     return res.status(422).json({ msg: 'Senha inválida.'})
    // }

    // parei com 50 minutos pois a aplicação não está enviando a senha para o mongodb


})


// Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.agh3t.mongodb.net/?retryWrites=true&w=majority`)
  .then(()=> {
    app.listen(3000)
    console.log('Conectou ao banco com sucesso!')

  })
  .catch((err)=> console.log(err))


