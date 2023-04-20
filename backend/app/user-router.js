
let jwt = require('jsonwebtoken');
const config = require('../config/config');



module.exports=  function(express,user) {
    let usersRouter = express.Router();

    usersRouter.use(function(req, res, next){

        let token = req.body.token || req.params.token || req.headers['x-access-token'] || req.body.query;

        console.log(token);

        if (token){

            jwt.verify(token, config.secret, function (err, decoded){

                if (err){
                    return res.status(403).send({
                        success:false,
                        message:'Wrong token'
                    });

                } else {
                    req.decoded=decoded;
                    next();
                }

            });

        } else {
            console.log("No token")

            return res.status(403).send({
                success:false,
                message:'No token'
            });

        }
    });

    usersRouter.get('',(req,res)=>{
        user.find({}).then((lists)=>{
            res.send(lists);
        })

    });


    usersRouter.get('/:id', (req, res) => {
        const id = req.params.id;
        user.findById(id, (err, foundUser) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(foundUser);
            }
        });
    });


    return usersRouter;

}