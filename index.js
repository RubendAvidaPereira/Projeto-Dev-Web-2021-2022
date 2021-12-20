// ===========================================================================================================================
// ===========================================================================================================================
// Main Imports and Modules
const express = require('express') // Load da framework Express
const cors = require('cors') // Load da module cors, necessário para o controlo dos headers e cross origin resource.
const path = require('path') // Load do module path
const ejs = require('ejs') // Load do module ejs
const cookie_parser = require('cookie-parser') // Load do module cookie-parser, necessário para controlo de autentificacao

const routes = require('./routes/routes.js') // Especificar o ficheiro das rotas

const app = express()


// ===========================================================================================================================
// ===========================================================================================================================
// Express Framework must use the following
app.use(cookie_parser())
app.use(express.json()) // Parse de requests to tipo application/json
app.use(express.urlencoded({ extended: true })) // Parse de conteudo do tipo application/x-www-from-urlencoded
app.use(express.static('public')) // Faz uso da pasta public

/**
 * Manipulação dos headers quando acontece os requests
 */
app.use(cors({
    'origin': '*',
    'methods': 'GET, POST',
}))


// ===========================================================================================================================
// ===========================================================================================================================
// Diretorio das Views
app.set('views', path.join(__dirname, '/public/templates'))

app.set('view engine', 'ejs')

app.use('/', routes) // Application Routes


// ===========================================================================================================================
// ===========================================================================================================================
// Server Listening on Port 8080
const PORT = 8080 // Porta onde o servidor vai escutar os pedidos e executar os requests
app.listen(PORT, () => {
    console.log(`Server Running - PORT ${PORT}`)
})

