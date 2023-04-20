const mongoose=require("mongoose");

const pokemonSchema=new mongoose.Schema({
    name: String,
    url: String,
    defense: Number,
    speed: Number,
    attack: Number,
    hp: Number
})

module.exports=mongoose.model("Pokemons",pokemonSchema);