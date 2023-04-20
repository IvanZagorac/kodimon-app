const mongoose=require("mongoose");

const battleSchema=new mongoose.Schema({
    pokemon1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemons'
    },
    pokemon2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemons'
    },
    logs:[String],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemons'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    time: { type: Date, default: Date.now }


})

module.exports=mongoose.model("battle",battleSchema);