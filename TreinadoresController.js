const { connect } = require('./PokemonsApiRepository')
const treinadoresModel = require('./TreinadoresSchema')
const { pokemonsModel } = require('./PokemonsSchema')
const LIMITE_NIVEL_POKEMON = 150

connect()

const calcularNivel = (datas, nivelAnterior) => {
  const diff = Math.abs(new Date(datas.dataInicio) - new Date(datas.dataFim)) / 3600000
  const novoNivel = diff / 4 + nivelAnterior;

  return novoNivel >= LIMITE_NIVEL_POKEMON ? LIMITE_NIVEL_POKEMON : novoNivel;
}


const getAll = () => {
  return treinadoresModel.find((error, treinadores) => {
    return treinadores
  })
}

const getById = (id) => {
  return treinadoresModel.findById(id)
}

const add = (treinador) => {
  const novoTreinador = new treinadoresModel(treinador)
  return novoTreinador.save()
}

const remove = (id) => {
  return treinadoresModel.findByIdAndDelete(id)
}

const update = (id, treinador) => {
  return treinadoresModel.findByIdAndUpdate(
    id,
    { $set: treinador },
    { new: true },
  )
}

const addPokemon = async (treinadorId, pokemon) => {
  const treinador = await getById(treinadorId)
  const novoPokemon = new pokemonsModel(pokemon)

  treinador.pokemons.push(novoPokemon)
  return treinador.save()
}

const treinarPokemons = async (treinadorId, pokemonId, datas) => {
  const treinador = await getById(treinadorId)
  const pokemon = treinador.pokemons.find(pokemon => pokemon._id == pokemonId)

  if (pokemon.nivel >= LIMITE_NIVEL_POKEMON) {
    throw new Error('Seu pokémon já é forte o suficiente!')
  }

  pokemon.nivel = calcularNivel(datas, pokemon.nivel)
  return treinador.save()
}

const getPokemons = async treinadorId =>{
  const treinador = await getById(treinadorId)
  return treinador.pokemons
}

const updatePokemon = (treinadorId, pokemonId, pokemon) => {
  pokemon._id = pokemonId
  return treinadoresModel.findOneAndUpdate(
    { _id: treinadorId, "pokemons._id": pokemonId   }, // o primeiro parametro do findOneAndUpdate é uma query com filtros que devem ser procurados
    { $set: { "pokemons.$": {...pokemon, _id: pokemonId}}},  //segundo parâmetro da função findOneAndUpdate //set faz update dos atributos que a gente passar para ele
    { new: true }
    )
} 

// $ cifraozinho é como se fosse uma variável, não carrega valor até que eu coloque um valor nele - significa que eu to acessando um index especídico de um pokemon que eu estou procurando
// embeded pokemon.$
//... spread - pego o objeto que tenho lá dentro e espalho dentro do objeto que estou criado
// new true - vai lá acha esse pokém faz os updates que eu passei e no final da um find nele de novo para me retornar ele alterado porque a função retornava uma "promisse"

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  addPokemon,
  treinarPokemons,
  getPokemons,
  updatePokemon
}
