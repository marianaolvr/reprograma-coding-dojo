const { connect } = require('./PokemonsRepository')
const pokemonsModel = require('./PokemonsSchema')

connect()

const calcularNivel = datas => {
  const diff = Math.abs(new Date(datas.dataInicio) - new Date(datas.dataFim)) / 3600000
  return diff / 4 + nivelAnterior;
}

const getAll = () => {
  return pokemonsModel.find((error, pokemons) => {
    return pokemons
  })
}

const getById = (id) => {
  return pokemonsModel.findById(id)
}

const add = (pokemon) => {
  const novoPokemon = new pokemonsModel(pokemon)
  return novoPokemon.save()
}

const remove = (id) => {
  return pokemonsModel.findByIdAndDelete(id)
}

const update = (id, pokemon) => {
  return pokemonsModel.findByIdAndUpdate(
    id,
    { $set: pokemon },
    { new: true },
  )
}

const treinar = async (id, datas) => {
  const pokemon = await pokemonsModel.findById(id, 'nivel')
  const nivelAnterior = pokemon.nivel

  if (nivelAnterior >= 150){
    throw new Error('deu ruim', 500) //throw = return | Error é uma classe
  }

  return pokemonsModel.findByIdAndUpdate(
    id,
    { $set: { nivel: calcularNivel(datas, nivelAnterior) } },
    { new: true },
  )
}

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  treinar
}
