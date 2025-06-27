import express from 'express'
import routes from './routes.js'
import connection from './models/index.js'
import dotenv from 'dotenv';
dotenv.config();


const app = express()

app.use(express.json())

app.use('/login', routes)

connection.authenticate().then(() => {
    console.log("Banco de dados conectado com sucesso")

    app.listen(3000, () => {
    console.log(`Server running port http://localhost:3000`)
})
}).catch((err) => {
    console.error(err)
})

