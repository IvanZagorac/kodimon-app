module.exports=function(express,pokemon,config,battle){
    let pokemonRouter=express.Router();

    const logicForNewOponent=async(pokemonList)=>{
        const lastBattle = await battle
            .findOne()
            .sort({ time: -1 })
            .select('_id');

        const lastWinner = await battle
            .findById(lastBattle._id)
            .populate('winner')
            .select('winner logs');

        const winner = lastWinner.winner;
        const logs = lastWinner.logs;

        let pokemon1;
        let pokemon2;
        if (pokemonList.length >= 2) {
            let random;
            do {
                random = Math.floor(Math.random() * pokemonList.length);
                pokemon1=pokemonList[random];
                pokemon2=winner;
            } while (pokemon1 === pokemon2 || pokemon1._id.toString() === pokemon2._id.toString());

            return { sortedPokemons: [pokemon1, pokemon2], logs };

        }
    }


    pokemonRouter.get('/newOpponent',async(req,res)=>{
        const pokemonList = await pokemon.find({});
        const { sortedPokemons, logs } = await logicForNewOponent(pokemonList);
        res.json({
            pokemons: sortedPokemons,
            logs: logs,
        });

    });

    const logic2RandomPokemons=(pokemonList,sortedPokemons)=>{
        let pokemon1;
        let pokemon2;
        if (pokemonList.length >= 2) {
            let random1, random2;
            do {
                random1 = Math.floor(Math.random() * pokemonList.length);
                random2 = Math.floor(Math.random() * pokemonList.length);
            } while (random1 === random2);
            pokemon1=pokemonList[random1];
            pokemon2=pokemonList[random2];
            sortedPokemons.push(pokemon1);
            sortedPokemons.push(pokemon2);

        }
    }
    pokemonRouter.get('/both',(req,res)=>{
        pokemon.find({})
            .then(pokemonList=>{
                let sortedPokemons=[];
                logic2RandomPokemons(pokemonList,sortedPokemons)
                res.send(sortedPokemons);
            })


    });


    pokemonRouter.patch("/attack/:id",(req,res)=>{
        pokemon.findOneAndUpdate({_id:req.params.id},{
            $set:req.body
        }).then((pokemon)=>{

            res.send(pokemon);
            res.status(200);
        })
    })

    pokemonRouter.get('',(req,res)=>{
        pokemon.find({})
            .then(pokemonList=>{
                res.send(pokemonList);

            })

    });





        pokemonRouter.get('/photo/:id',(req,res)=>{
            pokemon.findById({_id:req.params.id})
                .then(foundUser=>{
                    if(!foundUser){
                        console.log("ne postoji pokemon")
                    }
                    let photoUrl=config.photoPath+foundUser.url;
                    res.send(photoUrl);
                })

        })

    pokemonRouter.post('',(req,res)=>{
        let name=req.body.name;
        let speed=req.body.speed;
        let defense=req.body.defense;
        let attack=req.body.attack;
        let url=req.body.url;
        let hp=req.body.hp;

        const pokemons= new pokemon({
            name:name,
            speed:speed,
            defense:defense,
            attack:attack,
            url:url,
            hp:hp
        })
        pokemons.save().then((pokemonList)=>{
            res.status(201).json({ pokemonList });
        })

    })

    return pokemonRouter;

}