import express from 'express'
import loginRoutes from './routes.js'
import ideiaUsers from './routes.js'
import connection from './models/index.js'

const app = express()

app.use(express.json())

app.use('/login', loginRoutes)
app.use('/pesquisa', ideiaUsers)

connection.authenticate().then(() => {
    console.log("Banco de dados conectado com sucesso")

    app.listen(3000, () => {
    console.log(`Server running port http://localhost:3000`)
})
}).catch((err) => {
    console.error(err)
})

