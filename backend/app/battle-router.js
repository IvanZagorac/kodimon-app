
module.exports=function(express,battle){
    let battleRouter=express.Router();

    battleRouter.post('',(req,res)=>{
        let pokemon1=req.body.pokemon1;
        let pokemon2=req.body.pokemon2;
        let logs=req.body.logs;
        let winner=req.body.winner;
        let userId=req.body.userId;

        const battles= new battle({
            pokemon1:pokemon1,
            pokemon2:pokemon2,
            logs:logs,
            winner: winner,
            userId:userId
        })

        battles.save().then((battleList)=>{
            res.status(201).json({ battleList });
        })

    })

    battleRouter.get('',(req,res)=>{
        battle.find({})
            .sort({ createdAt: -1 })
            .populate('pokemon1')
            .populate('pokemon2')
            .populate('winner')
            .then(battleList=>{
                res.send(battleList);
            })

    });

    battleRouter.delete("/:id",(req,res)=>{
        battle.findOneAndRemove({_id:req.params.id}).
        then((removedList)=>{
            res.send(removedList);
        })
    })



    return battleRouter;

}