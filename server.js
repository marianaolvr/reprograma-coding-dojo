const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const servidor = express()
const pokemonsController = require('./PokemonsController')
const treinadoresController = require('./TreinadoresController')
const PORT = 3000

servidor.use(cors())
servidor.use(bodyParser.json())

servidor.get('/', (request, response) => {
  response.send('Olá, mundo!')
})

servidor.get('/pokemons', async (request, response) => {
  pokemonsController.getAll()
    .then(pokemons => response.send(pokemons))
})

servidor.get('/pokemons/:pokemonId', (request, response) => {
  const pokemonId = request.params.pokemonId
  pokemonsController.getById(pokemonId)
    .then(pokemon => {
      if(!pokemon){
        response.sendStatus(404)
      } else {
        response.send(pokemon)
      }
    })
    .catch(error => {
      if(error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.patch('/pokemons/:id', (request, response) => {
  const id = request.params.id
  pokemonsController.update(id, request.body)
    .then(pokemon => {
      if(!pokemon) { response.sendStatus(404) }
      else { response.send(pokemon) }
    })
    .catch(error => {
      if(error.name === "MongoError" || error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.patch('/pokemons/treinar/:id', (request, response) => {
  const id = request.params.id
  pokemonsController.treinar(id, request.body)
    .then(pokemon => {
      if(!pokemon) { response.sendStatus(404) }
      else { response.send(pokemon) }
    })
    .catch(error => {
      if(error.name === "MongoError" || error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.post('/pokemons', (request, response) => {
  pokemonsController.add(request.body)
    .then(pokemon => {
      const _id = pokemon._id
      response.send(_id)
    })
    .catch(error => {
      if(error.name === "ValidationError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

// Rotas TREINADORES

servidor.get('/treinadores', async (request, response) => {
  treinadoresController.getAll()
    .then(treinadores => response.send(treinadores))
})

servidor.get('/treinadores/:treinadorId', (request, response) => {
  const treinadorId = request.params.treinadorId
  treinadoresController.getById(treinadorId)
    .then(treinador => {
      if(!treinador){
        response.sendStatus(404)
      } else {
        response.send(treinador)
      }
    })
    .catch(error => {
      if(error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.patch('/treinadores/:id', (request, response) => {
  const id = request.params.id
  treinadoresController.update(id, request.body)
    .then(treinador => {
      if(!treinador) { response.sendStatus(404) }
      else { response.send(treinador) }
    })
    .catch(error => {
      if(error.name === "MongoError" || error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.post('/treinadores', (request, response) => {
  treinadoresController.add(request.body)
    .then(treinador => {
      const _id = treinador._id
      response.send(_id)
    })
    .catch(error => {
      if(error.name === "ValidationError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.listen(PORT)
console.info(`Rodando na porta ${PORT}`)
