require('dotenv-safe').load()
const { connect } = require('./PokemonsApiRepository')
const treinadoresModel = require('./TreinadoresSchema')
const { pokemonsModel } = require('./PokemonsSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

const add = async (treinador) => {

  const treinadorEncontrado = await treinadoresModel.findOne({email: treinador.email})
  
  if (treinadorEncontrado){
throw new Error ('E-mail já cadastrado') // não permite um usuário colocar um e-mail já cadastrado.
  } 
//criar hash da senha  do usuário usando Bcrypt
const salt = bcrypt.genSaltSync(10) // gera um tipo de objeto falando qual a complexidade do hash que eu vou gerar
const senhaCriptografada = bcrypt.hashSync(treinador.senha, salt)
treinador.senha = senhaCriptografada //faz a senha aparecer criptografada no postman(no banco)


  const novoTreinador = new treinadoresModel(treinador) // ({...treinador, senha: senhaCriptografada}) = spread substitui a linha 36

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

  return treinadoresModel.findOneAndUpdate( // o primeiro parametro do findOneAndUpdate é uma query com filtros que devem ser procurados
    { _id: treinadorId, "pokemons._id": pokemonId }, //segundo parâmetro da função findOneAndUpdate //set faz update dos atributos que a gente passar para ele
    { $set: { "pokemons.$": { ...pokemon, _id: pokemonId } } }, // sem usar o spread operator (...), obteremos um objeto dentro de outro (ao invés de vários atributos para alterar o pokemon)
    { new: true } // precisamos disso para retornar uma nova instância do pokemon que encontramos, para podermos vê-lo atualizado
  )
}

// $ cifraozinho é como se fosse uma variável, não carrega valor até que eu coloque um valor nele - significa que eu to acessando um index especídico de um pokemon que eu estou procurando
// embeded pokemon.$
//... spread - pego o objeto que tenho lá dentro e espalho dentro do objeto que estou criado
// new true - vai lá acha esse pokém faz os updates que eu passei e no final da um find nele de novo para me retornar ele alterado porque a função retornava uma "promisse"


const getByPokemonId = async (treinadorId, pokemonId) => {
  const treinador = await getById(treinadorId)
  return treinador.pokemons.find(pokemon => {
    return pokemon._id == pokemonId //argumento do find é que cada vez que ele tá um loop pelo pokemon me trás um pokemon


  })
}

const login = async (loginData) => {
  const treinadorEncontrado = await treinadoresModel.findOne(
    { email: loginData.email }
  )

  if (treinadorEncontrado) {

    const senhaCorreta = bcrypt.compareSync(loginData.senha, treinadorEncontrado.senha) //compara 


    if (senhaCorreta) {
      const token = jwt.sign(
        { email: treinadorEncontrado.email, id: treinadorEncontrado._id },
        process.env.PRIVATE_KEY
      )

      return { auth: true, token }; //quando vc tem uma chave que gera o mesmo nome do seu valor pode colocar uma só vez e não  token: token
    } else {
      throw new Error('Senha incorreta, prestenção parça') // throw imediatamente sai da função

    }
  } else {
    throw new Error('Email não está cadastrado')
  }
}






module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  addPokemon,
  treinarPokemons,
  getPokemons,
  updatePokemon,
  getByPokemonId,
  login,
}
